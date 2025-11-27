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
-- Category: joogid
-- -----------------------

-- -----------------------
-- Products for Coop (store_id = 1)
-- -----------------------
INSERT INTO public.product
    (category_id, name, price, store_id, image_url)
VALUES
    (4, 'Coca Cola karb-tud karastusjook 6*0.33L', 5.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/09/5449000000965.jpg'),
    (4, 'Fentimans Pink Grapefr.Tonic Water 0.5L', 3.29, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/08/5029396000437.png'),
    (4, 'Fever Tree Tonic Water Indian 0.5L', 3.25, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/5060108450263.png'),
    (4, 'Bob Teejook mullidega 0.36L marjamaits.', 3.19, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/07/8056249561002.png'),
    (4, 'Kombucha Lemonade Ferment-tud kar.j.0.4L', 2.89, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/05/5600821267139.png'),
    (4, 'Kombucha Virsiku frement-tud kar.j.0.4L', 2.89, 1, 'https://coophaapsalu.ee/wp-content/uploads/2022/06/5600821265616.png'),
    (4, 'Bio kar.jook Kombucha ingv.-sidr.0.4L', 2.89, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/05/5600787049213.png'),
    (4, 'Bio kar.jook Kombucha ananassiga 0.4L', 2.89, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/06/5600787049008.png'),
    (4, 'Bio kar.jook Kombucha vaarikaga 0.4L', 2.89, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/06/5600787049022.png'),
    (4, 'Bio kar.jook Kombucha originaal 0.4L', 2.89, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/06/5600787049046.png'),
    (4, 'Schweppes Pink Mixer toonik 1.5L', 2.79, 1, 'https://coophaapsalu.ee/wp-content/uploads/2023/12/5000112664638.png'),
    (4, 'Fanta karb-tud karastusjook 2L apelsini', 2.79, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/5449000011312.png'),
    (4, 'Coca-Cola Zero karb-tud karastusjook.2L', 2.79, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/5449000131843.png'),
    (4, 'Schweppes toonik 1.5L', 2.79, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/5449000044679.png'),
    (4, 'Sprite karb-tud karastusj.2L sidr-laimim', 2.79, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/5449000113030.png'),
    (4, 'Coca-Cola karb-tud karastusjook.2L', 2.69, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/5449000009067.png'),
    (4, 'Fentimans Premium Indian Tonic Water0.5L', 3.29, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/08/5029396000116.png'),
    (4, 'Vinkymon Jõululimonaad 0.275L ebaküdooni', 2.49, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/12/4745010014369.png'),
    (4, 'Mountain Dew karb-tud karastusjook 1.5L', 2.35, 1, 'https://coophaapsalu.ee/wp-content/uploads/2023/09/4770477231660.jpg'),
    (4, 'Tanheiser Porter tume kali kuni 1.2%1.5L', 2.35, 1, 'https://coophaapsalu.ee/wp-content/uploads/2023/09/4750239000437.png'),
    (4, 'Tanheiser naturaalne kali kuni 0.5% 1.5L', 2.35, 1, 'https://coophaapsalu.ee/wp-content/uploads/2023/07/4750239000239.png'),
    (4, 'Shroomwell Focus State Lions Mane 0.25L', 2.29, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/05/4744173011130.png'),
    (4, 'Öun Kirisilimonaad 0.33L mahe', 2.25, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/02/4744317010203.png'),
    (4, 'Öun Õunalimonaad 0.33L mahe', 2.25, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/05/4744317010074.png'),
    (4, 'Öun Rabarberilimonaad mahe 0.33L mahe', 2.25, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/05/4744317010081.png'),
    (4, 'Fanta Zero karb.kar.jook 1.5L apelsini', 2.25, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/02/5449000138026.png'),
    (4, 'Sprite Zero karb.kar.jook1.5L sidr-laimi', 2.25, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/02/5449000110039.png'),
    (4, 'Sprite karb-tud karastusjook 1.5L', 2.25, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/5449000110718.png'),
    (4, 'Fanta karb-tud karastusjook 1.5L', 2.25, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/5449000053541.png'),
    (4, 'Coca-Cola karb-tud karastusjook.1.5L', 2.25, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/5000112620047.jpg'),
    (4, 'Coca-Cola Zero Karb-tud karastusjook1.5L', 2.25, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/5000112615050.jpg'),
    (4, 'Fuze Tea Zero Blueberry Lavender 1.5L', 2.19, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/07/5449000325259.png'),
    (4, 'Fuze Tea Zero Watermelon Mint 1.5L', 2.15, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/05/5449000223869.png'),
    (4, 'Öun Rabarber-lavendel fun.jook0.25L mahe', 2.15, 1, 'https://coophaapsalu.ee/wp-content/uploads/2022/11/4744317010531-1.png'),
    (4, 'Öun Sidrunmeliss C-vit.0.25L mahe', 2.15, 1, 'https://coophaapsalu.ee/wp-content/uploads/2022/03/4744317010180.png'),
    (4, 'Fuze Tea Green Tea Citrus 1.5L', 2.15, 1, 'https://coophaapsalu.ee/wp-content/uploads/2022/02/5000112651843.png'),
    (4, 'Öun Must sõstar-kadakas 0.25L mahe', 2.15, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/05/4744317010166.png'),
    (4, 'Öun Ingver-tshilli karb-tud j.0.25L mahe', 2.15, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/05/4744317010159.png'),
    (4, 'Fuze Tea Lemon Lemongrass 1.5L', 2.15, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/5449000235954.png'),
    (4, 'Fuze Tea Peach Hibiscus 1.5L', 2.15, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/5449000236630.jpg'),
    (4, 'Pepsi Cola karb-tud karastusjook 1.5L', 2.15, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4750042304845.jpg'),
    (4, 'Pepsi Max karb-tud karastusjook 1.5L', 2.15, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4750042304869.jpg'),
    (4, 'Hartwall Orig.Jaffa 1.5Lapelsin', 2.09, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/6413600002994.png'),
    (4, 'A.Le Coq Kali Klassikaline kuni 0.5% 2L', 2.05, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740098071976.jpg'),
    (4, 'Schweppes Pink Mixer toonik 1L', 1.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/04/5000112664621.png'),
    (4, 'Schweppes Tonic Water 1L', 1.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/04/5449000044808.png'),
    (4, 'Nestea Peach Zero jäätee 1.5L virsiku', 1.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2023/10/5998821510868.png'),
    (4, 'Nestea Peach jäätee 1.5L virsikumaits.', 1.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/03/5900334003423.png'),
    (4, 'Nestea Roh.teejook 1.5L tsitrusemaits.', 1.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/07/5900334003461.png'),
    (4, 'Nestea Lemon jäätee 1.5L sidrunimaits.', 1.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/07/5900334003447.png'),
    (4, 'Smith&Williams Rose Lemonade 1.5L', 1.95, 1, 'https://coophaapsalu.ee/wp-content/uploads/2023/03/4751017122051.png'),
    (4, 'Smith&Williams Red Mixer 1.5L', 1.95, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/09/4740158009543.png'),
    (4, 'Smith&Williams Tonic Water 1.5L pet', 1.95, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/09/4740158009529.png'),
    (4, 'Sprite karb-tud karastusjook 1L', 1.85, 1, 'https://coophaapsalu.ee/wp-content/uploads/2022/04/5000112651928.png'),
    (4, 'Fanta karb-tud karastusjook 1L', 1.85, 1, 'https://coophaapsalu.ee/wp-content/uploads/2022/04/5000112651676.png'),
    (4, 'Coca-Cola Zero karb-tud karastusjook.1L', 1.85, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/10/5449000133328.png'),
    (4, 'Coca-Cola karb-tud karastusjook.1L', 1.85, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/10/5449000054227.jpg'),
    (4, 'Karl Friedrich Kali Kirss 1.5L pet', 1.69, 1, 'https://coophaapsalu.ee/wp-content/uploads/2025/04/4740019002973.png'),
    (4, 'Karl Friedrich Kali 1.5L', 1.69, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740019015713.png'),
    (4, 'Orn Craft Red Mixer toonik 1L pet', 1.65, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/01/4740098002031.png'),
    (4, 'Orn Craft Elderblossom Toonik 1L pet', 1.65, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/01/4740098094920.png'),
    (4, 'A.Le Coq Toonik Greibi karb-tud j.1.5L', 1.65, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740098016106.jpg'),
    (4, 'Orn Craft Rose Tonic Lemonade 1L pet', 1.59, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/06/4740098092025.png'),
    (4, 'Orn Craft Indian Tonic water 1L pet', 1.59, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/06/4740098092049.png'),
    (4, 'Kelluke Karb-tud kar.jook Vaarika 1.5L', 1.55, 1, 'https://coophaapsalu.ee/wp-content/uploads/2025/03/4740051001507.png'),
    (4, 'Traditsiooniline Null 1.5L pet', 1.55, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/03/4740098002260.png'),
    (4, 'Kelluke Karb-tud kar.jook Ploomi 1.5L', 1.55, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/03/4740098094890.png'),
    (4, 'Sangaste Kali karb-tud kääri-ta jook1.5L', 1.55, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/09/4740077011283.jpg'),
    (4, 'A.Le Coq Päikese Limonaad D-vitam.1.5L', 1.49, 1, 'https://coophaapsalu.ee/wp-content/uploads/2023/03/4740098001584.png'),
    (4, 'Barbaris karb-tud karastusjook 1.5L', 1.49, 1, 'https://coophaapsalu.ee/wp-content/uploads/2022/02/4740098098126.png'),
    (4, 'Valge Klaar karastusjook 1.5L', 1.49, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740098072171.png'),
    (4, 'A.Le Coq Kl.Kali kuni 0.5% 1L käärit.', 1.49, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740098090014.png'),
    (4, 'A.Le Coq Gas-tud Tume Kali kuni 0.5% 1L', 1.49, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740098090021.png'),
    (4, 'Kelluke karb-tud karastusjook 1.5L sidr', 1.49, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740098016342.jpg'),
    (4, 'A.Le Coq Traditsiooniline Limonaad 1.5L', 1.49, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740098016014.jpg'),
    (4, 'Heavenly passioni-mango karb-tud j.0.33L', 1.45, 1, 'https://coophaapsalu.ee/wp-content/uploads/2025/04/4744433010156.png'),
    (4, 'Heavenly maasika karb-tud jook 0.33L', 1.45, 1, 'https://coophaapsalu.ee/wp-content/uploads/2025/03/4744433010132.png'),
    (4, 'S.Pellegrino Melograno&Arancia 0.33L', 1.45, 1, 'https://coophaapsalu.ee/wp-content/uploads/2025/03/8002270576850.png'),
    (4, 'S.Pellegrino Aranciata karb-tud j.0.33L', 1.45, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/07/8002270826887.png'),
    (4, 'S.Pellegrino Limonata karb-tud jook0.33L', 1.45, 1, 'https://coophaapsalu.ee/wp-content/uploads/2024/07/8002270586859.png')
ON CONFLICT DO NOTHING;
