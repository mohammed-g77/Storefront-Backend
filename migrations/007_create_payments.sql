CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  payment_method VARCHAR(100),
  amount NUMERIC(12,2) NOT NULL,
  provider_transaction_id VARCHAR(255),
  status VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
