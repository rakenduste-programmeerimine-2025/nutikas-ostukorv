INSERT INTO public.category
    (name)
VALUES
    ('piimatooted'),
    ('koogiviljad'),
    ('lihatooted'),
    ('joogid'),
    ('kulmutatud'),
    ('pagaritooted'),
    ('maiustused'),
    ('puuviljad'),
    ('maitseained'),
    ('snakid'),
    ('kuivained'),
    ('kastmed'),
    ('muu')
ON CONFLICT
(name) DO NOTHING;
