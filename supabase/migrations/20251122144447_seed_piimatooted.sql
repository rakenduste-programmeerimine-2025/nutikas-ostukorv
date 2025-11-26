-- -----------------------
-- Stores
-- -----------------------
INSERT INTO public.store
    (id, name)
VALUES
    (1, 'Coop'),
    (2, 'Rimi'),
    (3, 'Selver')
ON CONFLICT
(id) DO NOTHING;

-- -----------------------
-- Category: piimatooted
-- -----------------------