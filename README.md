# OmniStore Backend

REST API for an e-commerce store built with **Node.js**, **Express**, **TypeScript**, and **Prisma ORM** with a **PostgreSQL** database. Supports user authentication, product catalogs, categories, orders, and reviews.

## Features

- **Authentication** — JWT-based register / login / profile endpoints
- **Role-based access** — `CUSTOMER` and `ADMIN` roles with admin-only endpoints
- **Products & Categories** — full CRUD with soft delete
- **Orders** — create, update, and track order status
- **Reviews** — rate and review products (rating 1–5)
- **Soft delete** — all entities use an `isDeleted` flag instead of hard deletion
- **Serverless-ready** — deployable to Netlify Functions via `serverless-http`
- **Type-safe** — TypeScript + Prisma Client

## Tech Stack

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/) (v5)
- [Prisma ORM](https://www.prisma.io/) (v7)
- [PostgreSQL](https://www.postgresql.org/)
- [JSON Web Tokens](https://jwt.io/) (`jsonwebtoken`)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- [serverless-http](https://github.com/dougmoscrop/serverless-http) — Netlify Functions support

## Prerequisites

- Node.js >= 18
- npm
- A PostgreSQL database (local, hosted, or [Prisma Postgres](https://www.prisma.io/postgres))

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET="your_super_secret_key"
JWT_EXPIRES_IN="7d"
PORT=5000
```

| Variable          | Description                            | Default               |
| ----------------- | -------------------------------------- | --------------------- |
| `DATABASE_URL`    | PostgreSQL connection string           | *(required)*          |
| `JWT_SECRET`      | Secret used to sign JWT tokens         | `omnistore_dev_secret` |
| `JWT_EXPIRES_IN`  | JWT expiry (e.g. `7d`, `1h`)           | `7d`                  |
| `PORT`            | Port for the HTTP server               | `5000`                |

### 3. Set up the database

```bash
# Run migrations
npm run prisma:migrate

# Generate the Prisma Client
npm run prisma:generate
```

### 4. Run the server

```bash
npm run dev
```

The server starts on `http://localhost:5000`. The API root is available at `http://localhost:5000/api`, and the root health check returns a list of available endpoint groups.

## Scripts

| Script                    | Description                                   |
| ------------------------- | --------------------------------------------- |
| `npm run dev`             | Build with `tsc` and start the server         |
| `npm run dev:watch`       | Watch TypeScript files and recompile          |
| `npm run build`           | Compile TypeScript to `dist/`                 |
| `npm run start`           | Run the compiled server (`dist/server.js`)    |
| `npm run prisma:generate` | Generate the Prisma Client                    |
| `npm run prisma:migrate`  | Create and apply database migrations          |
| `npm run prisma:studio`   | Open Prisma Studio to browse the database     |

## Project Structure

```
src/
├── app.ts                 # Express app setup (middleware + routes)
├── server.ts              # Server bootstrap & graceful shutdown
├── lib/
│   ├── prisma.ts          # Prisma Client with pg adapter + connection pool
│   ├── jwt.ts             # JWT sign/verify helpers
│   └── response.ts        # Uniform success/fail response helpers
├── middleware/
│   └── auth.ts            # authenticate + requireAdmin middleware
├── routes/                # Express routers per resource
├── services/              # Business logic / database queries
└── types/
    └── express.d.ts       # Extended Request types (req.user)
prisma/
├── schema.prisma          # Database schema definition
└── migrations/            # SQL migration history
netlify/
└── functions/api.ts       # Serverless entry point for Netlify
```

## API Overview

All endpoints are prefixed with `/api`. Responses use a uniform shape:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": { ... }
}
```

| Resource    | Base path       | Auth required (protected)                    |
| ----------- | --------------- | -------------------------------------------- |
| Health      | `/api`          | No                                           |
| Auth        | `/api/auth`     | `/me` requires auth                          |
| Users       | `/api/users`    | Create/update/delete require auth (admin)    |
| Categories  | `/api/categories` | Create/update/delete require admin         |
| Products    | `/api/products` | Create/update/delete require admin           |
| Orders      | `/api/orders`   | Create/update/delete require auth            |
| Reviews     | `/api/reviews`  | Create/update/delete require auth            |

### Authentication

| Method | Endpoint         | Description                    |
| ------ | ---------------- | ------------------------------ |
| POST   | `/api/auth/register` | Register a new user           |
| POST   | `/api/auth/login`    | Login and receive a JWT      |
| GET    | `/api/auth/me`       | Get the authenticated user   |

### Users

| Method | Endpoint          | Description                          | Access   |
| ------ | ----------------- | ------------------------------------ | -------- |
| GET    | `/api/users`      | List all users                       | Public   |
| GET    | `/api/users/:id`  | Get a user by ID                     | Public   |
| POST   | `/api/users`      | Create a user                        | Admin    |
| PUT    | `/api/users/:id`  | Update a user                        | Auth     |
| DELETE | `/api/users/:id`  | Soft-delete a user                   | Admin    |

### Categories

| Method | Endpoint             | Description               | Access |
| ------ | -------------------- | ------------------------- | ------ |
| GET    | `/api/categories`    | List all categories       | Public |
| GET    | `/api/categories/:id`| Get a category by ID      | Public |
| POST   | `/api/categories`    | Create a category         | Admin  |
| PUT    | `/api/categories/:id`| Update a category         | Admin  |
| DELETE | `/api/categories/:id`| Soft-delete a category    | Admin  |

### Products

| Method | Endpoint            | Description              | Access |
| ------ | ------------------- | ------------------------ | ------ |
| GET    | `/api/products`     | List all products        | Public |
| GET    | `/api/products/:id` | Get a product by ID      | Public |
| POST   | `/api/products`     | Create a product         | Admin  |
| PUT    | `/api/products/:id` | Update a product         | Admin  |
| DELETE | `/api/products/:id` | Soft-delete a product    | Admin  |

### Orders

| Method | Endpoint          | Description             | Access        |
| ------ | ----------------- | ----------------------- | ------------- |
| GET    | `/api/orders`     | List all orders         | Public        |
| GET    | `/api/orders/:id` | Get an order by ID      | Public        |
| POST   | `/api/orders`     | Create an order         | Auth          |
| PUT    | `/api/orders/:id` | Update an order         | Auth          |
| DELETE | `/api/orders/:id` | Soft-delete an order    | Auth          |

> Note: updating an order `status` requires an `ADMIN` role.

### Reviews

| Method | Endpoint            | Description              | Access |
| ------ | ------------------- | ------------------------ | ------ |
| GET    | `/api/reviews`      | List reviews (filter with `?productId=`) | Public |
| GET    | `/api/reviews/:id`  | Get a review by ID       | Public |
| POST   | `/api/reviews`      | Create a review (rating 1–5) | Auth   |
| PUT    | `/api/reviews/:id`  | Update a review          | Auth   |
| DELETE | `/api/reviews/:id`  | Soft-delete a review     | Auth   |

Authenticated requests must include the JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

## Database Models

The schema lives in `prisma/schema.prisma`. Key models:

| Model      | Description                         | Notes                                  |
| ---------- | ----------------------------------- | -------------------------------------- |
| `User`     | Registered user                     | Roles: `CUSTOMER` / `ADMIN`            |
| `Category` | Product category                    | `name` is unique                       |
| `Product`  | Sellable item                       | Linked to a category, tracks `stock`   |
| `Order`    | Purchase order for a product        | Status: `PENDING` / `PROCESSING` / `SHIPPED` / `DELIVERED` / `CANCELLED` |
| `Review`   | Product rating / comment (1–5)      | One per user-product combination       |

## Deployment

This project is configured to deploy to [Netlify](https://www.netlify.com/) as serverless functions (see `netlify.toml`).

```bash
# Local preview
netlify dev

# Deploy
netlify deploy --prod
```

## 👨‍💻 Author
**Md Anawar Hossain**
- **GitHub:** [@anawarhossain](https://github.com/anawarhossain)
- **Facebook:** [Anawar Hossain](https://web.facebook.com/AnawarHossain55)
- **LinkeIn:** [Anawar Hossain](https://www.linkedin.com/in/anawarhossain/)
- **X(Twitter):** [Anawar Hossain](https://x.com/MDANAWAR22)
- **WhatsApp:** [Anawar Hossain](https://wa.me/+8801701020694)
- **Role:** Junior Developer


## Live Link

- [Live Link]()

## Project Screenshot

<p align="center">
  <img src="public/preview.png" alt="Project Preview" width=" ">
</p>