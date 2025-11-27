-- -----------------------
-- Stores
-- -----------------------
INSERT INTO public.store
    (id, name)
VALUES
    (1, 'Coop'),
    (2, 'Rimi'),
    (3, 'Selver')
ON CONFLICT (id) DO NOTHING;

-- -----------------------
-- Category: puuviljad
-- -----------------------

-- -----------------------
-- Products for Coop (store_id = 1)
-- -----------------------
INSERT INTO public.product
    (category_id, name, price, store_id, image_url)
VALUES
    (8, 'Ananass kg Costa Rica', 2.79, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23008312.jpg'),
    (8, 'Apels.Navelina kg I klass Kreeka', 2.59, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23009551.jpg'),
    (8, 'Arbuus kg Brasiilia', 1.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23015007.jpg'),
    (8, 'Avokaado Hass võrgus 700g Keenia', 2.89, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/03/4740660019566.png'),
    (8, 'Avokaado kg Iisrael', 4.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23008532.jpg'),
    (8, 'Avokaado söömisvalmis 2tk Kolumbia', 1.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4779028871911.png'),
    (8, 'Banaan kg Kolumbia', 1.35, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23009550-300x300.jpg'),
    (8, 'Dattel kuivatatud 200g Tuneesia', 0.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740199000271.jpg'),
    (8, 'Füüsal e kirss-ananass 100g Kolumbia', 2.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2023/05/4740660019481.png'),
    (8, 'Granaatõun kg Türgi', 2.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23008331.jpg'),
    (8, 'H.viinam.Sugar Grisp 500g I kl Brasiilia', 3.39, 1, 'https://coophaapsalu.ee/wp-content/uploads/2023/05/4740660018330.png'),
    (8, 'H/viinam.Ivory seedl.kg I kl Peruu', 6.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23009554.jpg'),
    (8, 'Hurmaa 1kg Hispaania', 2.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/11/4740669006222.jpg'),
    (8, 'Hurmaa kg Hispaania', 3.59, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/10/23015013.jpg'),
    (8, 'Kiivi 1kg korvis I klass Kreeka', 3.69, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740669014029.jpg'),
    (8, 'Kiivi kg lahtine I klass Kreeka', 3.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23008311.jpg'),
    (8, 'Kiivi kollane 500g I klass Kreeka', 2.29, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/05/4740608050149.jpg'),
    (8, 'Kiivi söömisvalmis 350g I klass Kreeka', 2.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/06/4740660021262.png'),
    (8, 'Klementiin 1kg võrgus I klass Kreeka', 2.49, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/10/4740660008645.png'),
    (8, 'Klementiin kg I klass Kreeka/Itaalia', 2.89, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/05/2300951198855.jpg'),
    (8, 'Kookospähkel kg Tsiili', 2.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/10/23015017.jpg'),
    (8, 'Kultuurjõhvikad 200g Läti', 2.69, 1, 'https://coophaapsalu.ee/wp-content/uploads/2022/11/4740576001761.jpg'),
    (8, 'Kultuurmustikad 125g V.Viljad Peruu', 1.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2023/05/4740660017593.png'),
    (8, 'Laim kg I klass Brasiilia', 4.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23008347.jpg'),
    (8, 'Maasikad 250g I klass Egiptus', 4.59, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/11/4740199000196.jpg'),
    (8, 'Mango söömisvalmis 2tk Brasiilia', 2.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/8718963042167.jpg'),
    (8, 'Mango söömisvalmis kg Brasiilia', 3.79, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/09/23036925.jpg'),
    (8, 'Melon kollane kg Brasiilia', 1.79, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23008321.jpg'),
    (8, 'Melon Piel de Sapo kg Brasiilia', 1.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/10/23018574.jpg'),
    (8, 'Õun Golden Del.kg II klass Itaalia', 2.79, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23008322.jpg'),
    (8, 'Õun Granny Smith kg II klass Itaalia', 2.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/09/23015038.jpg'),
    (8, 'Õun Idared kg II klass Poola', 0.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23009555.jpg'),
    (8, 'Õun Jonagored/Jonagold kg II klass Poola', 1.89, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23015037.jpg'),
    (8, 'Õun Kanzi kg II klass Itaalia', 3.79, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/10/23009652.jpg'),
    (8, 'Õun Royal Gala kg II klass Poola', 1.79, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/09/23009122.jpg'),
    (8, 'Pirn Comice kg I klass Belgia', 2.79, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/09/23015057.jpg'),
    (8, 'Pirn Conference kg I klass Belgia', 1.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23015041.jpg'),
    (8, 'Pirn Lucas kg I klass Belgia', 1.89, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/10/23015028.jpg'),
    (8, 'Ploom tume kg Moldova', 1.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23009571.jpg'),
    (8, 'Pohlasalat 350g ämbris Eesti', 3.19, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/11/4742063000769.jpg')
ON CONFLICT DO NOTHING;
