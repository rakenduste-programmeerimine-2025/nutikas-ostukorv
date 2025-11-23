-- -----------------------
-- Ensure UUID function exists
-- -----------------------
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

-- -----------------------
-- Products for Coop (store_id = 1)
-- NOW INCLUDING NAME, PRICE, STORE_ID AND IMAGE_URL (from CSV)
-- -----------------------
INSERT INTO public.product
    (category_id, name, price, store_id, image_url)
SELECT c.id, p.product_name, p.price, p.store_id, p.image_url
FROM public.category c
CROSS JOIN (
    VALUES
        ('Coop Grill-liha punases marinaadis 500g', 5.15, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/07/4740660012857.png'),
        ('Coop Grillvorst 600g', 3.89, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740660012888.jpg'),
        ('Coop Grillvorst juustuga 600g', 3.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/08/4740660012895-1.png'),
        ('Coop Klassikaline shaslõkk sealihast600g', 4.69, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740660012871.jpg'),
        ('Coop peekoni viilud grillmarinaadis 500g', 4.59, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740660012840.png'),
        ('Coop shaslõkk punases marinaadis 600g', 5.39, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740660012901.png'),
        ('Hüva Grillvorst 500g', 2.89, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/06/4740660008607.png'),
        ('Hüva Pisikesed vorstikesed juustuga 500g', 2.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740660012864.jpg'),
        ('Hüva toored grillvorstid 500g lambasool.', 3.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740660001776.jpg'),
        ('Isukas Õllepunnid juustuga 500g', 3.39, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/04/4740296003236.png'),
        ('Karni grillahjuvorstid 400g', 4.49, 1, 'https://coophaapsalu.ee/wp-content/uploads/2025/10/4740579505716.png'),
        ('Karni marinaadis ahjuribi ~1.5kg', 6.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2025/10/579772.png'),
        ('Karni P/S ahjushaslõkivorstid 500g', 4.49, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/10/4740579152552-1.png'),
        ('Karni P/S vorst Ahjukad 500g', 3.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2022/10/4740579102397-1.png'),
        ('Karni P/S vorst Ahjukad juustuga 500g', 4.49, 1, 'https://coophaapsalu.ee/wp-content/uploads/2025/10/4740579172017.png'),
        ('Linnamäe Saunavorst juustu-jalapeno 260g', 5.25, 1, 'https://coophaapsalu.ee/wp-content/uploads/2025/10/4740618008369.png'),
        ('M&M Eelküps.BBQ-suitsune tagakoot ~1.5kg', 5.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/11/23171001.png'),
        ('M&M kauaküpsenud koodiliha kondita ~1kg', 8.49, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/10/23171839.png'),
        ('M&M Kodu grillvorstid 600g', 3.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2022/04/4740171187570.png'),
        ('M&M Kooreklops 600g', 5.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740171081717.png'),
        ('M&M Maitselt mahe grillvorst juustu 600g', 5.39, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740171085159.jpg'),
        ('M&M Maitselt mahedad toorvorstikesed400g', 3.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2025/05/4740171177465.png'),
        ('M&M Rebitud kanaliha punases kastmes200g', 2.29, 1, 'https://coophaapsalu.ee/wp-content/uploads/2022/02/4740171187426.png'),
        ('M&M Rebitud sealiha BBQ kastmes200g', 2.29, 1, 'https://coophaapsalu.ee/wp-content/uploads/2022/02/4740171187471.png'),
        ('M&M Saksa praevorst 400g', 2.59, 1, 'https://coophaapsalu.ee/wp-content/uploads/2025/10/4740171189345.png'),
        ('M&M shaslõkk klassikalises marin.600g', 4.89, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/06/4740171081625.png'),
        ('Matsimoka ahjuvorst juustu sampinj.365g', 5.25, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/11/4744735011134.png'),
        ('Matsimoka ahjuvorst mozzarella tom.365g', 5.25, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/11/4744735010915.png'),
        ('Matsimoka ahjuvorst sibula-äädikaga 365g', 4.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/11/4744735010885.png'),
        ('MM Maitselt mahedad grillvorstid 900g', 6.59, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740171084114.jpg'),
        ('Nõo Jäägri grillvorstid 365g', 4.59, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/09/4740574090873-2.png'),
        ('Nõo praepeekon 430g', 6.49, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/10/4740574065055-1.png'),
        ('Oskar Ahjupadrun 500g grillvorstikesed', 4.39, 1, 'https://coophaapsalu.ee/wp-content/uploads/2025/10/4740569002430.png'),
        ('Oskar kauaküpsetatud suitsukoot ~900g', 7.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/02/23569563.png'),
        ('Oskar Tüüringeri praevorstid 480g', 4.49, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/11/4740569012132.png'),
        ('Rannarootsi Teriyaki grillribid 900g', 8.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740215800038.png'),
        ('RLK küpsetatud tagakoot ~1kg v/p', 6.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/10/23003361.png'),
        ('RLK Mustika grill-liha seakaelakarb.500g', 6.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740003006741.png'),
        ('RLK Piprane seakaelakarbonaad 500g', 7.49, 1, 'https://coophaapsalu.ee/wp-content/uploads/2025/10/4740003018003.png'),
        ('RR Ahjuvorstid röstitud küüslauguga 400g', 4.19, 1, 'https://coophaapsalu.ee/wp-content/uploads/2025/10/4740296003908.png')
) AS p(product_name, price, store_id, image_url)
WHERE c.name = 'lihatooted'
ON CONFLICT DO NOTHING;

-- -----------------------
-- TODO: Add products for Rimi (store_id = 2) and Selver (store_id = 3)
-- -----------------------

-- -----------------------
-- Enable RLS and allow public select
-- -----------------------

-- Store table
ALTER TABLE public.store ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON public.store
FOR
SELECT USING (true);

-- Product table
ALTER TABLE public.product ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON public.product
FOR
SELECT USING (true);
