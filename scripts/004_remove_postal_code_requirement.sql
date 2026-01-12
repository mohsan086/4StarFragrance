-- Make postal_code optional in orders table
ALTER TABLE public.orders ALTER COLUMN shipping_postal_code DROP NOT NULL;
