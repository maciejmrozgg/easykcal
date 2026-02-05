--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0
-- Dumped by pg_dump version 16.0

-- Started on 2026-01-28 21:22:38

CREATE TYPE public.user_role AS ENUM (
    'user',
    'admin'
);

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 17156)
-- Name: monthly_schedules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.monthly_schedules (
    id integer NOT NULL,
    user_id integer NOT NULL,
    year integer NOT NULL,
    month integer NOT NULL,
    kcal_limit integer DEFAULT 1500,
    meals jsonb NOT NULL,
    days jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    zero_kcal_limit integer DEFAULT 1500 NOT NULL
);

CREATE SEQUENCE public.monthly_schedules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.monthly_schedules_id_seq OWNED BY public.monthly_schedules.id;

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    kcal_per_100g numeric NOT NULL
);

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;

CREATE TABLE public.recipes (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ingredients jsonb DEFAULT '[]'::jsonb NOT NULL,
    instructions jsonb DEFAULT '[]'::jsonb NOT NULL,
    image_name text,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.recipes ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.recipes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    role public.user_role DEFAULT 'user'::public.user_role
);

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4667 (class 2604 OID 17159)
-- Name: monthly_schedules id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monthly_schedules ALTER COLUMN id SET DEFAULT nextval('public.monthly_schedules_id_seq'::regclass);


--
-- TOC entry 4657 (class 2604 OID 17080)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 4658 (class 2604 OID 17103)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4685 (class 2606 OID 17166)
-- Name: monthly_schedules monthly_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monthly_schedules
    ADD CONSTRAINT monthly_schedules_pkey PRIMARY KEY (id);


--
-- TOC entry 4687 (class 2606 OID 17168)
-- Name: monthly_schedules monthly_schedules_user_id_year_month_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monthly_schedules
    ADD CONSTRAINT monthly_schedules_user_id_year_month_key UNIQUE (user_id, year, month);


--
-- TOC entry 4673 (class 2606 OID 17084)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4681 (class 2606 OID 17129)
-- Name: recipes recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_pkey PRIMARY KEY (id);


--
-- TOC entry 4677 (class 2606 OID 17110)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4679 (class 2606 OID 17108)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4688 (class 2606 OID 17130)
-- Name: recipes fk_recipes_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT fk_recipes_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4691 (class 2606 OID 17169)
-- Name: monthly_schedules monthly_schedules_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monthly_schedules
    ADD CONSTRAINT monthly_schedules_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2026-01-28 21:22:39

--
-- PostgreSQL database dump complete
--

