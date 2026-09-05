# ML & data plane

NexusFX intelligence is **analysis only**. It never routes orders.

## Layout

```
ml/
  pipeline/ingest.py      # parquet OHLCV (+ DXY/VIX proxies)
  pipeline/features.py    # 150+ indicators / structure / macro proxies
  pipeline/patterns.py    # HS, doubles, triangles, candles, …
  models/classical.py     # LR, RF, GBM, XGB/LGBM/CatBoost if installed
  models/deep.py          # LSTM, GRU, Transformer, N-BEATS, PatchTST (PyTorch optional)
  models/rl.py            # PPO/DQN-style research tables — no execution
  backtest/engine.py      # win rate, PF, Sharpe, DD, MC, equity
  train.py                # compare → champion → registry
  nightly.py              # ingest, retrain, gate, history/rollback
  app/main.py             # FastAPI
```

## Train

```bash
py -3 -m pip install -r ml/requirements.txt
set PYTHONPATH=.
py -3 -m ml.train
py -3 -m uvicorn ml.app.main:app --port 8000
```

Optional extras: `torch`, `xgboost`, `lightgbm`, `catboost`, `shap`, `mlflow`, `optuna`.

## Docker

`docker compose up --build`

Frontend uses `ML_API_URL`. If unset, Next.js uses the in-app ensemble (`src/lib/intelligence.ts`) so Vercel still deploys.

## Nightly

`python -m ml.nightly` or the `nightly` GitHub Actions job (02:20 UTC). Champions are copied under `data/registry/history/<stamp>/`. Restore by copying `latest.json` back.

## Storage map

| Concern | Default |
| --- | --- |
| Metadata | PostgreSQL / Prisma (`ModelVersion`, `Experiment`, `PredictionLog`) |
| History | Parquet under `data/parquet` (S3-compatible in production) |
| Cache / jobs | Redis / Upstash (compose includes Redis) |
| Serving | FastAPI container (Railway/Render) |
| Web | Next.js on Vercel |
