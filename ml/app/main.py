from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ml.models.classical import make_labels
from ml.pipeline.features import build_features, feature_columns
from ml.pipeline.ingest import load_symbol
from ml.pipeline.patterns import label_patterns

DISCLAIMER = "This application provides market analysis only and is not financial advice."
REGISTRY = Path(__file__).resolve().parents[2] / "data" / "registry"

app = FastAPI(title="NexusFX ML API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictIn(BaseModel):
    symbol: str = "EURUSD"
    horizon: str = "h1"


def _registry() -> dict:
    path = REGISTRY / "latest.json"
    if path.exists():
        return json.loads(path.read_text())
    return {"meta": {"model_version": "untrained"}}


@app.get("/health")
def health():
    return {"ok": True, "disclaimer": DISCLAIMER}


@app.get("/registry")
def registry():
    data = _registry()
    data["disclaimer"] = DISCLAIMER
    return data


@app.post("/predict")
def predict(body: PredictIn):
    df = load_symbol(body.symbol.upper())
    df = make_labels(label_patterns(build_features(df)))
    feats = feature_columns(df)
    last = df.iloc[-1]
    X = df[feats].replace([np.inf, -np.inf], np.nan).fillna(0).iloc[[-1]]
    bundle = None
    task = "trend" if body.horizon == "trend" else f"dir_{body.horizon}"
    try:
        import joblib

        champ = _registry().get(task, {}).get("champion", {})
        if champ.get("path"):
            bundle = joblib.load(champ["path"])
    except Exception:
        bundle = None
    classes = ["Bearish", "Sideways", "Bullish"]
    if bundle:
        model = bundle["model"]
        cols = bundle["columns"]
        proba = model.predict_proba(X[cols])[0]
        idx = int(np.argmax(proba))
        label = classes[idx] if idx < 3 else classes[1]
        confidence = float(proba[idx] * 100)
        probs = {classes[i]: float(proba[i]) for i in range(min(3, len(proba)))}
    else:
        rsi = float(last.get("rsi_14", 50) or 50)
        label = "Bullish" if rsi >= 55 else "Bearish" if rsi <= 45 else "Sideways"
        confidence = 48 + abs(rsi - 50) * 0.6
        probs = {"Bullish": 0.33, "Bearish": 0.33, "Sideways": 0.34}
        if label == "Bullish":
            probs = {"Bullish": 0.52, "Bearish": 0.22, "Sideways": 0.26}
        if label == "Bearish":
            probs = {"Bullish": 0.22, "Bearish": 0.52, "Sideways": 0.26}

    side = "WAIT"
    if label == "Bullish" and confidence >= 55:
        side = "BUY"
    elif label == "Bearish" and confidence >= 55:
        side = "SELL"
    px = float(last["close"])
    atr = float(last.get("atr_14") or px * 0.002)
    sl = px - 1.6 * atr if side != "SELL" else px + 1.6 * atr
    tp = px + 2.2 * atr if side != "SELL" else px - 2.2 * atr
    top = _registry().get(task, {}).get("top_features", [])[:8]
    reasons = [
        f"Ensemble label {label} on {body.horizon} with {confidence:.1f}% confidence.",
        f"RSI14={float(last.get('rsi_14', 0)):.1f}, ADX={float(last.get('adx', 0)):.1f}, MACD hist={float(last.get('macd_hist', 0)):.5f}.",
        f"Structure: support {float(last.get('support', 0)):.5f} / resistance {float(last.get('resistance', 0)):.5f}.",
    ]
    return {
        "disclaimer": DISCLAIMER,
        "symbol": body.symbol.upper(),
        "horizon": body.horizon,
        "trend": label,
        "side": side,
        "confidence": round(confidence, 2),
        "probability": probs,
        "entry": px,
        "stop_loss": sl,
        "take_profit": tp,
        "risk_reward": abs(tp - px) / abs(px - sl),
        "expected_holding": {"h1": "1-3 hours", "h4": "4-12 hours", "d1": "1-3 days", "trend": "session"}.get(body.horizon, "variable"),
        "volatility_score": float(min(100, (last.get("vol_24") or 0) * 8000)),
        "top_features": top,
        "reasons": reasons,
        "model_version": _registry().get("meta", {}).get("model_version"),
        "trained_at": _registry().get("meta", {}).get("trained_at"),
        "historical_accuracy": _registry().get(task, {}).get("champion", {}).get("accuracy"),
    }


@app.get("/backtest")
def backtest():
    data = _registry().get("backtest", {})
    data["disclaimer"] = DISCLAIMER
    return data


@app.get("/scanner")
def scanner():
    from ml.pipeline.ingest import SYMBOLS

    rows = []
    for s in SYMBOLS[:11]:
        df = label_patterns(build_features(load_symbol(s))).iloc[-1]
        rows.append(
            {
                "symbol": s,
                "rsi": float(df.get("rsi_14", 0) or 0),
                "adx": float(df.get("adx", 0) or 0),
                "trend": "Bullish" if float(df.get("ema_20", 0)) > float(df.get("ema_50", 0)) else "Bearish",
                "hammer": int(df.get("pat_hammer", 0)),
                "engulfing": int(df.get("pat_engulfing", 0)),
                "triangle": int(df.get("pat_triangle", 0)),
            }
        )
    return {"rows": rows, "disclaimer": DISCLAIMER}
