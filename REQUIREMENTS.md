# Requirements

## Database Schema

### Users Table (`users`)
| Column | Type | Description |
| --- | --- | --- |
| id | SERIAL | Primary Key |
| email | VARCHAR(255) | Unique, Not Null |
| password_hash | VARCHAR(255) | Not Null |
| first_name | VARCHAR(100) | |
| last_name | VARCHAR(100) | |
| is_admin | BOOLEAN | Default: FALSE |
| created_at | TIMESTAMP | Default: now() |

### Categories Table (`categories`)
| Column | Type | Description |
| --- | --- | --- |
| id | SERIAL | Primary Key |
| name | VARCHAR(100) | Unique, Not Null |
| description | TEXT | |
| created_at | TIMESTAMP | Default: now() |

### Products Table (`products`)
| Column | Type | Description |
| --- | --- | --- |
| id | SERIAL | Primary Key |
| name | VARCHAR(255) | Not Null |
| description | TEXT | |
| price | NUMERIC(12,2) | Not Null |
| sku | VARCHAR(100) | |
| stock | INTEGER | Default: 0 |
| category_id | INTEGER | FK -> categories(id) |
| created_at | TIMESTAMP | Default: now() |

### Addresses Table (`addresses`)
| Column | Type | Description |
| --- | --- | --- |
| id | SERIAL | Primary Key |
| user_id | INTEGER | FK -> users(id) |
| line1 | VARCHAR(255) | Not Null |
| line2 | VARCHAR(255) | |
| city | VARCHAR(100) | |
| state | VARCHAR(100) | |
| postal_code | VARCHAR(30) | |
| country | VARCHAR(100) | |
| is_primary | BOOLEAN | Default: FALSE |
| created_at | TIMESTAMP | Default: now() |

### Orders Table (`orders`)
| Column | Type | Description |
| --- | --- | --- |
| id | SERIAL | Primary Key |
| user_id | INTEGER | FK -> users(id) |
| status | ENUM | 'pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled', 'refunded' |
| total | NUMERIC(12,2) | Not Null, Default: 0 |
| shipping_address_id | INTEGER | FK -> addresses(id) |
| billing_address_id | INTEGER | FK -> addresses(id) |
| created_at | TIMESTAMP | Default: now() |
| updated_at | TIMESTAMP | Default: now() |

### Order Products Table (`order_products`)
| Column | Type | Description |
| --- | --- | --- |
| id | SERIAL | Primary Key |
| order_id | INTEGER | FK -> orders(id) |
| product_id | INTEGER | FK -> products(id) |
| unit_price | NUMERIC(12,2) | Not Null |
| quantity | INTEGER | Not Null, > 0 |
| created_at | TIMESTAMP | Default: now() |

### Payments Table (`payments`)
| Column | Type | Description |
| --- | --- | --- |
| id | SERIAL | Primary Key |
| order_id | INTEGER | FK -> orders(id) |
| payment_method | VARCHAR(100) | |
| amount | NUMERIC(12,2) | Not Null |
| provider_transaction_id | VARCHAR(255) | |
| status | VARCHAR(50) | |
| created_at | TIMESTAMP | Default: now() |

### Reviews Table (`reviews`)
| Column | Type | Description |
| --- | --- | --- |
| id | SERIAL | Primary Key |
| user_id | INTEGER | FK -> users(id) |
| product_id | INTEGER | FK -> products(id) |
| rating | INTEGER | 1-5 |
| comment | TEXT | |
| created_at | TIMESTAMP | Default: now() |

### Carts Table (`carts`)
| Column | Type | Description |
| --- | --- | --- |
| id | SERIAL | Primary Key |
| user_id | INTEGER | Unique, FK -> users(id) |
| created_at | TIMESTAMP | Default: now() |
| updated_at | TIMESTAMP | Default: now() |

### Cart Items Table (`cart_items`)
| Column | Type | Description |
| --- | --- | --- |
| id | SERIAL | Primary Key |
| cart_id | INTEGER | FK -> carts(id) |
| product_id | INTEGER | FK -> products(id) |
| quantity | INTEGER | Not Null, > 0 |
| added_at | TIMESTAMP | Default: now() |

## API Routes

### Users
- `GET /api/users` - Index (Auth required)
- `GET /api/users/:id` - Show (Auth required)
- `POST /api/users` - Create

### Products
- `GET /api/products` - Index
- `GET /api/products/:id` - Show
- `POST /api/products` - Create (Admin required)

### Orders
- `GET /api/orders` - Index (Auth required)
- `GET /api/orders/:id` - Show (Auth required)
- `POST /api/orders` - Create (Auth required)
- `GET /api/orders/:id/products` - Get products in order (Auth required)
- `POST /api/orders/:id/products` - Add product to order (Auth required)

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login

### Carts
- `GET /api/cart` - Get cart (Auth required)
- `POST /api/cart/items` - Add item (Auth required)
- `PUT /api/cart/items/:itemId` - Update item quantity (Auth required)
- `DELETE /api/cart/items/:itemId` - Remove item (Auth required)
