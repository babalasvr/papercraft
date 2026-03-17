-- Tabela de orders para o checkout customizado
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  cpf TEXT NOT NULL,
  phone TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'pix',
  transaction_id TEXT,
  external_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  -- UTM tracking
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  -- Meta tracking
  meta_event_id TEXT,
  fbc TEXT,
  fbp TEXT,
  client_ip TEXT,
  client_user_agent TEXT,
  -- Order data
  order_bumps JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX idx_orders_external_id ON orders(external_id);
CREATE INDEX idx_orders_transaction_id ON orders(transaction_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_email ON orders(email);
