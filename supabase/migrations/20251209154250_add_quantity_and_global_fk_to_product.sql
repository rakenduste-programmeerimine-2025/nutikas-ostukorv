-- Add foreign key and index for global_product_id now that the column exists on product
alter table "public"."product" add constraint "product_global_product_id_fkey" FOREIGN KEY ("global_product_id") REFERENCES public.global_product(id)
not valid;

alter table "public"."product" validate constraint "product_global_product_id_fkey";

-- Optional index to speed up lookups by global_product_id
create index if not exists product_global_product_id_idx
  on public.product using btree (global_product_id);
