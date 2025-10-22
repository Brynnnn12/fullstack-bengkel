# Bengkel Management System API

Backend API untuk sistem manajemen bengkel yang dibangun dengan Node.js, Express, TypeScript, dan Prisma ORM.

## 📋 Daftar Isi

- [Fitur](#fitur)
- [Tech Stack](#tech-stack)
- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

## ✨ Fitur

### 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (Manager, Kasir)
- Secure password hashing dengan bcrypt

### 👥 User Management

- User registration dan login
- Role assignment (Manager/Kasir)

### 👨‍🔧 Customer Management

- CRUD operations untuk customer
- Pagination support
- Search functionality

### 🚗 Vehicle Management

- CRUD operations untuk vehicle
- Link dengan customer
- Unique registration plate validation

### 📋 Service Log Management

- CRUD operations untuk service logs
- Link dengan user, vehicle, dan service items
- Automatic stock management
- Total cost calculation

### 🔧 Service Item Management

- CRUD operations untuk service items dalam service log
- Stock validation dan adjustment
- Link dengan inventory items

### 📦 Inventory Management

- CRUD operations untuk inventory items
- SKU uniqueness validation
- Stock tracking dan alerts
- Search, filter, dan sorting
- Low stock dan out of stock notifications

### 🔍 Advanced Features

- Pagination pada semua list endpoints
- Search functionality
- Filtering (stock levels, dll)
- Sorting (multiple fields)
- Comprehensive error handling
- Input validation dengan Zod

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon Cloud)
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Password Hashing**: bcryptjs
- **CORS**: cors
- **Rate Limiting**: express-rate-limit
- **Security**: Helmet
- **Logging**: Morgan

## 📋 Prasyarat

- Node.js (v18 atau lebih baru)
- npm atau yarn
- PostgreSQL database (Neon recommended)
- Git

## 🚀 Instalasi

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd fullstack-bengkel/backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   ```bash
   cp .env.example .env
   # Edit .env file dengan konfigurasi database dan JWT secret
   ```

4. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

## ⚙️ Konfigurasi Environment

Buat file `.env` di root directory dengan konfigurasi berikut:

```env
# Database
DATABASE_URL="postgresql://username:password@hostname:port/database"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV="development"
```

## ▶️ Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

Server akan berjalan di `http://localhost:3000`

## 🗄️ Database Setup

1. **Push schema ke database**

   ```bash
   npx prisma db push
   ```

2. **Seed initial data**

   ```bash
   npx prisma db seed
   ```

3. **Generate Prisma client** (setelah perubahan schema)
   ```bash
   npx prisma generate
   ```

### Database Schema Overview

```
User (Manager/Kasir) ──┬── ServiceLog ─── ServiceItem ─── InventoryItem
                      │
Customer ─────────────┼── Vehicle
                      │
Role ─────────────────┴── UserRole
```

## 📚 API Documentation

Base URL: `http://localhost:3000/api`

### 🔐 Authentication Endpoints

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "manager@bengkel.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user-id",
      "email": "manager@bengkel.com",
      "name": "Manager",
      "roles": ["Manager"]
    },
    "token": "jwt-token-here"
  }
}
```

### 👥 Customer Endpoints

#### Get All Customers (with pagination)

```http
GET /api/customers?page=1&limit=10
Authorization: Bearer <token>
```

#### Create Customer

```http
POST /api/customers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "phoneNumber": "08123456789"
}
```

#### Get Customer by ID

```http
GET /api/customers/{id}
Authorization: Bearer <token>
```

#### Update Customer

```http
PUT /api/customers/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "phoneNumber": "08123456789"
}
```

#### Delete Customer

```http
DELETE /api/customers/{id}
Authorization: Bearer <token>
```

### 🚗 Vehicle Endpoints

#### Get All Vehicles

```http
GET /api/vehicles?page=1&limit=10
Authorization: Bearer <token>
```

#### Create Vehicle

```http
POST /api/vehicles
Authorization: Bearer <token>
Content-Type: application/json

{
  "registrationPlate": "B 1234 ABC",
  "make": "Toyota",
  "model": "Avanza",
  "customerId": "customer-id"
}
```

#### Get Vehicle by ID

```http
GET /api/vehicles/{id}
Authorization: Bearer <token>
```

#### Update Vehicle

```http
PUT /api/vehicles/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "registrationPlate": "B 1234 ABC",
  "make": "Toyota",
  "model": "Avanza",
  "customerId": "customer-id"
}
```

#### Delete Vehicle

```http
DELETE /api/vehicles/{id}
Authorization: Bearer <token>
```

### 📋 Service Log Endpoints

#### Get All Service Logs

```http
GET /api/service-logs?page=1&limit=10
Authorization: Bearer <token>
```

#### Create Service Log

```http
POST /api/service-logs
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2025-10-22T10:00:00Z",
  "totalCost": 150000,
  "notes": "Oil change and tire rotation",
  "vehicleId": "vehicle-id",
  "serviceItems": [
    {
      "description": "Engine Oil",
      "quantity": 1,
      "price": 50000,
      "inventoryItemId": "inventory-id"
    },
    {
      "description": "Oil Filter",
      "quantity": 1,
      "price": 25000,
      "inventoryItemId": "inventory-id-2"
    }
  ]
}
```

#### Get Service Log by ID

```http
GET /api/service-logs/{id}
Authorization: Bearer <token>
```

#### Update Service Log

```http
PUT /api/service-logs/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2025-10-22T10:00:00Z",
  "totalCost": 200000,
  "notes": "Updated service notes",
  "vehicleId": "vehicle-id",
  "serviceItems": [
    {
      "description": "Engine Oil Premium",
      "quantity": 1,
      "price": 75000,
      "inventoryItemId": "inventory-id"
    }
  ]
}
```

#### Delete Service Log

```http
DELETE /api/service-logs/{id}
Authorization: Bearer <token>
```

### 🔧 Service Item Endpoints

#### Get Service Items by Service Log ID

```http
GET /api/service-items/service-logs/{serviceLogId}/items
Authorization: Bearer <token>
```

#### Create Service Item

```http
POST /api/service-items/service-logs/{serviceLogId}/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Brake Pad",
  "quantity": 2,
  "price": 150000,
  "inventoryItemId": "inventory-id"
}
```

#### Get Service Item by ID

```http
GET /api/service-items/{id}
Authorization: Bearer <token>
```

#### Update Service Item

```http
PUT /api/service-items/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Brake Pad Premium",
  "quantity": 2,
  "price": 180000,
  "inventoryItemId": "inventory-id"
}
```

#### Delete Service Item

```http
DELETE /api/service-items/{id}
Authorization: Bearer <token>
```

### 📦 Inventory Endpoints

#### Get All Inventory Items (with search/filter)

```http
GET /api/inventory?page=1&limit=10&search=oil&stockFilter=available&sortBy=name&sortOrder=asc
Authorization: Bearer <token>
```

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search by name or SKU
- `stockFilter`: `low` | `out` | `available`
- `sortBy`: `name` | `sku` | `stock` | `sellingPrice`
- `sortOrder`: `asc` | `desc`

#### Get Inventory Item by ID

```http
GET /api/inventory/{id}
Authorization: Bearer <token>
```

#### Get Low Stock Items

```http
GET /api/inventory/alerts/low-stock
Authorization: Bearer <token>
```

#### Get Out of Stock Items

```http
GET /api/inventory/alerts/out-of-stock
Authorization: Bearer <token>
```

#### Get Inventory Summary

```http
GET /api/inventory/summary/overview
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalItems": 25,
    "totalValue": 5000000,
    "lowStockCount": 3,
    "outOfStockCount": 1
  }
}
```

#### Create Inventory Item (Manager only)

```http
POST /api/inventory
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Engine Oil 5W-30",
  "sku": "EO-5W30-1L",
  "stock": 50,
  "sellingPrice": 75000
}
```

#### Update Inventory Item (Manager only)

```http
PUT /api/inventory/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Engine Oil 5W-30 Premium",
  "sku": "EO-5W30-1L",
  "stock": 45,
  "sellingPrice": 85000
}
```

#### Delete Inventory Item (Manager only)

```http
DELETE /api/inventory/{id}
Authorization: Bearer <token>
```

## 🧪 Testing

### Manual Testing dengan cURL

#### 1. Login dan dapatkan token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@bengkel.com","password":"password123"}'
```

#### 2. Test Customer CRUD

```bash
# Get all customers
curl -X GET "http://localhost:3000/api/customers?page=1&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create customer
curl -X POST http://localhost:3000/api/customers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","phoneNumber":"08123456789"}'
```

#### 3. Test Inventory Management

```bash
# Get inventory with search
curl -X GET "http://localhost:3000/api/inventory?search=oil&stockFilter=available" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get low stock alerts
curl -X GET "http://localhost:3000/api/inventory/alerts/low-stock" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create inventory item
curl -X POST http://localhost:3000/api/inventory \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Brake Pad","sku":"BP-001","stock":20,"sellingPrice":150000}'
```

### Postman Collection

Import file `Bengkel-API.postman_collection.json` ke Postman untuk testing lengkap.

### Test Data

Setelah menjalankan `npx prisma db seed`, data test berikut akan tersedia:

**Users:**

- Manager: `manager@bengkel.com` / `password123`
- Kasir: `kasir@bengkel.com` / `password123`

**Sample Data:**

- 5 customers dengan vehicles
- 10 inventory items dengan berbagai stock levels
- Sample service logs

## 🚀 Deployment

### Environment Variables untuk Production

```env
NODE_ENV=production
DATABASE_URL=your_production_db_url
JWT_SECRET=your_secure_jwt_secret
PORT=3000
```

### Build untuk Production

```bash
npm run build
npm start
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Kontribusi

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

Untuk pertanyaan atau dukungan, silakan buat issue di repository ini.

---

**Catatan:** Pastikan database PostgreSQL Anda dapat diakses dan environment variables sudah dikonfigurasi dengan benar sebelum menjalankan aplikasi.</content>
<parameter name="filePath">d:\Projek\fullstack-bengkel\backend\README.md
