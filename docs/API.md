# NexusFX API

All JSON responses that return market content include:

```json
{ "disclaimer": "This application provides market analysis only and is not financial advice." }
```

Base URL: `/api`

## Market

`GET /api/market`

Returns `quotes[]` with `symbol`, `name`, `price`, `bid`, `ask`, `spread`, `high24h`, `low24h`, `volume`, `change24h`, `updatedAt`.

Rate limit: 90 / minute / IP.

## Analysis

`POST /api/analysis`

Body: `{ "pair": "EURUSD", "timeframe": "1H" }`

Returns a BUY / SELL / WAIT idea with confidence, entry, stop, target, indicators, and reasons.

Rate limit: 30 / minute / IP.

## Signals

`GET /api/signals`

Educational signal table payload.

## News

`GET /api/news?q=&category=FOREX`

## Calendar

`GET /api/calendar?impact=HIGH`

## Calculators

`POST /api/calculators/lot-size`

```json
{ "balance": 10000, "riskPercent": 1, "stopLossPips": 20, "pair": "EURUSD", "leverage": 30, "price": 1.08 }
```

`POST /api/calculators/pip`

```json
{ "lots": 0.1, "pips": 25, "pair": "EURUSD", "direction": "profit" }
```

## Auth

- `POST /api/auth/register` `{ name, email, password }`
- `POST /api/auth/login` `{ email, password }`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## User data

- `GET|POST /api/watchlist`
- `GET|POST /api/journal`
- `GET /api/notifications`

## Admin

`GET /api/admin/stats` — requires `ADMIN` session.
