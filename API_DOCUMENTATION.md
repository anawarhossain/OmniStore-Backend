# OmniStore Backend API Documentation

Base URL: `http://localhost:5000/api`

All responses follow a consistent envelope:

```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {}
}
```

On error:

```json
{
  "success": false,
  "message": "Product not found",
  "data": null
}
```

## Authentication

Protected endpoints require a JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

Obtain a token via `POST /api/auth/login` or `POST /api/auth/register`.

---

## Auth

### POST /api/auth/register
- **Description:** Register a new user account.
- **Auth:** None
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secret123",
    "age": 25
  }
  ```
- **Response (201):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": { "id": "uuid", "name": "John Doe", "email": "john@example.com", "role": "CUSTOMER", "age": 25, "createdAt": "...", "updatedAt": "..." },
      "token": "eyJhbGciOi..."
    }
  }
  ```
- **Status Codes:** `201` created · `400` missing fields · `409` email already exists · `500` server error

### POST /api/auth/login
- **Description:** Log in and receive a JWT.
- **Auth:** None
- **Request Body:**
  ```json
  { "email": "john@example.com", "password": "secret123" }
  ```
- **Response (200):** `{ "success": true, "message": "Login successful", "data": { "user": {...}, "token": "..." } }`
- **Status Codes:** `200` ok · `400` missing fields · `401` invalid credentials · `500` server error

### GET /api/auth/me
- **Description:** Get the authenticated user's profile.
- **Auth:** Bearer token
- **Response (200):** `{ "success": true, "message": "User retrieved successfully", "data": { "id": "...", "name": "...", "email": "...", "role": "...", "age": 25, "createdAt": "...", "updatedAt": "..." } }`
- **Status Codes:** `200` ok · `401` not authenticated · `404` user not found · `500` server error

---

## Users

### GET /api/users
- **Description:** Get all users (non-deleted).
- **Auth:** None
- **Response (200):** `{ "success": true, "message": "Users retrieved successfully", "data": [ {user}, ... ] }`

### GET /api/users/:id
- **Description:** Get a single user by ID.
- **Auth:** None
- **Response (200):** `{ "success": true, "message": "User retrieved successfully", "data": {user} }`
- **Status Codes:** `200` ok · `404` not found

### POST /api/users
- **Description:** Create a new user (admin only).
- **Auth:** Bearer token (admin)
- **Request Body:** `{ "name": "...", "email": "...", "password": "...", "age": 25, "role": "CUSTOMER" }`
- **Status Codes:** `201` created · `400` missing fields · `401` not authenticated · `403` not admin · `409` email exists

### PUT /api/users/:id
- **Description:** Update a user. Fields are optional.
- **Auth:** Bearer token
- **Request Body:** `{ "name": "...", "email": "...", "age": 25, "password": "...", "role": "CUSTOMER" }`
- **Status Codes:** `200` ok · `401` not authenticated · `404` not found · `409` email exists

### DELETE /api/users/:id
- **Description:** Soft-delete a user (sets `isDeleted = true`).
- **Auth:** Bearer token (admin)
- **Status Codes:** `200` ok · `401` not authenticated · `403` not admin · `404` not found

---

## Categories

### GET /api/categories
- **Description:** Get all categories.
- **Auth:** None
- **Response (200):** `{ "success": true, "message": "Categories retrieved successfully", "data": [ {category}, ... ] }`

### GET /api/categories/:id
- **Description:** Get a single category by ID.
- **Auth:** None
- **Status Codes:** `200` ok · `404` not found

### POST /api/categories
- **Description:** Create a category (admin only).
- **Auth:** Bearer token (admin)
- **Request Body:** `{ "name": "Electronics" }`
- **Status Codes:** `201` created · `400` missing name · `401/403` unauthorized · `409` name exists

### PUT /api/categories/:id
- **Description:** Update a category name (admin only).
- **Auth:** Bearer token (admin)
- **Request Body:** `{ "name": "New Name" }`
- **Status Codes:** `200` ok · `401/403` unauthorized · `404` not found · `409` name exists

### DELETE /api/categories/:id
- **Description:** Soft-delete a category (admin only).
- **Auth:** Bearer token (admin)
- **Status Codes:** `200` ok · `401/403` unauthorized · `404` not found

---

## Products

### GET /api/products
- **Description:** Get all products (non-deleted) with their category.
- **Auth:** None
- **Response (200):** `{ "success": true, "message": "Products retrieved successfully", "data": [ {product, category: {id, name}}, ... ] }`

### GET /api/products/:id
- **Description:** Get a single product by ID.
- **Auth:** None
- **Status Codes:** `200` ok · `404` not found

### POST /api/products
- **Description:** Create a product (admin only).
- **Auth:** Bearer token (admin)
- **Request Body:**
  ```json
  {
    "title": "Smartphone",
    "description": "Latest model",
    "price": 499.99,
    "stock": 100,
    "categoryId": "<category-uuid>",
    "status": "ACTIVE"
  }
  ```
  `status` enum: `ACTIVE | INACTIVE | OUT_OF_STOCK`
- **Status Codes:** `201` created · `400` missing title/price/categoryId or category doesn't exist · `401/403` unauthorized

### PUT /api/products/:id
- **Description:** Update a product (admin only). Fields are optional.
- **Auth:** Bearer token (admin)
- **Request Body:** same shape as POST
- **Status Codes:** `200` ok · `400` category doesn't exist · `401/403` unauthorized · `404` not found

### DELETE /api/products/:id
- **Description:** Soft-delete a product (admin only).
- **Auth:** Bearer token (admin)
- **Status Codes:** `200` ok · `401/403` unauthorized · `404` not found

---

## Orders

### GET /api/orders
- **Description:** Get all orders (non-deleted) with user and product.
- **Auth:** None
- **Response (200):** `{ "success": true, "message": "Orders retrieved successfully", "data": [ {order, user: {...}, product: {...}}, ... ] }`

### GET /api/orders/:id
- **Description:** Get a single order by ID.
- **Auth:** None
- **Status Codes:** `200` ok · `404` not found

### POST /api/orders
- **Description:** Create an order.
- **Auth:** Bearer token
- **Request Body:**
  ```json
  { "userId": "<user-uuid>", "productId": "<product-uuid>", "quantity": 2, "status": "PENDING" }
  ```
  `status` enum: `PENDING | PROCESSING | SHIPPED | DELIVERED | CANCELLED`
- **Status Codes:** `201` created · `400` missing fields or user/product doesn't exist · `401` not authenticated

### PUT /api/orders/:id
- **Description:** Update an order. Fields are optional.
- **Auth:** Bearer token
- **Request Body:** same shape as POST
- **Status Codes:** `200` ok · `400` user/product doesn't exist · `401` not authenticated · `404` not found

### DELETE /api/orders/:id
- **Description:** Soft-delete an order.
- **Auth:** Bearer token
- **Status Codes:** `200` ok · `401` not authenticated · `404` not found

---

## Reviews

### GET /api/reviews
- **Description:** Get all reviews, or filter by product via `?productId=<uuid>`.
- **Auth:** None
- **Response (200):** `{ "success": true, "message": "Reviews retrieved successfully", "data": [ {review, user: {...}, product: {...}}, ... ] }`

### GET /api/reviews/:id
- **Description:** Get a single review by ID.
- **Auth:** None
- **Status Codes:** `200` ok · `404` not found

### POST /api/reviews
- **Description:** Add a review to a product.
- **Auth:** Bearer token
- **Request Body:**
  ```json
  { "rating": 5, "comment": "Great product!", "productId": "<product-uuid>" }
  ```
  `rating` must be 1–5. The authenticated user is used as the review author.
- **Status Codes:** `201` created · `400` invalid rating/missing fields/product doesn't exist · `401` not authenticated

### PUT /api/reviews/:id
- **Description:** Update a review's rating/comment.
- **Auth:** Bearer token
- **Request Body:** `{ "rating": 4, "comment": "Updated" }`
- **Status Codes:** `200` ok · `400` invalid rating · `401` not authenticated · `404` not found

### DELETE /api/reviews/:id
- **Description:** Soft-delete a review.
- **Auth:** Bearer token
- **Status Codes:** `200` ok · `401` not authenticated · `404` not found

---

## Enum Values

| Enum | Values |
|------|--------|
| `UserRole` | `CUSTOMER`, `ADMIN` |
| `OrderStatus` | `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED` |
| `ProductStatus` | `ACTIVE`, `INACTIVE`, `OUT_OF_STOCK` |

## Notes
- Delete operations are **soft deletes** (`isDeleted = true`); records remain in the database but are excluded from queries.
- All tables include `createdAt` and `updatedAt` timestamps managed automatically by Prisma.
