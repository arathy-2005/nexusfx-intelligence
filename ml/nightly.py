"""Nightly: ingest -> retrain -> validate -> write champion (rollback via registry history)."""
from __future__ import annotations

import json
import shutil
from datetime import datetime, timezone
from pathlib import Path

from ml.train import REGISTRY, run

HISTORY = REGISTRY / "history"
HISTORY.mkdir(parents=True, exist_ok=True)


def nightly():
    report = run()
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    dest = HISTORY / stamp
    dest.mkdir(parents=True, exist_ok=True)
    latest = REGISTRY / "latest.json"
    if latest.exists():
        shutil.copy(latest, dest / "latest.json")
    acc = report.get("trend", {}).get("champion", {}).get("accuracy", 0)
    gate = {"accepted": acc >= 0.34, "accuracy": acc, "stamp": stamp}
    (dest / "gate.json").write_text(json.dumps(gate, indent=2))
    print(gate)


if __name__ == "__main__":
    nightly()
