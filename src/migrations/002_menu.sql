create table public.menus (
  id serial not null,
  name text,
  description text,
  price numeric,
  discount numeric,
  image_url text,
  category text,
  is_available boolean,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  primary key (id)
);

alter table public.menus enable row level security;