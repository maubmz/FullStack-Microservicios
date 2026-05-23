# 🛒 FullStack Microservicios — Clients, Products & Purchases

A full-stack application built with a **microservices architecture** using **Spring Boot**, **Spring Cloud OpenFeign**, and **Angular 19**. It manages three core entities: **Clients**, **Products**, and **Purchases**, exposing a clean REST API and a reactive SPA frontend.

---

## 📋 Table of Contents

- Architecture Overview
- Tech Stack
- Project Structure
- Microservice 1 — ms-products-api
- Microservice 2 — ms-openfeign-client
- Frontend — frontend-angular
- Database Schema
- API Reference
- Getting Started
- Environment Variables

---

## 🏛️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Angular 19 SPA                          │
│              http://localhost:4200                           │
│   (Client / Product / Purchase CRUD + Home dashboard)       │
└───────────────────────┬─────────────────────────────────────┘
                        │  HTTP (Angular HttpClient)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              ms-openfeign-client  :8081                      │
│   Spring Boot · Spring Cloud OpenFeign · CORS enabled       │
│                                                              │
│  /client/**   /product/**   /purchase/**                    │
│  Service → FeignClient → delegates to ms-products-api       │
└───────────────────────┬─────────────────────────────────────┘
                        │  HTTP via OpenFeign (REST delegation)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              ms-products-api  :8080                          │
│   Spring Boot · Spring Data JPA · DTOs · MySQL Driver       │
│                                                              │
│  /api/clientes   /api/productos   /api/compras              │
│  Controllers → Services (DTOs) → Repositories → MySQL       │
└───────────────────────┬─────────────────────────────────────┘
                        │  JDBC (MySQL Connector/J)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              MySQL 8.0  :3306                                │
│              Database: client_product                        │
│   Tables: clients · products · purchases · purchase_products│
└─────────────────────────────────────────────────────────────┘
```

The communication flow is:

> **Angular** → **ms-openfeign-client** → **ms-products-api** → **MySQL**

`ms-openfeign-client` acts as a **gateway/consumer**: it receives requests from the frontend, and transparently delegates them to `ms-products-api` using typed OpenFeign interfaces, avoiding any direct database access in this layer.

---

## 🧰 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Backend Provider** | Spring Boot | 3.5.13 |
| **Backend Consumer** | Spring Boot + Spring Cloud OpenFeign | 3.5.13 / 2025.0.0 |
| **Frontend** | Angular | 19.2 |
| **Database** | MySQL | 8.0 |
| **ORM** | Spring Data JPA (Hibernate) | via Spring Boot |
| **Language (backend)** | Java | 21 |
| **Language (frontend)** | TypeScript | ~5.7 |
| **Boilerplate reduction** | Lombok | latest |
| **Containerization** | Docker / Docker Compose | - |

---

## 📁 Project Structure

```
FullStack-Microservicios/
├── ms-products-api/            # Microservice 1 — Provider (port 8080)
│   └── src/main/java/com/bd/
│       ├── config/             # JacksonConfig (Hibernate lazy-loading serialization)
│       ├── controller/         # REST endpoints for clients, products, purchases
│       ├── dto/                # ClientDTO, PurchaseDTO (data abstraction layer)
│       ├── exception/          # GlobalExceptionHandler (@RestControllerAdvice)
│       ├── model/              # JPA Entities: Client, Product, Purchase
│       ├── repository/         # Spring Data JPA repositories with custom @Query
│       └── service/            # Business logic + DTO conversion
│
├── ms-openfeign-client/        # Microservice 2 — Consumer / Gateway (port 8081)
│   └── src/main/java/com/java/
│       ├── client/feign/       # OpenFeign interfaces (ClientFeignClient, etc.)
│       ├── config/             # CorsConfig (allows http://localhost:4200)
│       ├── controller/         # REST endpoints exposed to the frontend
│       ├── model/              # Plain Java models (mirrors provider DTOs)
│       └── service/            # Thin services that delegate to FeignClients
│
├── frontend-angular/           # Angular 19 SPA (port 4200)
│   └── src/app/
│       ├── core/interceptors/  # httpErrorInterceptor (HTTP error handling)
│       ├── features/
│       │   ├── client/         # Client list + form pages, ClientService
│       │   ├── product/        # Product list + form pages, ProductService
│       │   ├── purchase/       # Purchase list + form pages, PurchaseService
│       │   └── home/           # Home/dashboard page
│       └── shared/
│           ├── components/     # Navbar component
│           └── interfaces/     # TypeScript models: Client, Product, Purchase
│
├── docker-compose.yml          # MySQL 8.0 container
├── mysql_query.sql             # Database DDL (CREATE TABLE statements)
├── .env.example                # Environment variable template
└── Readme.md
```

---

## 🟢 Microservice 1 — `ms-products-api`

**Role:** Provider. The only service with direct access to MySQL.

**Port:** `8080`

### Package Structure

| Package | Responsibility |
|---|---|
| `model` | JPA entities mapped to MySQL tables (`Client`, `Product`, `Purchase`) |
| `dto` | `ClientDTO` and `PurchaseDTO` — public API contracts, decouple internal entities from responses |
| `repository` | Spring Data JPA interfaces with custom JPQL queries using `JOIN FETCH` to avoid N+1 |
| `service` | Business logic, manual DTO-to-Entity and Entity-to-DTO conversion, stock management |
| `controller` | REST controllers under `/api` prefix |
| `exception` | `GlobalExceptionHandler` — maps exceptions to HTTP 404, 422, and 500 responses |
| `config` | `JacksonConfig` — registers `Hibernate6Module` for proper lazy-load serialization |

### Key Design Decisions

- **DTOs for all responses:** `ClientDTO` and `PurchaseDTO` are returned by controllers instead of raw JPA entities, preventing circular reference issues and over-fetching.
- **Stock management in `PurchaseService`:** When a purchase is created, each product's stock is decremented via `productService.decreaseStock()`. On update, old product stocks are restored before applying the new list. On delete, stocks are also restored.
- **Custom JPQL with JOIN FETCH:** `ClientRepository` and `PurchaseRepository` use custom queries with `JOIN FETCH` to eagerly load associations within a single query, preventing Hibernate's lazy-loading problems.
- **`@JsonIgnoreProperties`:** Used on bidirectional relationships (`Client ↔ Purchase`) to prevent infinite recursion during JSON serialization.

### Entities & Relationships

```
Client (1) ──────────────── (N) Purchase
                                     │
                         (N) ────────────────── (M) Product
                         [via purchase_products join table]
```

- A `Client` has **many** `Purchase` records (OneToMany)
- A `Purchase` belongs to **one** `Client` (ManyToOne)
- A `Purchase` holds **many** `Product` items (OneToMany via join table `purchase_products`)
- `purchase_products` uses a `product_order` column as part of the PK to allow the same product to appear multiple times in a purchase

### Configuration (`application.yml`)

```yaml
spring:
  application:
    name: ms-products-api
  datasource:
    url: ${DB_URL:jdbc:mysql://localhost:3306/client_product}
    username: ${DB_USER:root}
    password: ${MYSQL_ROOT_PASSWORD:yourpassword}
server:
  port: 8080
```

---

## 🔵 Microservice 2 — `ms-openfeign-client`

**Role:** Consumer / Gateway. Receives frontend requests and delegates to `ms-products-api` via OpenFeign. Has no database access.

**Port:** `8081`

### Package Structure

| Package | Responsibility |
|---|---|
| `client/feign` | OpenFeign declarative HTTP clients (`ClientFeignClient`, `ProductFeignClient`, `PurchaseFeignClient`) |
| `model` | Plain Java models (Lombok `@Data`) matching the DTO shapes returned by the provider |
| `service` | Thin delegation layer — calls the appropriate FeignClient method |
| `controller` | REST endpoints exposed to Angular frontend |
| `config` | `CorsConfig` — allows all HTTP methods from `http://localhost:4200` |

### OpenFeign Pattern

Each FeignClient interface is annotated with `@FeignClient(name = "...", url = "${microservicio.url}")`. The URL is resolved from `application.yml`:

```yaml
microservicio:
  url: http://localhost:8080
```

This makes it trivial to redirect the consumer to any other host without code changes.

The classic alternative (`RestTemplate`) is preserved as a comment in `ClientService` for educational reference.

### Exposed Endpoints

| Resource | Base Path |
|---|---|
| Clients | `/client/**` |
| Products | `/product/**` |
| Purchases | `/purchase/**` |

### CORS

Configured globally in `CorsConfig` to allow `GET`, `POST`, `PUT`, `DELETE` from `http://localhost:4200`.

---

## 🟠 Frontend — `frontend-angular`

**Role:** Single Page Application. Consumes `ms-openfeign-client` at port `8081`.

**Port:** `4200`

### Architecture Pattern

The Angular app follows a **Feature-based module structure**:

```
features/
  client/
    pages/
      client-list/     ← displays all clients
      client-form/     ← create / edit form
    services/
      client.service.ts  ← HTTP calls to :8081/client
  product/
    pages/
      product-list/
      product-form/
    services/
      product.service.ts  ← HTTP calls to :8081/product
  purchase/
    pages/
      purchase-list/
      purchase-form/    ← checkbox-based product selection
    services/
      purchase.service.ts  ← HTTP calls to :8081/purchase
  home/
    pages/
      home-page/
shared/
  components/
    navbar/             ← global navigation bar
  interfaces/
    client.model.ts     ← TypeScript interface
    product.model.ts
    purchase.model.ts
core/
  interceptors/
    http.interceptor.ts ← global HTTP error handler
```

### TypeScript Interfaces

```typescript
// Client
interface Client {
  idClient?: number;
  name: string;
  email: string;
  phone: string;
  purchases: Purchase[];
}

// Product
interface Product {
  id?: number;
  name: string;
  price: number;
  stock: number;
}

// Purchase
interface Purchase {
  idPurchase?: number;
  idClient: number;
  clientName: string;
  products: Product[];
  quantity: number;
}
```

### Routing

| Route | Component | Purpose |
|---|---|---|
| `/` | `HomePageComponent` | Dashboard / landing page |
| `/clients` | `ClientListComponent` | List all clients |
| `/clients/new` | `ClientFormComponent` | Create new client |
| `/clients/edit/:id` | `ClientFormComponent` | Edit existing client |
| `/products` | `ProductListComponent` | List all products |
| `/products/new` | `ProductFormComponent` | Create new product |
| `/products/edit/:id` | `ProductFormComponent` | Edit existing product |
| `/purchases` | `PurchaseListComponent` | List all purchases |
| `/purchases/new` | `PurchaseFormComponent` | Create new purchase |
| `/purchases/edit/:id` | `PurchaseFormComponent` | Edit existing purchase |
| `/**` | `HomePageComponent` | Wildcard redirect |

### HTTP Interceptor

A functional interceptor (`httpErrorInterceptor`) is registered globally via `app.config.ts`. It catches HTTP errors and logs/navigates accordingly:

| Status | Action |
|---|---|
| `400` | Logs Bad Request |
| `401` | Logs and redirects to `/` |
| `403` | Logs permission error |
| `404` | Logs resource not found |
| `500` | Logs server error |

### Purchase Form — Product Selection

The `PurchaseFormComponent` loads all available products and renders them as checkboxes. When a checkbox is toggled, the product is added or removed from `purchase.products[]`. On submit, the full purchase object (including the `products` array) is sent to the backend.

---

## 🗄️ Database Schema

> DDL is provided in [`mysql_query.sql`](./mysql_query.sql).

```sql
-- Clients
CREATE TABLE clients (
    id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre   VARCHAR(40) NOT NULL,   -- mapped to: name
    email    VARCHAR(40) NOT NULL,
    telefono VARCHAR(40) NOT NULL    -- mapped to: phoneNumber
);

-- Products
CREATE TABLE products (
    id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(40)    NOT NULL,  -- mapped to: name
    precio DECIMAL        NOT NULL,  -- mapped to: price
    stock  INT            NOT NULL
);

-- Purchases
CREATE TABLE purchases (
    id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT NOT NULL,
    cantidad  INT    NOT NULL,        -- mapped to: quantity
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Many-to-Many: Purchase ↔ Product
CREATE TABLE purchase_products (
    purchase_id   BIGINT NOT NULL,
    product_id    BIGINT NOT NULL,
    product_order INT    NOT NULL DEFAULT 0,  -- allows duplicate products
    PRIMARY KEY (purchase_id, product_order),
    FOREIGN KEY (purchase_id) REFERENCES purchases(id),
    FOREIGN KEY (product_id)  REFERENCES products(id)
);
```

> **Note:** Column names in the DB are in Spanish (`nombre`, `telefono`, `precio`, `cantidad`). JPA `@Column(name = "...")` annotations map them to English Java field names.

---

## 📡 API Reference

### `ms-products-api` — Base URL: `http://localhost:8080`

#### Clients `/api/clientes`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/clientes` | Get all clients (with purchases) |
| `GET` | `/api/clientes/{id}` | Get client by ID |
| `POST` | `/api/clientes` | Create a new client |
| `PUT` | `/api/clientes/{id}` | Update an existing client |
| `DELETE` | `/api/clientes/{id}` | Delete a client by ID |

#### Products `/api/productos`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/productos` | Get all products |
| `GET` | `/api/productos/{id}` | Get product by ID |
| `POST` | `/api/productos` | Create a new product |
| `PUT` | `/api/productos/{id}` | Update an existing product |
| `DELETE` | `/api/productos/{id}` | Delete a product by ID |
| `GET` | `/api/productos/minusStock` | Get top 10 products with lowest stock |

#### Purchases `/api/compras`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/compras` | Get all purchases |
| `GET` | `/api/compras/{id}` | Get purchase by ID |
| `POST` | `/api/compras` | Create a purchase (decrements stock) |
| `PUT` | `/api/compras/{id}` | Update a purchase (restores then decrements stock) |
| `DELETE` | `/api/compras/{id}` | Delete a purchase (restores stock) |

---

### `ms-openfeign-client` — Base URL: `http://localhost:8081`

#### Clients `/client`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/client/allClients` | Get all clients |
| `GET` | `/client/{id}` | Get client by ID |
| `POST` | `/client/create` | Create client |
| `PUT` | `/client/update/{id}` | Update client |
| `DELETE` | `/client/delete/{id}` | Delete client |

#### Products `/product`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/product/allProducts` | Get all products |
| `GET` | `/product/{id}` | Get product by ID |
| `POST` | `/product/create` | Create product |
| `PUT` | `/product/update/{id}` | Update product |
| `DELETE` | `/product/delete/{id}` | Delete product |
| `GET` | `/product/minusStock` | Products with lowest stock |

#### Purchases `/purchase`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/purchase/allPurchases` | Get all purchases |
| `GET` | `/purchase/{id}` | Get purchase by ID |
| `POST` | `/purchase/create` | Create purchase |
| `PUT` | `/purchase/update/{id}` | Update purchase |
| `DELETE` | `/purchase/delete/{id}` | Delete purchase |

---

## 🚀 Getting Started

### Prerequisites

- Java 21+
- Maven 3.8+
- Node.js 18+ & npm
- Docker & Docker Compose

---

### 1. Start MySQL with Docker

```bash
# Copy and configure environment variables
cp .env.example .env

# Start MySQL container
docker-compose up -d
```

---

### 2. Run `ms-products-api` (Provider)

```bash
cd ms-products-api
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`.

---

### 3. Run `ms-openfeign-client` (Consumer)

```bash
cd ms-openfeign-client
./mvnw spring-boot:run
```

The consumer gateway will be available at `http://localhost:8081`.

---

### 4. Run the Angular Frontend

```bash
cd frontend-angular
npm install
npm start
```

Open your browser at `http://localhost:4200`.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```env
MYSQL_ROOT_PASSWORD=your_password_here
MYSQL_DATABASE=client_product
CONTAINER_NAME=bd-openfeign
```

These are consumed by `docker-compose.yml` to configure the MySQL container.

For `ms-products-api`, the datasource password can also be overridden with the `MYSQL_ROOT_PASSWORD` environment variable (see `application.yml`).

---

## 👨‍💻 Author

**maubmz** — [GitHub](https://github.com/maubmz)
