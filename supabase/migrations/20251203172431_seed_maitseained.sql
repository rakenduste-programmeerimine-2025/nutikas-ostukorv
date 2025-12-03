INSERT INTO public.product
    (category_id, name, price, store_id, image_url)
VALUES
    (9, 'Suhkur, DIAMANT, 1 kg', 0.74, 3, 'https://www.selver.ee/img/450/440/resize/4/7/4770074171109.jpg'),
    (9, 'Suhkur, DAN SUKKER, 1 kg', 1.11, 3, 'https://www.selver.ee/img/450/440/resize/6/4/6414000023138.jpg'),
    (9, 'Pärm, NORDIC, 50 g', 7.2, 3, 'https://www.selver.ee/img/450/440/resize/7/3/73500384.jpg'),
    (9, 'Pruun roosuhkur, DAN SUKKER, 750 g', 3.59, 3, 'https://www.selver.ee/img/450/440/resize/4/7/4770074472077.jpg'),
    (9, 'Must terapipar, SANTA MARIA, 22 g', 45.0, 3, 'https://www.selver.ee/img/450/440/resize/6/4/6418474118086.jpg'),
    (9, 'Kuivpärm, VESKI MATI, 11 g', 42.73, 3, 'https://www.selver.ee/img/450/440/resize/4/7/4740281007508.jpg'),
    (9, 'Kaneel (jahvatatud), SANTA MARIA, 22 g', 40.45, 3, 'https://www.selver.ee/img/450/440/resize/6/4/6418474118130.jpg'),
    (9, 'Sool Ekstra, KATI, 1 kg', 0.9, 3, 'https://www.selver.ee/img/450/440/resize/4/7/4740165000427.jpg'),
    (9, 'Jäme söögisool, KATI, 1 kg', 0.9, 3, 'https://www.selver.ee/img/450/440/resize/4/7/4740165000434.jpg'),
    (9, 'Kuivpärm, NORDIC, 2x12 g', 42.08, 3, 'https://www.selver.ee/img/450/440/resize/7/3/73500377.jpg'),
    (9, 'Piparkoogimaitseaine, SANTA MARIA, 30 g', 33.0, 3, 'https://www.selver.ee/img/450/440/resize/6/4/6418474118413.jpg'),
    (9, 'Vähendatud rasvasisaldusega kakaopulber, VILMA, 150 g', 22.6, 3, 'https://www.selver.ee/img/450/440/resize/4/7/4740012030874.jpg'),
    (9, 'Kartulimaitseaine, SANTA MARIA, 30 g', 30.67, 3, 'https://www.selver.ee/img/450/440/resize/6/4/6418474118277.jpg'),
    (9, 'Sidrunimahl, SICILIA, 200 ml', 9.4, 3, 'https://www.selver.ee/img/450/440/resize/7/6/76106057.jpg'),
    (9, 'Hakklihamaitseaine, SANTA MARIA, 30 g', 30.67, 3, 'https://www.selver.ee/img/450/440/resize/6/4/6418474118352.jpg'),
    (9, 'Till, SANTA MARIA, 7 g', 131.43, 3, 'https://www.selver.ee/img/450/440/resize/6/4/6418474118123.jpg'),
    (9, 'Purustatud must pipar, SANTA MARIA, 18 g', 76.11, 3, 'https://www.selver.ee/img/450/440/resize/4/7/4740018170666.jpg'),
    (9, 'Broilerimaitseaine, SANTA MARIA, 30 g', 30.67, 3, 'https://www.selver.ee/img/450/440/resize/6/4/6418474118338.jpg'),
    (9, 'Küpsetuspulber, SANTA MARIA, 45 g', 13.11, 3, 'https://www.selver.ee/img/450/440/resize/4/7/4740018133487.jpg'),
    (9, 'Kardemon jahvatatud, MEIRA, 8 g', 112.5, 3, 'https://www.selver.ee/img/450/440/resize/6/4/6414201001812.jpg'),
    (9, 'Karri, SANTA MARIA, 25 g', 37.6, 3, 'https://www.selver.ee/img/450/440/resize/6/4/6418474118321.jpg'),
    (9, 'Nelk, SANTA MARIA, 10 g', 79.0, 3, 'https://www.selver.ee/img/450/440/resize/6/4/6418474152783.jpg'),
    (9, 'Kartulitärklis, ALOJAS, 400 g', 3.68, 3, 'https://www.selver.ee/img/450/440/resize/4/7/4750073221142.jpg'),
    (9, 'Liha üldmaitseaine, SANTA MARIA, 35 g', 28.29, 3, 'https://www.selver.ee/img/450/440/resize/6/4/6418474118291.jpg'),
ON CONFLICT (name, store_id) DO UPDATE
SET
    category_id = EXCLUDED.category_id,
    price = EXCLUDED.price,
    image_url = EXCLUDED.image_url;
