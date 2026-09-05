"""Optional Celery worker stub — run jobs via nightly.py if Redis is absent."""
from __future__ import annotations

def ingest_task():
    from ml.pipeline.ingest import ingest_all

    return [str(p) for p in ingest_all(rows=2000)]


def retrain_task():
    from ml.nightly import nightly

    nightly()
