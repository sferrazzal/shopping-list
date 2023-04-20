-- public.items definition

-- Drop table

-- DROP TABLE public.items;

CREATE TABLE public.items (
	id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
	"name" varchar(80) NOT NULL,
	CONSTRAINT items_pkey PRIMARY KEY (id),
	CONSTRAINT no_duplicate_item_names UNIQUE (name)
);


-- public.lists definition

-- Drop table

-- DROP TABLE public.lists;

CREATE TABLE public.lists (
	id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
	title varchar(120) NOT NULL DEFAULT 'New List'::character varying,
	created_at timestamp NOT NULL DEFAULT now(),
	CONSTRAINT lists_pkey PRIMARY KEY (id)
);


-- public.recipes definition

-- Drop table

-- DROP TABLE public.recipes;

CREATE TABLE public.recipes (
	id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
	title varchar(140) NULL,
	CONSTRAINT recipes_id_key UNIQUE (id)
);


-- public.items_tags definition

-- Drop table

-- DROP TABLE public.items_tags;

CREATE TABLE public.items_tags (
	item_id int8 NOT NULL,
	tag_text varchar(40) NOT NULL,
	CONSTRAINT items_tags_pkey PRIMARY KEY (item_id, tag_text),
	CONSTRAINT fk_item_id FOREIGN KEY (item_id) REFERENCES public.items(id) ON DELETE CASCADE
);


-- public.lists_items definition

-- Drop table

-- DROP TABLE public.lists_items;

CREATE TABLE public.lists_items (
	list_id int8 NOT NULL,
	item_id int8 NOT NULL,
	quantity int4 NOT NULL,
	CONSTRAINT lists_items_pkey PRIMARY KEY (list_id, item_id),
	CONSTRAINT fk_item FOREIGN KEY (item_id) REFERENCES public.items(id) ON DELETE CASCADE,
	CONSTRAINT fk_list FOREIGN KEY (list_id) REFERENCES public.lists(id) ON DELETE CASCADE
);


-- public.lists_recipes definition

-- Drop table

-- DROP TABLE public.lists_recipes;

CREATE TABLE public.lists_recipes (
	list_id int8 NOT NULL,
	recipe_id int8 NOT NULL,
	CONSTRAINT lists_recipes_pkey PRIMARY KEY (list_id, recipe_id),
	CONSTRAINT fk_list_id FOREIGN KEY (list_id) REFERENCES public.lists(id),
	CONSTRAINT fk_recipe_id FOREIGN KEY (recipe_id) REFERENCES public.recipes(id)
);


-- public.recipes_items definition

-- Drop table

-- DROP TABLE public.recipes_items;

CREATE TABLE public.recipes_items (
	recipe_id int8 NOT NULL,
	item_id int8 NOT NULL,
	quantity int4 NOT NULL,
	CONSTRAINT recipes_items_pkey PRIMARY KEY (recipe_id, item_id),
	CONSTRAINT fk_item FOREIGN KEY (item_id) REFERENCES public.items(id),
	CONSTRAINT fk_recipe FOREIGN KEY (recipe_id) REFERENCES public.recipes(id)
);