alter table "public"."product" add column "category_id" uuid;

alter table "public"."product" add column "store_id" bigint;

alter table "public"."product" add constraint "product_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.category(id) not valid;

alter table "public"."product" validate constraint "product_category_id_fkey";

alter table "public"."product" add constraint "product_store_id_fkey" FOREIGN KEY (store_id) REFERENCES public.store(id) not valid;

alter table "public"."product" validate constraint "product_store_id_fkey";


