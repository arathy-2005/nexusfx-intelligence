"""OHLCV synthesis and parquet ingest for research datasets."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data" / "parquet"
DATA.mkdir(parents=True, exist_ok=True)

SYMBOLS = [
    "EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD", "USDCHF", "NZDUSD",
    "XAUUSD", "XAGUSD", "BTCUSD", "ETHUSD", "DXY", "VIX",
]

BASE = {
    "EURUSD": 1.08, "GBPUSD": 1.27, "USDJPY": 149.6, "AUDUSD": 0.66,
    "USDCAD": 1.36, "USDCHF": 0.89, "NZDUSD": 0.60, "XAUUSD": 2480.0,
    "XAGUSD": 29.2, "BTCUSD": 64000.0, "ETHUSD": 2700.0, "DXY": 104.2, "VIX": 16.4,
}


def synthesize_ohlcv(symbol: str, rows: int = 8000, minutes: int = 60) -> pd.DataFrame:
    rng = np.random.default_rng(abs(hash(symbol)) % (2**32))
    price = BASE.get(symbol, 1.0)
    vol = 0.012 if "BTC" in symbol else 0.004 if symbol.startswith("X") else 0.0016
    start = datetime.now(timezone.utc) - timedelta(minutes=rows * minutes)
    records = []
    for i in range(rows):
        shock = rng.normal(0, vol)
        o = price
        c = max(price * (1 + shock), 1e-8)
        h = max(o, c) * (1 + abs(rng.normal(0, vol * 0.35)))
        l = min(o, c) * (1 - abs(rng.normal(0, vol * 0.35)))
        v = float(rng.uniform(800, 12000))
        ts = start + timedelta(minutes=i * minutes)
        records.append({"time": ts, "open": o, "high": h, "low": l, "close": c, "volume": v, "symbol": symbol})
        price = c
    return pd.DataFrame(records)


def write_parquet(symbol: str, rows: int = 8000) -> Path:
    df = synthesize_ohlcv(symbol, rows=rows)
    path = DATA / f"{symbol}_1h.parquet"
    df.to_parquet(path, index=False)
    return path


def ingest_all(rows: int = 8000) -> list[Path]:
    return [write_parquet(s, rows=rows) for s in SYMBOLS]


def load_symbol(symbol: str) -> pd.DataFrame:
    path = DATA / f"{symbol}_1h.parquet"
    if not path.exists():
        write_parquet(symbol)
    return pd.read_parquet(path)


if __name__ == "__main__":
    paths = ingest_all()
    print(f"wrote {len(paths)} parquet files -> {DATA}")
