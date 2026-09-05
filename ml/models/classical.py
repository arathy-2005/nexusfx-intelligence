from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier, HistGradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, log_loss
from sklearn.model_selection import TimeSeriesSplit
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).resolve().parents[2]
REGISTRY = ROOT / "data" / "registry"
REGISTRY.mkdir(parents=True, exist_ok=True)


def make_labels(df: pd.DataFrame) -> pd.DataFrame:
    out = df.copy()
    fwd = {
        "h1": out["close"].shift(-1) / out["close"] - 1,
        "h4": out["close"].shift(-4) / out["close"] - 1,
        "d1": out["close"].shift(-24) / out["close"] - 1,
        "w1": out["close"].shift(-120) / out["close"] - 1,
    }
    for name, ret in fwd.items():
        out[f"dir_{name}"] = np.where(ret > 0.0008, 1, np.where(ret < -0.0008, -1, 0))
    trend = out["ema_20"] - out["ema_50"]
    out["trend"] = np.where(trend > 0, 1, np.where(trend < 0, -1, 0))
    return out


def _models():
    models = {
        "logistic_regression": Pipeline([("sc", StandardScaler()), ("clf", LogisticRegression(max_iter=250, class_weight="balanced"))]),
        "random_forest": RandomForestClassifier(n_estimators=80, min_samples_leaf=8, random_state=42, n_jobs=-1),
        "hist_gbm": HistGradientBoostingClassifier(max_depth=4, learning_rate=0.08, max_iter=80, random_state=42),
        "sklearn_gbm": GradientBoostingClassifier(n_estimators=40, max_depth=2, random_state=42),
    }
    try:
        from xgboost import XGBClassifier

        models["xgboost"] = XGBClassifier(n_estimators=120, max_depth=4, learning_rate=0.05, subsample=0.9, n_jobs=-1, eval_metric="mlogloss")
    except Exception:
        pass
    try:
        from lightgbm import LGBMClassifier

        models["lightgbm"] = LGBMClassifier(n_estimators=160, max_depth=5, learning_rate=0.05, verbose=-1)
    except Exception:
        pass
    try:
        from catboost import CatBoostClassifier

        models["catboost"] = CatBoostClassifier(iterations=120, depth=4, learning_rate=0.06, verbose=False)
    except Exception:
        pass
    return models


def train_classifiers(X: pd.DataFrame, y: pd.Series, task: str) -> dict:
    results = []
    split = TimeSeriesSplit(n_splits=3)
    best = None
    best_acc = -1
    y_mapped = y.map({-1: 0, 0: 1, 1: 2}) if set(y.unique()) <= {-1, 0, 1} else y
    for name, model in _models().items():
        accs = []
        losses = []
        for train_idx, test_idx in split.split(X):
            Xtr, Xte = X.iloc[train_idx], X.iloc[test_idx]
            ytr, yte = y_mapped.iloc[train_idx], y_mapped.iloc[test_idx]
            try:
                model.fit(Xtr, ytr)
                pred = model.predict(Xte)
                accs.append(float(accuracy_score(yte, pred)))
                if hasattr(model, "predict_proba"):
                    proba = model.predict_proba(Xte)
                    losses.append(float(log_loss(yte, proba, labels=sorted(y_mapped.unique()))))
            except Exception as exc:
                accs.append(0.0)
                losses.append(9.0)
                print(f"{name} fold failed: {exc}")
        mean_acc = float(np.mean(accs)) if accs else 0.0
        mean_loss = float(np.mean(losses)) if losses else 9.0
        row = {"name": name, "task": task, "accuracy": mean_acc, "log_loss": mean_loss}
        results.append(row)
        if mean_acc > best_acc:
            best_acc = mean_acc
            best = (name, model)
    if best:
        best[1].fit(X, y_mapped)
        import joblib

        path = REGISTRY / f"{task}_{best[0]}.joblib"
        joblib.dump({"model": best[1], "columns": list(X.columns), "classes": [-1, 0, 1]}, path)
        champion = {"task": task, "name": best[0], "accuracy": best_acc, "path": str(path)}
    else:
        champion = {"task": task, "name": None, "accuracy": 0}
    summary = {"task": task, "leaderboard": results, "champion": champion}
    (REGISTRY / f"{task}_leaderboard.json").write_text(json.dumps(summary, indent=2))
    return summary
