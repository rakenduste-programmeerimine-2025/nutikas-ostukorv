alter table "public"."product"
add constraint "product_name_store_id_key" unique ("name", "store_id");
