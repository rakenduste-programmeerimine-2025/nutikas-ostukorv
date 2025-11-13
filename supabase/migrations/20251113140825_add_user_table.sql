create sequence "public"."user_user_id_seq";


  create table "public"."user" (
    "user_id" bigint not null default nextval('public.user_user_id_seq'::regclass),
    "username" character varying(100) not null,
    "email" character varying(200) not null,
    "password_hash" character varying(500) not null,
    "created_at" timestamp with time zone not null default now(),
    "last_login" timestamp with time zone
      );


alter table "public"."user" enable row level security;

alter sequence "public"."user_user_id_seq" owned by "public"."user"."user_id";

CREATE UNIQUE INDEX user_email_key ON public."user" USING btree (email);

CREATE UNIQUE INDEX user_pkey ON public."user" USING btree (user_id);

alter table "public"."user" add constraint "user_pkey" PRIMARY KEY using index "user_pkey";

alter table "public"."user" add constraint "user_email_key" UNIQUE using index "user_email_key";

grant delete on table "public"."user" to "anon";

grant insert on table "public"."user" to "anon";

grant references on table "public"."user" to "anon";

grant select on table "public"."user" to "anon";

grant trigger on table "public"."user" to "anon";

grant truncate on table "public"."user" to "anon";

grant update on table "public"."user" to "anon";

grant delete on table "public"."user" to "authenticated";

grant insert on table "public"."user" to "authenticated";

grant references on table "public"."user" to "authenticated";

grant select on table "public"."user" to "authenticated";

grant trigger on table "public"."user" to "authenticated";

grant truncate on table "public"."user" to "authenticated";

grant update on table "public"."user" to "authenticated";

grant delete on table "public"."user" to "service_role";

grant insert on table "public"."user" to "service_role";

grant references on table "public"."user" to "service_role";

grant select on table "public"."user" to "service_role";

grant trigger on table "public"."user" to "service_role";

grant truncate on table "public"."user" to "service_role";

grant update on table "public"."user" to "service_role";


