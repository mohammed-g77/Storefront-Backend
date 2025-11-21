DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('pending','paid','processing','shipped','completed','cancelled','refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  status order_status DEFAULT 'pending',
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  shipping_address_id INTEGER REFERENCES addresses(id),
  billing_address_id INTEGER REFERENCES addresses(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
