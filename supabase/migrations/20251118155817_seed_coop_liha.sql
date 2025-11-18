-- Ensure UUID function exists
CREATE EXTENSION
IF NOT EXISTS "uuid-ossp";

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
-- Category: liha
-- -----------------------
INSERT INTO public.category
    (name)
VALUES
    ('liha')
ON CONFLICT
(name) DO NOTHING;

-- -----------------------
-- Products for Coop (store_id = 1)
-- -----------------------
INSERT INTO public.product
    (category_id, name, price, store_id)
SELECT c.id, p.product_name, p.price, p.store_id
FROM public.category c
CROSS JOIN (
    VALUES
        ('Liivimaa Mahe rohumaaveise hakkliha 300g', 5.99, 1),
        ('M&M Delikatess seahakkliha 300g', 2.59, 1),
        ('M&M delikatesshakkliha 300g jahutatud', 3.99, 1),
        ('M&M kodune hakkliha 500g jahutatud', 4.29, 1),
        ('M&M kodune kotletisegu 500g', 3.69, 1),
        ('M&M seahakkliha 500g jahutatud', 3.49, 1),
        ('Matsimoka Delikatesshakkliha 300g', 2.59, 1),
        ('RLK kodune hakkliha 400g jahut.', 3.99, 1),
        ('RLK Perehakklihasegu 300g', 1.99, 1),
        ('RLK seahakkliha 400g jahutatud', 2.99, 1),
        ('Tallegg FIT br.rinnafilee hakkliha 300g', 3.65, 1)
) AS p(product_name, price, store_id)
WHERE c.name = 'liha'
ON CONFLICT DO NOTHING;
