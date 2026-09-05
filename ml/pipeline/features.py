"""150+ technical, structural, and macro-proxy features."""
from __future__ import annotations

import numpy as np
import pandas as pd


def _ema(s: pd.Series, n: int) -> pd.Series:
    return s.ewm(span=n, adjust=False).mean()


def _sma(s: pd.Series, n: int) -> pd.Series:
    return s.rolling(n, min_periods=1).mean()


def _rsi(close: pd.Series, n: int = 14) -> pd.Series:
    d = close.diff()
    up = d.clip(lower=0).rolling(n).mean()
    down = (-d.clip(upper=0)).rolling(n).mean()
    rs = up / down.replace(0, np.nan)
    return 100 - (100 / (1 + rs))


def _atr(df: pd.DataFrame, n: int = 14) -> pd.Series:
    prev = df["close"].shift(1)
    tr = pd.concat(
        [(df["high"] - df["low"]), (df["high"] - prev).abs(), (df["low"] - prev).abs()],
        axis=1,
    ).max(axis=1)
    return tr.rolling(n).mean()


def build_features(df: pd.DataFrame) -> pd.DataFrame:
    out = df.copy()
    c, h, l, o, v = out["close"], out["high"], out["low"], out["open"], out["volume"]
    typical = (h + l + c) / 3

    for n in (5, 8, 10, 13, 20, 21, 34, 50, 55, 89, 100, 144, 200):
        out[f"sma_{n}"] = _sma(c, n)
        out[f"ema_{n}"] = _ema(c, n)
        out[f"sma_dist_{n}"] = c / out[f"sma_{n}"] - 1
        out[f"ema_dist_{n}"] = c / out[f"ema_{n}"] - 1

    for n in (7, 9, 14, 21, 28):
        out[f"rsi_{n}"] = _rsi(c, n)
        out[f"atr_{n}"] = _atr(out, n)
        out[f"roc_{n}"] = c.pct_change(n)
        out[f"mom_{n}"] = c.diff(n)
        out[f"stoch_{n}"] = 100 * (c - l.rolling(n).min()) / (h.rolling(n).max() - l.rolling(n).min()).replace(0, np.nan)
        out[f"cci_{n}"] = (typical - typical.rolling(n).mean()) / (0.015 * typical.rolling(n).std())
        out[f"willr_{n}"] = -100 * (h.rolling(n).max() - c) / (h.rolling(n).max() - l.rolling(n).min()).replace(0, np.nan)

    ema12, ema26 = _ema(c, 12), _ema(c, 26)
    out["macd"] = ema12 - ema26
    out["macd_signal"] = _ema(out["macd"], 9)
    out["macd_hist"] = out["macd"] - out["macd_signal"]

    bb_mid = _sma(c, 20)
    bb_std = c.rolling(20).std()
    out["bb_mid"] = bb_mid
    out["bb_upper"] = bb_mid + 2 * bb_std
    out["bb_lower"] = bb_mid - 2 * bb_std
    out["bb_pct"] = (c - out["bb_lower"]) / (out["bb_upper"] - out["bb_lower"]).replace(0, np.nan)
    out["bb_width"] = (out["bb_upper"] - out["bb_lower"]) / bb_mid

    plus_dm = h.diff().clip(lower=0)
    minus_dm = (-l.diff()).clip(lower=0)
    atr14 = out["atr_14"]
    out["adx_plus"] = 100 * (plus_dm.rolling(14).mean() / atr14)
    out["adx_minus"] = 100 * (minus_dm.rolling(14).mean() / atr14)
    dx = (out["adx_plus"] - out["adx_minus"]).abs() / (out["adx_plus"] + out["adx_minus"]).replace(0, np.nan)
    out["adx"] = 100 * dx.rolling(14).mean()

    out["vwap"] = (typical * v).cumsum() / v.cumsum()
    out["vwap_dist"] = c / out["vwap"] - 1
    out["obv"] = np.sign(c.diff().fillna(0)) * v
    out["obv"] = out["obv"].cumsum()
    out["obv_slope"] = out["obv"].diff(10)

    tenkan = (h.rolling(9).max() + l.rolling(9).min()) / 2
    kijun = (h.rolling(26).max() + l.rolling(26).min()) / 2
    out["ichimoku_tenkan"] = tenkan
    out["ichimoku_kijun"] = kijun
    out["ichimoku_span_a"] = (tenkan + kijun) / 2
    out["ichimoku_span_b"] = (h.rolling(52).max() + l.rolling(52).min()) / 2
    out["ichimoku_cloud"] = out["ichimoku_span_a"] - out["ichimoku_span_b"]

    hl2 = (h + l) / 2
    atr = out["atr_14"]
    out["supertrend_up"] = hl2 - 3 * atr
    out["supertrend_dn"] = hl2 + 3 * atr
    out["supertrend_dir"] = np.where(c > out["supertrend_dn"].shift(1), 1, np.where(c < out["supertrend_up"].shift(1), -1, 0))

    out["kc_mid"] = _ema(c, 20)
    out["kc_upper"] = out["kc_mid"] + 1.5 * atr
    out["kc_lower"] = out["kc_mid"] - 1.5 * atr
    out["donchian_high"] = h.rolling(20).max()
    out["donchian_low"] = l.rolling(20).min()
    out["donchian_mid"] = (out["donchian_high"] + out["donchian_low"]) / 2

    out["hma_approx"] = _wma_safe(c, 16)
    out["dema_20"] = 2 * _ema(c, 20) - _ema(_ema(c, 20), 20)
    out["tema_20"] = 3 * _ema(c, 20) - 3 * _ema(_ema(c, 20), 20) + _ema(_ema(_ema(c, 20), 20), 20)

    out["ret_1"] = c.pct_change(1)
    out["ret_4"] = c.pct_change(4)
    out["ret_24"] = c.pct_change(24)
    out["vol_24"] = out["ret_1"].rolling(24).std()
    out["vol_72"] = out["ret_1"].rolling(72).std()
    out["vol_ratio"] = out["vol_24"] / out["vol_72"].replace(0, np.nan)
    out["zscore_20"] = (c - _sma(c, 20)) / c.rolling(20).std()
    out["range_pct"] = (h - l) / c
    out["body_pct"] = (c - o) / c
    out["upper_wick"] = (h - np.maximum(c, o)) / c
    out["lower_wick"] = (np.minimum(c, o) - l) / c
    out["gap"] = o / c.shift(1) - 1

    swing_high = h.rolling(50).max()
    swing_low = l.rolling(50).min()
    rng = (swing_high - swing_low).replace(0, np.nan)
    out["fib_382"] = swing_high - rng * 0.382
    out["fib_500"] = swing_high - rng * 0.5
    out["fib_618"] = swing_high - rng * 0.618
    out["dist_fib_618"] = c / out["fib_618"] - 1
    out["support"] = swing_low
    out["resistance"] = swing_high
    out["dist_support"] = c / swing_low - 1
    out["dist_resist"] = c / swing_high - 1

    # Liquidity / structure proxies
    out["fvg_up"] = np.where(l > h.shift(2), l - h.shift(2), 0)
    out["fvg_dn"] = np.where(h < l.shift(2), l.shift(2) - h, 0)
    out["order_block"] = np.where((out["body_pct"].abs() > out["body_pct"].rolling(20).mean()) & (out["ret_1"] < 0), 1, 0)
    out["eq_high"] = (h.rolling(3).max() - h.rolling(20).max()).abs() / c
    out["eq_low"] = (l.rolling(3).min() - l.rolling(20).min()).abs() / c
    out["volume_z"] = (v - v.rolling(20).mean()) / v.rolling(20).std()
    out["dollar_vol"] = v * c
    out["mfi_14"] = _mfi(h, l, c, v, 14)
    out["trix_15"] = _ema(_ema(_ema(c, 15), 15), 15).pct_change() * 100
    out["ultosc"] = _ultosc(h, l, c)
    out["dxy_proxy"] = out["ret_1"].rolling(24).mean()  # placeholder if DXY not joined
    out["vix_proxy"] = out["vol_24"]
    if "time" in out.columns:
        hours = pd.to_datetime(out["time"], utc=True).dt.hour
        out["hour_sin"] = np.sin(2 * np.pi * hours / 24)
        out["hour_cos"] = np.cos(2 * np.pi * hours / 24)
    else:
        out["hour_sin"] = 0
        out["hour_cos"] = 0

    return out.copy()


def _wma_safe(s: pd.Series, n: int) -> pd.Series:
    weights = np.arange(1, n + 1)
    return s.rolling(n).apply(lambda x: np.dot(x, weights) / weights.sum(), raw=True)


def _mfi(h, l, c, v, n):
    tp = (h + l + c) / 3
    mf = tp * v
    pos = mf.where(tp >= tp.shift(1), 0).rolling(n).sum()
    neg = mf.where(tp < tp.shift(1), 0).rolling(n).sum()
    return 100 - (100 / (1 + pos / neg.replace(0, np.nan)))


def _ultosc(h, l, c):
    bp = c - np.minimum(l, c.shift(1))
    tr = np.maximum(h, c.shift(1)) - np.minimum(l, c.shift(1))
    avg7 = bp.rolling(7).sum() / tr.rolling(7).sum()
    avg14 = bp.rolling(14).sum() / tr.rolling(14).sum()
    avg28 = bp.rolling(28).sum() / tr.rolling(28).sum()
    return 100 * (4 * avg7 + 2 * avg14 + avg28) / 7


def feature_columns(df: pd.DataFrame) -> list[str]:
    skip = {"time", "open", "high", "low", "close", "volume", "symbol"}
    cols = [c for c in df.columns if c not in skip and df[c].dtype != object]
    return cols
