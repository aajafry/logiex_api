# logiEx API Documentation Overview

logiEx is a multi-inventory management API application build with Node.js, Express.js and PostgreSQL. which is designed for comprehensive management of user, employee, customer, vendor, vehicle, category, product, inventory, purchase, transfer, sale and shipment. This document outlines all available API endpoints.

## Installation Instructions

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/aajafry/logiEx_api.git
   ```

2. **Create Migrations Directory:**

- Make a directory for storing migrated schema files:

```bash
mkdir migrations
```

3. **Set Up Environment Variables:**

- Create a `.env` file in the root directory and add the following:

```env
PORT=3000
NODE_ENV=(set `production` || `development`)
JWT_SECRET=flwxyzoiwrhgoxyz2pqjknxyznlbnh
TOKEN_EXPIRY=8h
DATABASE_URL=postgres://postgres:1234@localhost:5432/logiex
CLIENT_URL=http://example.com
EMAIL_ADDRESS=no-replay@gmail.com
APP_PASSWORD=ngdxyzjcghfxyzjb (set your gmail app password)
CLOUDINARY_CLOUD_NAME=(set your cloudinary cloud name)
CLOUDINARY_API_KEY=(set your cloudinary cloud API key)
CLOUDINARY_API_SECRET=(set your cloudinary API secret)
```

4. **Install Dependencies:**

```bash
npm install
```

5. **Database Setup Commands:**

- Generate database schema:

```bash
npm run db:generate
```

- Run migrations:

```bash
npm run db:migrate
```

- Update the database (combines generation and migration):

```bash
npm run db:update
```

- Drop the database:

```bash
npm run db:drop
```

6. Start the Server:

```bash
npm run dev
```

## Authentication and Authorization

logiEx uses JWT (JSON Web Token) for authentication. To access protected endpoints, clients must include the JWT token in the `Authorization` header as follows.

Role-based authorization is implemented to restrict access to certain endpoints based on user roles (e.g., admin, procurement-manager, fleet-manager, inventory-manager,inventory-in-charge, captain, guest).

## Endpoints

### Authentication Endpoints

- **Register**

  - **Endpoint:** `domain/register`
  - **Method:** POST
  - **Description:** register a user as a guest.
  - **Access:** _all users._

- **Login**

  - **Endpoint:** `domain/login`
  - **Method:** POST
  - **Description:** Authenticate a user and return a JWT token.
  - **Access:** _all users_

- **Request Password Reset**

  - **Endpoint:** `domain/request-password-reset`
  - **Method:** POST
  - **Description:** given email of user and return a validation link through email.
  - **Access:** _all users_

- **Reset Password**

  - **Endpoint:** `domain/reset-password`
  - **Method:** POST
  - **Description:** given token and new password of user and return a success message.
  - **Access:** _all users_

- **Logout**

  - **Endpoint:** `domain/logout/:id`
  - **Method:** POST
  - **Description:** given user ID as a params and return a success message with set user online status as offline.
  - **Access:** _all users_

---

### User Endpoints

- **Create User**

  - **Endpoint:** `domain/users`
  - **Method:** POST
  - **Description:** create a new user.
  - **Access:** _'admin', 'fleet-manager' and 'inventory-manager'_

- **View Users**

  - **Endpoint:** `domain/users`
  - **Method:** GET
  - **Description:** Retrieve a list of all user.
  - **Access:** _'admin', 'fleet-manager', 'inventory-manager' and 'guest'_

- **View User**

  - **Endpoint:** `domain/users/:id`
  - **Method:** GET
  - **Description:** Retrieve details of a specific user by ID.
  - **Access:** _'admin', 'fleet-manager', 'inventory-manager' and 'guest'_

- **Update User**

  - **Endpoint:** `domain/users/:id`
  - **Method:** PUT
  - **Description:** Update the details of a specific user by ID.
  - **Access:** _'admin', 'fleet-manager' and 'inventory-manager'_

- **Delete User**

  - **Endpoint:** `domain/users/:id`
  - **Method:** DELETE
  - **Description:** Delete a specific user by ID.
  - **Access:** _'admin'_

---

### Customer Endpoints

- **Create Customer**

  - **Endpoint:** `domain/customers`
  - **Method:** POST
  - **Description:** create a new customer.
  - **Access:** _'admin', 'inventory-manager' and 'inventory-in-charge'_

- **View Customers**

  - **Endpoint:** `domain/customers`
  - **Method:** GET
  - **Description:** Retrieve a list of all customer.
  - **Access:** _'admin', 'inventory-manager', 'inventory-in-charge', and 'guest'_

- **View Customer**

  - **Endpoint:** `domain/customers/:id`
  - **Method:** GET
  - **Description:** Retrieve details of a specific customer by ID.
  - **Access:** _'admin', 'inventory-manager', 'inventory-in-charge', and 'guest'_

- **Update Customer**

  - **Endpoint:** `domain/customers/:id`
  - **Method:** PUT
  - **Description:** Update the details of a specific customer by ID.
  - **Access:** _'admin', 'inventory-manager' and 'inventory-in-charge'_

- **Delete User**

  - **Endpoint:** `domain/customers/:id`
  - **Method:** DELETE
  - **Description:** Delete a specific customer by ID.
  - **Access:** _'admin'_

---

### Vehicle Endpoints

- **Create Vehicle**

  - **Endpoint:** `domain/vehicles`
  - **Method:** POST
  - **Description:** create a new vehicle.
  - **Access:** _'admin' and 'fleet-manager'_

- **View Vehicles**

  - **Endpoint:** `domain/vehicles`
  - **Method:** GET
  - **Description:** Retrieve a list of all vehicle.
  - **Access:** _'admin', 'fleet-manager', 'inventory-manager', 'inventory-in-charge' and 'guest'_

- **View Vehicle**

  - **Endpoint:** `domain/vehicles/:vin`
  - **Method:** GET
  - **Description:** Retrieve details of a specific vehicle by VIN.
  - **Access:** _'admin', 'fleet-manager', 'inventory-manager', 'inventory-in-charge' and 'guest'_

- **Update Vehicle**

  - **Endpoint:** `domain/vehicles/:vin`
  - **Method:** PUT
  - **Description:** Update the details of a specific vehicle by VIN.
  - **Access:** _'admin', and 'fleet-manager'_

- **Delete Vehicle**

  - **Endpoint:** `domain/vehicles/:vin`
  - **Method:** DELETE
  - **Description:** Delete a specific vehicle by VIN.
  - **Access:** _'admin', and 'fleet-manager'_

---

### Vendor Endpoints

- **Create Vendor**

  - **Endpoint:** `domain/vendors`
  - **Method:** POST
  - **Description:** create a new vendor.
  - **Access:** _'admin' and 'procurement-manager'_

- **View Vendors**

  - **Endpoint:** `domain/vendors`
  - **Method:** GET
  - **Description:** Retrieve a list of all vendor.
  - **Access:** _'admin', 'procurement-manager', 'inventory-manager', and 'guest'_

- **View Vendor**

  - **Endpoint:** `domain/vendors/:name`
  - **Method:** GET
  - **Description:** Retrieve details of a specific vendor by name.
  - **Access:** _'admin', 'procurement-manager', 'inventory-manager', and 'guest'_

- **Update Vendor**

  - **Endpoint:** `domain/vendors/:name`
  - **Method:** PUT
  - **Description:** Update the details of a specific vendor by name.
  - **Access:** _'admin' and 'procurement-manager'_

- **Delete Vendor**

  - **Endpoint:** `domain/vendors/:name`
  - **Method:** DELETE
  - **Description:** Delete a specific vendor by name.
  - **Access:** _'admin' and 'procurement-manager'_

---

### Inventory Endpoints

- **Create Inventory**

  - **Endpoint:** `domain/inventories`
  - **Method:** POST
  - **Description:** create a new inventory.
  - **Access:** _'admin' and 'inventory-manager'_

- **View Inventories**

  - **Endpoint:** `domain/inventories`
  - **Method:** GET
  - **Description:** Retrieve a list of all inventory.
  - **Access:** _'admin', 'procurement-manager', 'inventory-manager', 'inventory-in-charge' and 'guest'_

- **View Inventory**

  - **Endpoint:** `domain/inventories/:name`
  - **Method:** GET
  - **Description:** Retrieve details of a specific inventory by name.
  - **Access:** _'admin', 'procurement-manager', 'inventory-manager', 'inventory-in-charge' and 'guest'_

- **Update Inventory**

  - **Endpoint:** `domain/inventories/:name`
  - **Method:** PUT
  - **Description:** Update the details of a specific inventory by name.
  - **Access:** _'admin' and 'inventory-manager'_

- **Delete Inventory**

  - **Endpoint:** `domain/inventories/:name`
  - **Method:** DELETE
  - **Description:** Delete a specific inventory by name.
  - **Access:** _'admin'_

---

### Category Endpoints

- **Create Category**

  - **Endpoint:** `domain/categories`
  - **Method:** POST
  - **Description:** create a new category.
  - **Access:** _'admin', 'procurement-manager' and 'inventory-manager'_

- **View Categories**

  - **Endpoint:** `domain/categories`
  - **Method:** GET
  - **Description:** Retrieve a list of all category.
  - **Access:** _'admin', 'procurement-manager', 'inventory-manager', 'inventory-in-charge' and 'guest'_

- **View Category**

  - **Endpoint:** `domain/categories/:name`
  - **Method:** GET
  - **Description:** Retrieve details of a specific category by name.
  - **Access:** _'admin', 'procurement-manager', 'inventory-manager', 'inventory-in-charge' and 'guest'_

- **Update Category**

  - **Endpoint:** `domain/categories/:name`
  - **Method:** PUT
  - **Description:** Update the details of a specific category by name.
  - **Access:** _'admin', 'procurement-manager' and 'inventory-manager'_

- **Delete Category**

  - **Endpoint:** `domain/categories/:name`
  - **Method:** DELETE
  - **Description:** Delete a specific category by name.
  - **Access:** _'admin', 'procurement-manager' and 'inventory-manager'_

---

### Product Endpoints

- **Create Product**

  - **Endpoint:** `domain/products`
  - **Method:** POST
  - **Description:** create a new product.
  - **Access:** _'admin', 'procurement-manager' and 'inventory-manager'_

- **View Products**

  - **Endpoint:** `domain/products`
  - **Method:** GET
  - **Description:** Retrieve a list of all product.
  - **Access:** _'admin', 'procurement-manager', 'inventory-manager', 'inventory-in-charge' and 'guest'_

- **View Product**

  - **Endpoint:** `domain/products/:name`
  - **Method:** GET
  - **Description:** Retrieve details of a specific product by name.
  - **Access:** _'admin', 'procurement-manager', 'inventory-manager', 'inventory-in-charge' and 'guest'_

- **Update Product**

  - **Endpoint:** `domain/products/:name`
  - **Method:** PUT
  - **Description:** Update the details of a specific product by name.
  - **Access:** _'admin', 'procurement-manager' and 'inventory-manager'_

- **Delete Product**

  - **Endpoint:** `domain/products/:name`
  - **Method:** DELETE
  - **Description:** Delete a specific product by name.
  - **Access:** _'admin', 'procurement-manager' and 'inventory-manager'_

---

### Inventory Employment Endpoints

- **Create Inventory Employment**

  - **Endpoint:** `domain/inventory-employments`
  - **Method:** POST
  - **Description:** create a new employee assign the inventory.
  - **Access:** _'admin', and 'inventory-manager'_

- **View Inventory Employmentes**

  - **Endpoint:** `domain/inventory-employments`
  - **Method:** GET
  - **Description:** Retrieve a list of all inventory-employments.
  - **Access:** _'admin', 'inventory-manager', 'inventory-in-charge' and 'guest'_

- **View Inventory Employment**

  - **Endpoint:** `domain/inventory-employments/:id`
  - **Method:** GET
  - **Description:** Retrieve details of a specific inventory-employment by ID.
  - **Access:** _'admin', 'inventory-manager', 'inventory-in-charge' and 'guest'_

- **Update Inventory Employment**

  - **Endpoint:** `domain/inventory-employments/:id`
  - **Method:** PUT
  - **Description:** Update the details of a specific inventory-employment by ID.
  - **Access:** _'admin', and 'inventory-manager'_

- **Delete Inventory Employment**

  - **Endpoint:** `domain/inventory-employments/:id`
  - **Method:** DELETE
  - **Description:** Delete a specific inventory-employment by ID.
  - **Access:** _'admin', and 'inventory-manager'_

---

### Purchase Endpoints

- **Create Purchase**

  - **Endpoint:** `domain/purchases`
  - **Method:** POST
  - **Description:** create a new purchase.
  - **Access:** _'admin', and 'procurement-manager'_

- **View Purchases**

  - **Endpoint:** `domain/purchases`
  - **Method:** GET
  - **Description:** Retrieve a list of all purchases.
  - **Access:** _'admin', 'procurement-manager', 'inventory-manager', 'inventory-in-charge' and 'guest'_

- **View Purchase**

  - **Endpoint:** `domain/purchases/:mrId`
  - **Method:** GET
  - **Description:** Retrieve details of a specific purchase by MR ID.
  - **Access:** _'admin', 'procurement-manager', 'inventory-manager', 'inventory-in-charge' and 'guest'_

- **Update Purchase**

  - **Endpoint:** `domain/purchases/:mrId`
  - **Method:** PUT
  - **Description:** Update the details of a specific purchase by MR ID.
  - **Access:** _'admin', and 'procurement-manager_

- **Delete Purchase**

  - **Endpoint:** `domain/purchases/:mrId`
  - **Method:** DELETE
  - **Description:** Delete a specific purchase by MR ID.
  - **Access:** _'admin'_

---

### Purchase Product Endpoints

- **View Purchase Products**

  - **Endpoint:** `domain/purchase-products`
  - **Method:** GET
  - **Description:** Retrieve a list of all purchase-products.
  - **Access:** _'admin', 'procurement-manager', 'inventory-manager', 'inventory-in-charge' and 'guest'_

- **View Purchase Products**

  - **Endpoint:** `domain/purchase-products/:id`
  - **Method:** GET
  - **Description:** Retrieve details of a specific purchase-products by ID.
  - **Access:** _'admin', 'procurement-manager', 'inventory-manager', 'inventory-in-charge' and 'guest'_

- **Update Purchase Products**

  - **Endpoint:** `domain/purchase-products/:id`
  - **Method:** PUT
  - **Description:** Update the details of a specific purchase-products by ID.
  - **Access:** _'admin', and 'procurement-manager_

- **Delete Purchase Products**

  - **Endpoint:** `domain/purchase-products/:id`
  - **Method:** DELETE
  - **Description:** Delete a specific purchase-products by ID.
  - **Access:** _'admin'_

---

### Sale Endpoints

- **Create Sale**

  - **Endpoint:** `domain/sales`
  - **Method:** POST
  - **Description:** create a new sale.
  - **Access:** _'admin', 'inventory-manager' and 'inventory-in-charge'_

- **View Sales**

  - **Endpoint:** `domain/sales`
  - **Method:** GET
  - **Description:** Retrieve a list of all sales.
  - **Access:** _'admin', 'fleet-manager', 'inventory-manager', 'inventory-in-charge', 'captain' and 'guest'_

- **View Sale**

  - **Endpoint:** `domain/sales/:billId`
  - **Method:** GET
  - **Description:** Retrieve details of a specific sale by BILL ID.
  - **Access:** _'admin', 'fleet-manager', 'inventory-manager', 'inventory-in-charge', 'captain' and 'guest'_

- **Update Sale**

  - **Endpoint:** `domain/sales/:billId`
  - **Method:** PUT
  - **Description:** Update the details of a specific sale by BILL ID.
  - **Access:** _'admin', 'inventory-manager' and 'inventory-in-charge'_

- **Delete Sale**

  - **Endpoint:** `domain/sales/:billId`
  - **Method:** DELETE
  - **Description:** Delete a specific sale by BILL ID.
  - **Access:** _'admin' and 'inventory-manager'_

---

### Sale Product Endpoints

- **View Sale Products**

  - **Endpoint:** `domain/sale-products`
  - **Method:** GET
  - **Description:** Retrieve a list of all sale-products.
  - **Access:** _'admin', 'fleet-manager', 'inventory-manager', 'inventory-in-charge', 'captain' and 'guest'_

- **View Sale Products**

  - **Endpoint:** `domain/sale-products/:id`
  - **Method:** GET
  - **Description:** Retrieve details of a specific sale-products by ID.
  - **Access:** _'admin', 'fleet-manager', 'inventory-manager', 'inventory-in-charge', 'captain' and 'guest'_

- **Update Sale Products**

  - **Endpoint:** `domain/sale-products/:id`
  - **Method:** PUT
  - **Description:** Update the details of a specific sale-products by ID.
  - **Access:** _'admin', 'inventory-manager' and 'inventory-in-charge'_

- **Delete Sale Products**

  - **Endpoint:** `domain/sale-products/:id`
  - **Method:** DELETE
  - **Description:** Delete a specific sale-products by ID.
  - **Access:** _'admin' and 'inventory-manager'_

---

### Transfer Endpoints

- **Create Transfer**

  - **Endpoint:** `domain/transfers`
  - **Method:** POST
  - **Description:** create a new transfer.
  - **Access:** _'admin', 'inventory-manager' and 'inventory-in-charge'_

- **View Transfers**

  - **Endpoint:** `domain/transfers`
  - **Method:** GET
  - **Description:** Retrieve a list of all transfers.
  - **Access:** _'admin', 'inventory-manager', 'inventory-in-charge' and 'guest'_

- **View Transfer**

  - **Endpoint:** `domain/transfers/:trfId`
  - **Method:** GET
  - **Description:** Retrieve details of a specific transfer by TRF ID.
  - **Access:** _'admin', 'inventory-manager', 'inventory-in-charge' and 'guest'_

- **Update Transfer**

  - **Endpoint:** `domain/transfers/:trfId`
  - **Method:** PUT
  - **Description:** Update the details of a transfer sale by TRF ID.
  - **Access:** _'admin', 'inventory-manager' and 'inventory-in-charge'_

- **Delete Transfer**

  - **Endpoint:** `domain/transfers/:trfId`
  - **Method:** DELETE
  - **Description:** Delete a specific transfer by TRF ID.
  - **Access:** _'admin' and 'inventory-manager'_

---

### Transfer Product Endpoints

- **View Transfer Products**

  - **Endpoint:** `domain/transfer-products`
  - **Method:** GET
  - **Description:** Retrieve a list of all transfer-products.
  - **Access:** _'admin', 'inventory-manager', 'inventory-in-charge' and 'guest'_

- **View Transfer Products**

  - **Endpoint:** `domain/transfer-products/:id`
  - **Method:** GET
  - **Description:** Retrieve details of a specific transfer-products by ID.
  - **Access:** _'admin', 'inventory-manager', 'inventory-in-charge' and 'guest'_

- **Update Transfer Products**

  - **Endpoint:** `domain/transfer-products/:id`
  - **Method:** PUT
  - **Description:** Update the details of a transfer transfer-products by ID.
  - **Access:** _'admin', 'inventory-manager' and 'inventory-in-charge'_

- **Delete Transfer Products**

  - **Endpoint:** `domain/transfer-products/:id`
  - **Method:** DELETE
  - **Description:** Delete a specific transfer-products by ID.
  - **Access:** _'admin' and 'inventory-manager'_

---

### Shipment Endpoints

- **Create Shipment**

  - **Endpoint:** `domain/shipments`
  - **Method:** POST
  - **Description:** create a new shipment.
  - **Access:** _'admin' and 'fleet-manager'_

- **View Shipments**

  - **Endpoint:** `domain/shipments`
  - **Method:** GET
  - **Description:** Retrieve a list of all shipments.
  - **Access:** _'admin', 'fleet-manager', 'inventory-manager', 'inventory-in-charge', 'captain' and 'guest'_

- **View Shipment**

  - **Endpoint:** `domain/shipments/:shipmentId`
  - **Method:** GET
  - **Description:** Retrieve details of a specific shipments by Shipment ID.
  - **Access:** _'admin', 'fleet-manager', 'inventory-manager', 'inventory-in-charge', 'captain' and 'guest'_

- **Update Shipment**

  - **Endpoint:** `domain/shipments/:shipmentId`
  - **Method:** PUT
  - **Description:** Update the details of a transfer shipment by Shipment ID.
  - **Access:** _'admin' and 'fleet-manager'_

- **Delete Shipment**

  - **Endpoint:** `domain/shipments/:shipmentId`
  - **Method:** DELETE
  - **Description:** Delete a specific shipment by Shipment ID.
  - **Access:** _'admin' and 'fleet-manager'_

---

### Shipment Product Endpoints

- **View Shipment Products**

  - **Endpoint:** `domain/shipment-products`
  - **Method:** GET
  - **Description:** Retrieve a list of all shipment-products.
  - **Access:** _'admin', 'fleet-manager', 'inventory-manager', 'inventory-in-charge', 'captain' and 'guest'_

- **View Shipment Products**

  - **Endpoint:** `domain/shipment-products/:id`
  - **Method:** GET
  - **Description:** Retrieve details of a specific shipment-products by ID.
  - **Access:** _'admin', 'fleet-manager', 'inventory-manager', 'inventory-in-charge', 'captain' and 'guest'_

- **Update Shipment Products**

  - **Endpoint:** `domain/shipment-products/:id`
  - **Method:** PUT
  - **Description:** Update the details of a transfer shipment-products by ID.
  - **Access:** _'admin', 'inventory-manager' and 'inventory-in-charge'_

- **Delete Shipment Products**

  - **Endpoint:** `domain/shipment-products/:id`
  - **Method:** DELETE
  - **Description:** Delete a specific shipment-products by ID.
  - **Access:** _'admin' and 'inventory-manager'_

---

### Inventory Product Endpoints

- **View Inventory Products**

  - **Endpoint:** `domain/inventory-products`
  - **Method:** GET
  - **Description:** Retrieve a list of all inventory-products.
  - **Access:** _'admin', 'procurement-manager', 'inventory-manager', 'inventory-in-charge', and 'guest'_

- **View Inventory Products**

  - **Endpoint:** `domain/inventory-products/:id`
  - **Method:** GET
  - **Description:** Retrieve details of a specific inventory-products by ID.
  - **Access:** _'admin', 'procurement-manager', 'inventory-manager', 'inventory-in-charge', and 'guest'_
