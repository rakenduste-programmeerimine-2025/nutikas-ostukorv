create table category
(
    id uuid primary key default uuid_generate_v4(),
    name text unique not null

);
