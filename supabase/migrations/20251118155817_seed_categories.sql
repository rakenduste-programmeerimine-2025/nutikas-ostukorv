INSERT INTO public.category
    (name, slug)
VALUES
    ('piimatooted', 'piimatooted'),
    ('koogiviljad', 'koogiviljad'),
    ('lihatooted', 'lihatooted'),
    ('joogid', 'joogid'),
    ('kulmutatud', 'kulmutatud'),
    ('pagaritooted', 'pagaritooted'),
    ('maiustused', 'maiustused'),
    ('puuviljad', 'puuviljad'),
    ('maitseained', 'maitseained'),
    ('snakid', 'snakid'),
    ('kuivained', 'kuivained'),
    ('kastmed', 'kastmed'),
    ('muu', 'muu')
ON CONFLICT
(slug) DO NOTHING;
