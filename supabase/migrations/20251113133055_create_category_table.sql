create table category
(
    id bigserial primary key,
    name text unique not null,
    slug text unique not null

);
