"""Train classical + deep + RL research models and write the model registry."""
from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT.parent))

from ml.backtest.engine import backtest_signals
from ml.models.classical import make_labels, train_classifiers
from ml.models.deep import train_sequence_models
from ml.models.rl import train_research_rl
from ml.pipeline.features import build_features, feature_columns
from ml.pipeline.ingest import ingest_all, load_symbol
from ml.pipeline.patterns import label_patterns

REGISTRY = ROOT.parent / "data" / "registry"
REGISTRY.mkdir(parents=True, exist_ok=True)


def permutation_importance(model, X: pd.DataFrame, y: pd.Series, k: int = 12) -> list[dict]:
    from sklearn.metrics import accuracy_score

    y_m = y.map({-1: 0, 0: 1, 1: 2})
    base = accuracy_score(y_m, model.predict(X))
    rows = []
    rng = np.random.default_rng(0)
    for col in X.columns:
        xp = X.copy()
        xp[col] = rng.permutation(xp[col].values)
        acc = accuracy_score(y_m, model.predict(xp))
        rows.append({"feature": col, "drop": float(base - acc)})
    rows.sort(key=lambda r: r["drop"], reverse=True)
    return rows[:k]


def run(symbol: str = "EURUSD"):
    ingest_all(rows=1200)
    df = load_symbol(symbol)
    df = build_features(df)
    df = label_patterns(df)
    df = make_labels(df)
    feats = feature_columns(df)
    X = df[feats].replace([np.inf, -np.inf], np.nan).fillna(0)
    reports = {}
    import joblib

    for task, ycol in [("trend", "trend"), ("dir_h1", "dir_h1"), ("dir_h4", "dir_h4"), ("dir_d1", "dir_d1")]:
        y = df[ycol]
        mask = y.notna() & X.notna().all(axis=1)
        Xt, yt = X.loc[mask], y.loc[mask]
        reports[task] = train_classifiers(Xt, yt, task)
        champ = reports[task]["champion"]
        if champ.get("path"):
            bundle = joblib.load(champ["path"])
            reports[task]["top_features"] = permutation_importance(bundle["model"], Xt.tail(800), yt.tail(800))
        y_seq = yt.map({-1: 0, 0: 1, 1: 2}).astype(int).values
        reports[f"{task}_deep"] = train_sequence_models(Xt.values.astype(float), y_seq, task)

    side = pd.Series(np.sign(df["ema_20"] - df["ema_50"]), index=df.index)
    reports["backtest"] = backtest_signals(df["close"], side)
    reports["rl"] = train_research_rl(df["close"].pct_change().fillna(0).values)
    reports["meta"] = {
        "symbol": symbol,
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "rows": int(len(df)),
        "n_features": len(feats),
        "model_version": "nfx-ml-1.0.0",
        "disclaimer": "This application provides market analysis only and is not financial advice.",
    }
    (REGISTRY / "latest.json").write_text(json.dumps(reports, indent=2, default=str))
    print(json.dumps(reports["meta"], indent=2))
    return reports


if __name__ == "__main__":
    run()
