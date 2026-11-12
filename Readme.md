# 🛒 FullStack Microservices — Clients, Products & Purchases

Full-stack CRUD application built with **Spring Boot**, **Spring Cloud OpenFeign**, **Angular 19**, and **MySQL 8**. The project manages clients, products, and purchases through two backend services and a web frontend.

## Contents

- [Architecture](#architecture)
- [Technology stack](#technology-stack)
- [Project structure](#project-structure)
- [Backend services](#backend-services)
- [Data model](#data-model)
- [API reference](#api-reference)
- [Getting started](#getting-started)
- [Configuration](#configuration)
- [Current implementation notes](#current-implementation-notes)

## Architecture

```text
Angular SPA (:4200)
        |
        | HTTP
        v
ms-openfeign-client (:8081)
        |
        | OpenFeign
        v
ms-products-api (:8080)
        |
        | Spring Data JPA / JDBC
        v
MySQL (:3306)
```

Request flow:

> **Angular → ms-openfeign-client → ms-products-api → MySQL**

- `frontend-angular` provides the user interface.
- `ms-openfeign-client` exposes the endpoints consumed by Angular and delegates requests through OpenFeign. It does not access the database.
- `ms-products-api` contains the business logic, JPA mappings, repositories, and database access.
- MySQL stores clients, products, purchases, and purchase-product associations.

## Technology stack

| Layer | Technology | Version |
|---|---|---|
| Provider backend | Spring Boot | 3.5.13 |
| Consumer backend | Spring Boot | 3.5.13 |
| Service communication | Spring Cloud OpenFeign | Spring Cloud 2025.0.0 |
| Backend language | Java | 21 |
| Persistence | Spring Data JPA / Hibernate | Managed by Spring Boot |
| Database | MySQL | 8.0 |
| Frontend | Angular | 19.2 |
| Frontend language | TypeScript | 5.7 |
| Containerization | Docker Compose | Compose specification |

## Project structure

```text
fullstack-microservicios/
├── ms-products-api/          # Provider service — port 8080
│   └── src/main/java/com/bd/
│       ├── config/           # Jackson configuration
│       ├── controller/       # Provider REST controllers
│       ├── dto/              # ClientDTO and PurchaseDTO
│       ├── exception/        # Global REST exception handler
│       ├── model/            # JPA entities
│       ├── repository/       # Spring Data JPA repositories
│       └── service/          # Business logic and DTO conversion
├── ms-openfeign-client/      # Consumer service — port 8081
│   └── src/main/java/com/java/
│       ├── client/feign/     # OpenFeign clients
│       ├── config/           # CORS configuration
│       ├── controller/       # Endpoints consumed by Angular
│       ├── model/            # Models matching provider responses
│       └── service/          # OpenFeign delegation layer
├── frontend-angular/         # Angular SPA — port 4200
│   └── src/app/
│       ├── core/             # HTTP interceptor
│       ├── features/         # Client, product, purchase, and home features
│       └── shared/           # Navbar and TypeScript interfaces
├── docker-compose.yml        # MySQL container definition
├── mysql_query.sql           # Database and table creation script
├── .env.example              # Docker environment template
└── Readme.md
```

## Backend services

### `ms-products-api`

Provider service available at `http://localhost:8080`.

Its main responsibilities are:

- Persisting clients, products, and purchases with Spring Data JPA.
- Returning `ClientDTO` and `PurchaseDTO` from the client and purchase APIs.
- Returning `Product` entities directly from the product API.
- Loading client and purchase associations with custom JPQL `JOIN FETCH` queries.
- Decreasing product stock when a purchase is created.
- Restoring previous stock before updating a purchase.
- Restoring stock when a purchase is deleted.
- Returning the ten products with the lowest stock.

The service uses `GlobalExceptionHandler` to map runtime exceptions to `404`, unprocessable-entity exceptions to `422`, and unexpected exceptions to `500`.

### `ms-openfeign-client`

Consumer service available at `http://localhost:8081`.

It exposes REST endpoints to Angular and delegates each operation to `ms-products-api` through these OpenFeign clients:

- `ClientFeignClient`
- `ProductFeignClient`
- `PurchaseFeignClient`

The provider URL is configured in `application.yml`:

```yaml
microservicio:
  url: http://localhost:8080
```

CORS accepts `GET`, `POST`, `PUT`, and `DELETE` requests from `http://localhost:4200`.

### `frontend-angular`

Angular SPA available at `http://localhost:4200`.

It contains:

- List and form pages for clients.
- List and form pages for products.
- List and form pages for purchases.
- Product selection through checkboxes in the purchase form.
- A shared navigation bar.
- A functional HTTP error interceptor.

The frontend currently uses hard-coded local API URLs such as:

```typescript
http://localhost:8081/client
http://localhost:8081/product
http://localhost:8081/purchase
```

## Data model

```text
Client (1) ─────────────── (N) Purchase
                                  |
                                  | @OneToMany + @JoinTable
                                  v
                              Product
```

- One client can have many purchases.
- Each purchase belongs to one client.
- `Purchase.products` is mapped as a unidirectional `@OneToMany` association through `purchase_products`.
- `@OrderColumn(name = "product_order")` preserves product order and allows the same product to be included more than once in a purchase.
- The service calculates `Purchase.quantity` from the number of selected products.

### Tables

| Table | Purpose |
|---|---|
| `clients` | Client name, email, and phone number |
| `products` | Product name, price, and stock |
| `purchases` | Client reference and purchase quantity |
| `purchase_products` | Products and their position within each purchase |

Database column names are in Spanish and are mapped to English Java fields with JPA annotations:

| Database column | Java field |
|---|---|
| `nombre` | `name` |
| `telefono` | `phoneNumber` |
| `precio` | `price` |
| `cantidad` | `quantity` |

## API reference

### Provider: `ms-products-api`

Base URL: `http://localhost:8080`

#### Clients

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/clientes` | List all clients |
| `GET` | `/api/clientes/{id}` | Get a client by ID |
| `POST` | `/api/clientes` | Create a client |
| `PUT` | `/api/clientes/{id}` | Update a client |
| `DELETE` | `/api/clientes/{id}` | Delete a client |

#### Products

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/productos` | List all products |
| `GET` | `/api/productos/{id}` | Get a product by ID |
| `POST` | `/api/productos` | Create a product |
| `PUT` | `/api/productos/{id}` | Update a product |
| `DELETE` | `/api/productos/{id}` | Delete a product |
| `GET` | `/api/productos/minusStock` | Get up to ten products ordered by stock ascending |

#### Purchases

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/compras` | List all purchases |
| `GET` | `/api/compras/{id}` | Get a purchase by ID |
| `POST` | `/api/compras` | Create a purchase and decrease stock |
| `PUT` | `/api/compras/{id}` | Update a purchase and recalculate stock |
| `DELETE` | `/api/compras/{id}` | Delete a purchase and restore stock |

### Consumer: `ms-openfeign-client`

Base URL: `http://localhost:8081`

#### Clients

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/client/allClients` | List all clients |
| `GET` | `/client/{id}` | Get a client by ID |
| `POST` | `/client/create` | Create a client |
| `PUT` | `/client/update/{id}` | Update a client |
| `DELETE` | `/client/delete/{id}` | Delete a client |

#### Products

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/product/allProducts` | List all products |
| `GET` | `/product/{id}` | Get a product by ID |
| `POST` | `/product/create` | Create a product |
| `PUT` | `/product/update/{id}` | Update a product |
| `DELETE` | `/product/delete/{id}` | Delete a product |
| `GET` | `/product/minusStock` | Get products with the lowest stock |

#### Purchases

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/purchase/allPurchases` | List all purchases |
| `GET` | `/purchase/{id}` | Get a purchase by ID |
| `POST` | `/purchase/create` | Create a purchase |
| `PUT` | `/purchase/update/{id}` | Update a purchase |
| `DELETE` | `/purchase/delete/{id}` | Delete a purchase |

## Getting started

### Prerequisites

- Java 21
- Maven 3.8 or newer
- A Node.js version compatible with Angular 19
- npm
- Docker and Docker Compose

### 1. Configure MySQL

Copy the environment template:

```bash
cp .env.example .env
```

Set a secure root password in `.env`, then start MySQL:

```bash
docker compose up -d
```

The Compose file creates the database configured by `MYSQL_DATABASE`, but it does **not** automatically execute `mysql_query.sql`. Initialize the tables with:

```bash
docker compose exec -T mysql sh -c 'mysql --force -uroot -p"$MYSQL_ROOT_PASSWORD"' < mysql_query.sql
```

The `--force` option lets the script continue if `client_product` was already created by the container.

### 2. Start the provider service

The `.env` file is read by Docker Compose, but it is not automatically loaded into a separately started Spring Boot process. Export the same password before starting the provider:

```bash
export MYSQL_ROOT_PASSWORD='your_password_here'
cd ms-products-api
mvn spring-boot:run
```

The provider will be available at `http://localhost:8080`.

Optional datasource variables:

```bash
export DB_URL='jdbc:mysql://localhost:3306/client_product'
export DB_USER='root'
```

### 3. Start the consumer service

From another terminal:

```bash
cd ms-openfeign-client
mvn spring-boot:run
```

The consumer will be available at `http://localhost:8081`.

### 4. Start the frontend

From another terminal:

```bash
cd frontend-angular
npm install
npm start
```

Open `http://localhost:4200`.

## Configuration

### Docker environment variables

| Variable | Description | Example |
|---|---|---|
| `MYSQL_ROOT_PASSWORD` | MySQL root password | `change_me` |
| `MYSQL_DATABASE` | Database created by the MySQL container | `client_product` |
| `CONTAINER_NAME` | MySQL container name | `bd-openfeign` |

### Provider environment variables

| Variable | Description | Default in the current code |
|---|---|---|
| `DB_URL` | JDBC connection URL | `jdbc:mysql://localhost:3306/client_product` |
| `DB_USER` | Database username | `root` |
| `MYSQL_ROOT_PASSWORD` | Database password | Value currently defined in `application.yml` |

For a public or production repository, remove the password default from `application.yml` and require `MYSQL_ROOT_PASSWORD` to be supplied externally.

## Current implementation notes

- `frontend-angular/src/app/features/product/services/product.service.ts` currently sends product deletion to `/product/{id}`, while `ms-openfeign-client` exposes `DELETE /product/delete/{id}`. These paths must be aligned for deletion from the frontend to work.
- `frontend-angular/package.json` declares Angular packages at `19.2.x` but `@angular/cli` at `21.2.10`. Keep the CLI major version aligned with Angular 19 to avoid tooling incompatibilities.
- The repository contains Maven wrapper configuration files under `.mvn`, but the provided tree does not include `mvnw` or `mvnw.cmd`; the startup instructions therefore use the installed `mvn` command.
- The current backend test suites only contain context-loading tests.
- `application-local.yml` and the default value in `application.yml` contain a database password. Replace committed credentials with environment variables before publishing or deploying the project.

## Author

**maubmz** — [GitHub](https://github.com/maubmz)
