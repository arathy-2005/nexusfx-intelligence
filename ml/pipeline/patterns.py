"""Chart and candlestick pattern labels for historical datasets."""
from __future__ import annotations

import numpy as np
import pandas as pd


def label_patterns(df: pd.DataFrame) -> pd.DataFrame:
    out = df.copy()
    o, h, l, c = out["open"], out["high"], out["low"], out["close"]
    body = (c - o).abs()
    rng = (h - l).replace(0, np.nan)
    upper = h - np.maximum(c, o)
    lower = np.minimum(c, o) - l

    out["pat_doji"] = (body / rng < 0.12).astype(int)
    out["pat_hammer"] = ((lower > body * 2) & (upper < body * 0.4) & (c > o)).astype(int)
    out["pat_shooting_star"] = ((upper > body * 2) & (lower < body * 0.4) & (c < o)).astype(int)
    out["pat_marubozu"] = (body / rng > 0.75).astype(int)
    out["pat_engulfing"] = ((c > o) & (c.shift(1) < o.shift(1)) & (c > o.shift(1)) & (o < c.shift(1))).astype(int)

    roll_max = h.rolling(40).max()
    roll_min = l.rolling(40).min()
    pos = (c - roll_min) / (roll_max - roll_min).replace(0, np.nan)
    out["pat_double_top"] = ((pos > 0.92) & (pos.shift(8) > 0.9)).astype(int)
    out["pat_double_bottom"] = ((pos < 0.08) & (pos.shift(8) < 0.1)).astype(int)
    out["pat_hs"] = ((pos.shift(20) > 0.85) & (pos.shift(10) < 0.55) & (pos > 0.88)).astype(int)
    slope = c.diff(10)
    out["pat_flag"] = ((slope.abs() < c * 0.002) & (c.diff(30).abs() > c * 0.01)).astype(int)
    out["pat_triangle"] = ((roll_max.diff(15) < 0) & (roll_min.diff(15) > 0)).astype(int)
    out["pat_channel"] = ((roll_max.diff(15).abs() < c * 0.002) & (roll_min.diff(15).abs() < c * 0.002)).astype(int)
    out["pat_wedge"] = ((roll_max.diff(20) < 0) & (roll_min.diff(20) < 0)).astype(int)
    out["pat_cup"] = ((pos.shift(30) > 0.7) & (pos.shift(15) < 0.35) & (pos > 0.7)).astype(int)
    out["pat_pennant"] = out["pat_triangle"] & out["pat_flag"]
    return out
