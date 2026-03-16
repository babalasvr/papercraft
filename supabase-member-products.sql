-- Tabela para rastrear quais produtos de upsell/orderbump cada lead possui
-- Execute este SQL no Supabase SQL Editor

CREATE TABLE IF NOT EXISTS member_products (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  product_id TEXT NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),

  -- Impede duplicatas
  UNIQUE(email, product_id)
);

-- Índice para busca rápida por email
CREATE INDEX IF NOT EXISTS idx_member_products_email ON member_products(email);

-- Produtos válidos: pack-eva, metodo-lucrar, calculadora-precificacao, pack-animais, kit-impressao
-- O webhook da Cakto deve inserir nessa tabela quando o pagamento for confirmado
