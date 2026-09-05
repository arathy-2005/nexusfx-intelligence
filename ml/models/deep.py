"""Compact PyTorch sequence models. Falls back if torch is unavailable."""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
REGISTRY = ROOT / "data" / "registry"
REGISTRY.mkdir(parents=True, exist_ok=True)


def _try_torch():
    try:
        import torch
        import torch.nn as nn
        from torch.utils.data import DataLoader, TensorDataset

        return torch, nn, DataLoader, TensorDataset
    except Exception:
        return None


class _SeqBase:
    def __init__(self, kind: str):
        self.kind = kind


def train_sequence_models(X: np.ndarray, y: np.ndarray, task: str, epochs: int = 4) -> dict:
    mods = _try_torch()
    if not mods:
        summary = {"task": task, "skipped": "torch_not_installed", "leaderboard": []}
        (REGISTRY / f"{task}_deep.json").write_text(json.dumps(summary, indent=2))
        return summary
    torch, nn, DataLoader, TensorDataset = mods

    class LSTMNet(nn.Module):
        def __init__(self, n_feat, n_cls=3):
            super().__init__()
            self.rnn = nn.LSTM(n_feat, 32, batch_first=True)
            self.fc = nn.Linear(32, n_cls)

        def forward(self, x):
            o, _ = self.rnn(x)
            return self.fc(o[:, -1])

    class GRUNet(nn.Module):
        def __init__(self, n_feat, n_cls=3):
            super().__init__()
            self.rnn = nn.GRU(n_feat, 32, batch_first=True)
            self.fc = nn.Linear(32, n_cls)

        def forward(self, x):
            o, _ = self.rnn(x)
            return self.fc(o[:, -1])

    class TinyTransformer(nn.Module):
        def __init__(self, n_feat, n_cls=3):
            super().__init__()
            self.proj = nn.Linear(n_feat, 32)
            layer = nn.TransformerEncoderLayer(d_model=32, nhead=4, dim_feedforward=64, batch_first=True)
            self.enc = nn.TransformerEncoder(layer, num_layers=2)
            self.fc = nn.Linear(32, n_cls)

        def forward(self, x):
            z = self.proj(x)
            z = self.enc(z)
            return self.fc(z.mean(1))

    class NBeatsBlock(nn.Module):
        def __init__(self, n_feat, n_cls=3):
            super().__init__()
            self.net = nn.Sequential(nn.Flatten(), nn.Linear(n_feat * 16, 64), nn.ReLU(), nn.Linear(64, n_cls))

        def forward(self, x):
            return self.net(x)

    class PatchTSTLite(nn.Module):
        def __init__(self, n_feat, n_cls=3):
            super().__init__()
            self.conv = nn.Conv1d(n_feat, 32, kernel_size=3, padding=1)
            self.fc = nn.Linear(32, n_cls)

        def forward(self, x):
            z = self.conv(x.transpose(1, 2))
            return self.fc(z.mean(-1))

    # window last 16 bars
    seq_len = 16
    xs, ys = [], []
    for i in range(seq_len, len(X)):
        xs.append(X[i - seq_len : i])
        ys.append(y[i])
    if len(xs) < 64:
        return {"task": task, "skipped": "not_enough_rows"}
    xt = torch.tensor(np.nan_to_num(np.stack(xs)), dtype=torch.float32)
    yt = torch.tensor(ys, dtype=torch.long)
    n_feat = xt.shape[-1]
    loader = DataLoader(TensorDataset(xt, yt), batch_size=64, shuffle=True)
    leaderboard = []
    best_name, best_acc, best_state = None, -1, None
    for name, ctor in [
        ("lstm", LSTMNet),
        ("gru", GRUNet),
        ("transformer", TinyTransformer),
        ("nbeats", NBeatsBlock),
        ("patchtst", PatchTSTLite),
    ]:
        net = ctor(n_feat)
        opt = torch.optim.Adam(net.parameters(), lr=1e-3)
        loss_fn = nn.CrossEntropyLoss()
        net.train()
        for _ in range(epochs):
            for xb, yb in loader:
                opt.zero_grad()
                pred = net(xb)
                loss = loss_fn(pred, yb)
                loss.backward()
                opt.step()
        net.eval()
        with torch.no_grad():
            logits = net(xt)
            acc = float((logits.argmax(1) == yt).float().mean())
        leaderboard.append({"name": name, "accuracy": acc})
        if acc > best_acc:
            best_acc, best_name, best_state = acc, name, net.state_dict()
    if best_state is not None:
        torch.save({"state": best_state, "kind": best_name, "n_feat": n_feat}, REGISTRY / f"{task}_deep.pt")
    summary = {"task": task, "champion": {"name": best_name, "accuracy": best_acc}, "leaderboard": leaderboard}
    (REGISTRY / f"{task}_deep.json").write_text(json.dumps(summary, indent=2))
    return summary
