-- Adiciona coluna de produtos comprados na tabela members existente
-- Execute no Supabase SQL Editor

ALTER TABLE members
  ADD COLUMN IF NOT EXISTS purchased_products TEXT[] DEFAULT '{}';

-- Índice para busca por produtos
CREATE INDEX IF NOT EXISTS idx_members_purchased_products
  ON members USING gin(purchased_products);

-- Função para adicionar produto sem duplicatas (chamada pelo webhook)
CREATE OR REPLACE FUNCTION append_purchased_product(p_email TEXT, p_product TEXT)
RETURNS void
LANGUAGE sql
AS $$
  UPDATE members
  SET purchased_products = array_append(purchased_products, p_product)
  WHERE email = lower(p_email)
    AND NOT (purchased_products @> ARRAY[p_product]);
$$;
