"""Walk-forward style backtest with educational metrics. No execution."""
from __future__ import annotations

import numpy as np
import pandas as pd


def backtest_signals(close: pd.Series, side: pd.Series, cost_bps: float = 1.0) -> dict:
    ret = close.pct_change().fillna(0)
    pos = side.shift(1).fillna(0)
    strat = pos * ret - (pos.diff().abs().fillna(0) * cost_bps / 10000)
    equity = (1 + strat).cumprod()
    dd = equity / equity.cummax() - 1
    wins = strat[strat > 0]
    losses = strat[strat < 0]
    win_rate = float((strat > 0).mean())
    gp, gl = float(wins.sum()), float(-losses.sum()) or 1e-9
    profit_factor = gp / gl
    sharpe = float(np.sqrt(24 * 252) * strat.mean() / (strat.std() + 1e-12))
    expectancy = float(strat.mean())
    avg_trade = float(strat[pos != 0].mean()) if (pos != 0).any() else 0.0
    # Monte Carlo shuffle of returns
    rng = np.random.default_rng(7)
    samples = [float((1 + rng.permutation(strat.values)).prod()) for _ in range(200)]
    return {
        "win_rate": win_rate,
        "profit_factor": profit_factor,
        "sharpe": sharpe,
        "max_drawdown": float(dd.min()),
        "expectancy": expectancy,
        "average_trade": avg_trade,
        "equity_end": float(equity.iloc[-1]),
        "monte_carlo_p5": float(np.percentile(samples, 5)),
        "monte_carlo_p50": float(np.percentile(samples, 50)),
        "monte_carlo_p95": float(np.percentile(samples, 95)),
        "disclaimer": "This application provides market analysis only and is not financial advice.",
        "equity_curve": [float(x) for x in equity.iloc[:: max(len(equity) // 80, 1)]],
    }
