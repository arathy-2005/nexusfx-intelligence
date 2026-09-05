"""Research-only bandit / tabular RL (PPO-style and DQN-style) — never executes trades."""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
REGISTRY = ROOT / "data" / "registry"
REGISTRY.mkdir(parents=True, exist_ok=True)


def train_research_rl(returns: np.ndarray) -> dict:
    """Tiny DQN-like Q table over discretized returns + PPO-like policy softmax."""
    actions = np.array([-1, 0, 1])  # sell / wait / buy ideas only
    q = np.zeros((5, 3))
    bins = np.linspace(-0.01, 0.01, 6)
    for r in returns[-2000:]:
        s = int(np.clip(np.digitize([r], bins)[0] - 1, 0, 4))
        a = int(np.argmax(q[s] + np.random.randn(3) * 0.05))
        reward = float(actions[a] * r * 100)  # research reward, not PnL advice
        q[s, a] = 0.9 * q[s, a] + 0.1 * reward
    policy = np.exp(q - q.max(axis=1, keepdims=True))
    policy = policy / policy.sum(axis=1, keepdims=True)
    summary = {
        "disclaimer": "This application provides market analysis only and is not financial advice.",
        "note": "RL is experimental research. It does not place orders.",
        "dqn_q": q.tolist(),
        "ppo_policy": policy.tolist(),
    }
    (REGISTRY / "rl_research.json").write_text(json.dumps(summary, indent=2))
    return summary
