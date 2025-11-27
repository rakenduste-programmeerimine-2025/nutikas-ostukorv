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
-- -----------------------
-- Products for Coop (store_id = 1)
-- -----------------------
INSERT INTO public.product
    (category_id, name, price, store_id, image_url)
VALUES
    (1, 'Airan gas-itud hapup.jook 500g pudel', 1.39, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/05/4742749000021.jpg'),
    (1, 'Alma piim 2.5% 0.5L purepakk', 0.79, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740125120042.jpg'),
    (1, 'Alma piim 2.5% 1.5L purepakk', 1.55, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740125120059.jpg'),
    (1, 'Alma täispiim 3.8-4.2% 1.5L purepakk', 2.15, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/05/4740125120226.png'),
    (1, 'Farmi hapendatud pett 1kg pure', 1.29, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740113092306.png'),
    (1, 'Farmi hapendatud täispiim 3.6-4.2% 1kg', 1.89, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740113090470.jpg'),
    (1, 'Farmi keefir 2.5% 1kg kilepakk', 0.85, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740123000933.jpg'),
    (1, 'Farmi keefir klassikal 2.5% 1kg pure', 1.59, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/05/4740113091477.png'),
    (1, 'Farmi keefir täispiimast 3.6-4.2% 1kg', 1.65, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740113091002.png'),
    (1, 'Farmi piim 2.5% 1.5L pure', 1.69, 1, 'https://coophaapsalu.ee/wp-content/uploads/2025/09/4740113097578.png'),
    (1, 'Farmi piim 2.5% 1L kilepakk', 0.62, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740123000872.jpg'),
    (1, 'Farmi Rjazenka 400g tops', 0.89, 1, 'https://coophaapsalu.ee/wp-content/uploads/2025/07/4740113097431.png'),
    (1, 'Farmi täispiim 3.6-4.2% 2L pure', 2.29, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740113091514.jpg'),
    (1, 'Farmi täispiim 3.6%-4.2% 1L pure', 1.69, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740113090555.png'),
    (1, 'Hellus keefir 2.5% +D-vitamiin 1kg pure', 1.45, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740294010731.png'),
    (1, 'Hellus keefir 2.5% +D-vitamiin 400g', 0.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/09/4740036015499.png'),
    (1, 'Hellus keefir 2.5%+D-vitam 1kg lakt.vaba', 1.79, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740036014034.png'),
    (1, 'Hellus Keefirijook apelsini-porgandi 1kg', 2.19, 1, 'https://coophaapsalu.ee/wp-content/uploads/2025/07/4740036017943.png'),
    (1, 'Hellus Keefirijook maasika-vanilje 1kg', 2.19, 1, 'https://coophaapsalu.ee/wp-content/uploads/2025/07/4740036017936.png'),
    (1, 'Hellus Keefirijook vaarika-granaatõun1kg', 2.19, 1, 'https://coophaapsalu.ee/wp-content/uploads/2025/07/4740036017745.png'),
    (1, 'Mlekovita lakt.vaba UHT piim 3.2% 500ml', 1.39, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/04/5900512982502.png'),
    (1, 'MO Saaremaa hapendatud pett 1.5% 1kg', 1.29, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740153600035-1.png'),
    (1, 'MO Saaremaa Mahetäispiim 3.8-4.4% 1L Öko', 1.59, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/05/4740153600004.png'),
    (1, 'Nopri toorpiim pastöris.-ta 3.8%-4.3% 1L', 1.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/03/4740218000763.jpg'),
    (1, 'Paulig Frezza kohvijook Forte 250ml', 2.59, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/6411300654543.png'),
    (1, 'Paulig Frezza kohvijook Mint 250ml', 2.59, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/6411300654550.png'),
    (1, 'Tere Cappuccino piim 3.5% 1L', 2.15, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740036009085.jpg'),
    (1, 'Tere Deary Kaerajook 1L', 1.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/10/4740036014607.png'),
    (1, 'Tere Latte piim 2.5% 1L kõrgkuumutatud', 1.99, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740036009122-1.jpg'),
    (1, 'Tere piim 2.5% 1L D-vitam.laktoosiv.pure', 1.59, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740036014027.png'),
    (1, 'Tere piim 2.5% 1L D-vitamiiniga purepakk', 1.35, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740036000013.png'),
    (1, 'Väike Tom Kõrgkuum.piimjook ban.200ml', 0.85, 1, 'https://coophaapsalu.ee/wp-content/uploads/2022/05/4740093333307.png'),
    (1, 'Väike Tom Kõrgkuum.piimjook karamel200ml', 0.85, 1, 'https://coophaapsalu.ee/wp-content/uploads/2025/10/4740093007154.png'),
    (1, 'Väike Tom Kõrgkuum.piimjook maasika200ml', 0.85, 1, 'https://coophaapsalu.ee/wp-content/uploads/2022/05/4740093333314.png'),
    (1, 'Väike Tom Kõrgkuum.piimjook shok.200ml', 0.85, 1, 'https://coophaapsalu.ee/wp-content/uploads/2022/09/4740093333321.png'),
    (1, 'Valio Eila piimajook1.5% 1L laktoosivaba', 2.65, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/6408432086540.png'),
    (1, 'Valio Gefilus keefir 2.5% 1kg purepakk', 1.55, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740125321043.jpg'),
    (1, 'Valio Gefilus keefir jääkohvi 300g', 1.15, 1, 'https://coophaapsalu.ee/wp-content/uploads/2023/03/4740125383119.png'),
    (1, 'Valio Gefilus keefir kama 300g', 1.15, 1, 'https://coophaapsalu.ee/wp-content/uploads/2020/04/4740125383041.png'),
    (1, 'Valio Gefilus keefir mustika 300g', 1.15, 1, 'https://coophaapsalu.ee/wp-content/uploads/2021/05/4740125383034.png')
ON CONFLICT DO NOTHING;