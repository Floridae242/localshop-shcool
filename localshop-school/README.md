# LocalShop School Model

This project implements the Website + Backend + Database + UX deliverables specified by the 960141 Term Project, using CH6–CH9 (JS/Node/MySQL/CRUD) and CH11 (Bootstrap).

## Quick Start
1) Install dependencies
```
npm install
```
2) Create `.env` from `.env.sample`
3) Create DB and import schema/seed:
```
mysql -u root -p < sql/schema.sql
mysql -u root -p localshop_school < sql/seed.sql
```
4) Run
```
npm start
```
Open http://localhost:3000

## Pages
- Home (`/`) – Album
- Products (`/products.html`) – Stock table
- Order (`/order.html`) – Place order
- About (`/about.html`) – Project info
- Dashboard (`/dashboard.html`) – Admin CRUD + Download CSV

## API
- `GET /api/products`, `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`
- `POST /api/orders`, `GET /api/orders` (admin)
- `GET /api/media`
- `GET /api/export/products.csv`, `GET /api/export/orders.csv` (admin)
