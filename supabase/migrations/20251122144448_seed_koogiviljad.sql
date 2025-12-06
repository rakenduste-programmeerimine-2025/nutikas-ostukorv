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
-- Category: koogiviljad
-- -----------------------

INSERT INTO public.product
    (category_id, name, price, store_id, image_url)
VALUES
    (2, 'Ahjusegu-porg.kaps.porru.kaali700g Eesti', 2.49, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4742368001539.jpg'),
    (2, 'Aurut.riivitud peet Hüva 500g Coop Eesti', 1.19, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740660009536.jpg'),
    (2, 'Aurutatud punapeet Kadarbiku 500g Eesti', 1.69, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/05/4740175000578.jpg'),
    (2, 'Baklazaan kg Hispaania', 3.89, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/10/23016002.jpg'),
    (2, 'Bataat oranz kg Egiptus', 1.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23016060.jpg'),
    (2, 'Beebiporgand Kadarbiku 250g Eesti', 1.69, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740175000530-1.jpg'),
    (2, 'Bonzo kimchi 400g Eesti', 8.49, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/06/0753217681783.jpg'),
    (2, 'Borsisegu 500g Eesti', 2.39, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/12/4740175000264.png'),
    (2, 'Brokoli kg Itaalia', 3.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23008530.jpg'),
    (2, 'Coleslaw salat 400g Dimdini', 2.59, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/10/4751001623731.png'),
    (2, 'Guacamole 200g Hispaania', 3.69, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/06/8437021545630.png'),
    (2, 'Hapukapsas porg.-ga Hüva 1kg Coop Eesti', 1.89, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740660009598.jpg'),
    (2, 'Hapukapsas porgandiga 300g topsis Eesti', 1.49, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/03/4742368002031.png'),
    (2, 'Hapukapsas porgandiga 500g pakitud Eesti', 1.59, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740175000233.jpg'),
    (2, 'Hapukurgi salat Peipsi Kurk 250g Eesti', 1.25, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/10/4744664010048.png'),
    (2, 'Hapukurgiviilud küüslauguga 400g Eesti', 2.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/01/4742063001001.png'),
    (2, 'Hapukurk Peipsi Kurk 400g Eesti', 2.69, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4744664010017.jpg'),
    (2, 'Hapukurk Peipsi Kurk 500g ämbris Eesti', 3.59, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/05/4744664010024.jpg'),
    (2, 'Hapukurk Viibergi 400g v/p Eesti', 2.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4742063000097.png'),
    (2, 'Härmavili porgandikuubikud 300g külmut.', 1.39, 1, 'https://coophaapsalu.ee/wp-content/uploads/2025/03/4740188020174.png'),
    (2, 'Hiina kapsas kg Holland', 1.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23016020.jpg'),
    (2, 'Hiinakapsa Krimchi 400g Eesti', 9.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2023/03/4745011005632.png'),
    (2, 'Kaalikas pestud kg Eesti', 1.19, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23009575.jpg'),
    (2, 'Kartul 5kg pakitud võrkkotis Eesti', 3.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/11/4740246030008.png'),
    (2, 'Kartul Heakartul 1.5kg pakitud Eesti', 2.39, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/09/4740112000029.jpg'),
    (2, 'Kartul Heakartul 2kg pakitud Eesti', 2.59, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740112000036.jpg'),
    (2, 'Kartul kg lahtine Eesti', 0.39, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23009557.jpg'),
    (2, 'Kartul kol.pestud Talukartul 2.5kg Eesti', 3.19, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/04/4742050000109.jpg'),
    (2, 'Kartul pestud 2kg pakitud Eesti', 2.49, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/08/4740246200050.jpg'),
    (2, 'Kartul pun.pestud Talukartul 2.5kg Eesti', 2.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/04/4742050000130.jpg'),
    (2, 'Kartul punane kg lahtine Eesti', 0.59, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/09/23030276.jpg'),
    (2, 'Keedetud kikerhernes 250g Dimdini', 1.29, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/05/4751001622994.png'),
    (2, 'Keedetud mais 450g v/p India', 2.39, 1, 'https://coophaapsalu.ee/wp-content/uploads/2025/01/4745010129414.png'),
    (2, 'Keedetud oad 300g Dimdini', 1.29, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4751001623007.jpg'),
    (2, 'Kimchi 300g Eesti', 4.39, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/11/4745011020482.png'),
    (2, 'Kirss-kobartomat 500g I klass Holland', 2.89, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/09/8715817190104.jpg'),
    (2, 'Kirss-pl.tom.Kumato250g I kl Hispaania', 2.49, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/12/4740660011027.jpg'),
    (2, 'Kirss-pl.tom250g I klass Maroko', 1.29, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/8427647550040.jpg'),
    (2, 'Kirss-ploomtomat 500g I klass Maroko', 2.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2022/02/4740660011010.jpg'),
    (2, 'Kirss-ploomtomat mix 500g I kl Maroko', 3.49, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/12/4740660008027.jpg'),
    (2, 'Kirsstomat pun250g I klass Maroko', 1.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/8717202270002.jpg'),
    (2, 'Kobartomat kg I klass Belgia', 2.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23008504.jpg'),
    (2, 'Kodune hapukapsas porg.-ga 650g Viibergi', 2.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/02/4742063004743.png'),
    (2, 'Kokteil-kobartomat 500g I klass Holland', 2.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/07/4740660014899.jpg'),
    (2, 'Kol.paprika kg I klass Hispaania', 4.69, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23008509.jpg'),
    (2, 'Korea salat 380g Dimdini', 1.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/10/4751001623694.png'),
    (2, 'Koreapärane peet 300g Eesti', 3.09, 1, 'https://coophaapsalu.ee/wp-content/uploads/2025/01/4745011020468.png'),
    (2, 'Koreapärane porgand 300g Eesti', 3.09, 1, 'https://coophaapsalu.ee/wp-content/uploads/2025/01/4745011020413.png'),
    (2, 'Kurk Eesti kg kiles Grüne Fee Eesti', 4.39, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/08/23008514.png'),
    (2, 'Lehtkapsas Saaremaa 200g Eesti', 2.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2023/07/4744888010145.png'),
    (2, 'Lillkapsas kg Taani', 2.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23009572.jpg'),
    (2, 'Marin.kapsas porganditega 650g Dimdini', 1.69, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/03/4751001624301.png'),
    (2, 'Marineeritud kurk 400g Eesti', 2.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/10/4742063000981.png'),
    (2, 'Marineeritud peet riivitud 350g Dimdini', 1.09, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/04/4751001624066.png'),
    (2, 'Marineeritud punane sibul 500g Eesti', 3.39, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/07/4744749019126.png'),
    (2, 'Muskaatkõrvits kg Eesti', 1.09, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/09/23009203.jpg'),
    (2, 'Mustrõigas kg Läti', 1.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/10/23016015.jpg'),
    (2, 'Nuikapsas kg Soome', 2.79, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23016059.jpg'),
    (2, 'Paprika mix 500g Hispaania', 2.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2025/08/4740660007778.png'),
    (2, 'Paprika Red Palermo 200g Hispaania', 2.49, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/11/4740660011706.jpg'),
    (2, 'Passion 100g LAV', 3.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/05/4740199001063.png'),
    (2, 'Pastinaak kg Soome', 3.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2022/08/23009095.jpg'),
    (2, 'Peakapsa Kimchi 300g Eesti', 2.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/05/4742368002048.jpg'),
    (2, 'Peakapsas kg Eesti', 0.49, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23009501.jpg'),
    (2, 'Peakapsas varajan.kg Albaania', 2.19, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23008535.jpg'),
    (2, 'Ploomtomat 500g I klass Hispaania', 1.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/06/4740660009512.jpg'),
    (2, 'Porgand Kadarbiku 500g pakitud Eesti', 1.29, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/07/4740175000011.jpg'),
    (2, 'Porgand kg Leedu', 0.45, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23009573.jpg'),
    (2, 'Porgand mix Saaremaa 1kg Eesti', 2.19, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/10/4744888010107.png'),
    (2, 'Porgand pestud 1kg Eesti', 1.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/07/4742368001553.png'),
    (2, 'Porgand Saaremaa 500g pakitud Eesti', 1.29, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/10/4742983015003.png'),
    (2, 'Pudelkõrvits kg Portugal', 2.79, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/09/23008873.png'),
    (2, 'Pun.peedi salat majoneesiga 380g Dimdini', 1.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/10/4751001622512.png'),
    (2, 'Punane kapsas kg Eesti', 0.69, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23008512.jpg'),
    (2, 'Punane paprika kg I klass Israel/Maroko', 3.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23009574.jpg'),
    (2, 'Punane peet kg Eesti', 0.69, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/23009566.jpg'),
    (2, 'Punane tshillipipar 50g Hispaania', 1.69, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740199001070.jpg'),
    (2, 'Purustatud avokaado 200g Hispaania', 3.89, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/06/8437021545647.png'),
    (2, 'Redis 125g Holland', 0.89, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/07/4740199000110.jpg')
ON CONFLICT DO NOTHING;
