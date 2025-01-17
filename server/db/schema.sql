/*
 * outside weather app
 * Copyright (C) 2024-2025  MAINTAINERS
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

-- TABLE public.client_sessions --

CREATE TABLE public.client_sessions (
    id character varying(255) NOT NULL,
    "createdAt" timestamp(6) with time zone NOT NULL,
    "updatedAt" timestamp(6) with time zone NOT NULL,
    data json NOT NULL
);


-- TABLE public.user_sessions --

CREATE TABLE IF NOT EXISTS public.user_sessions (
    id bigint NOT NULL,
    "createdAt" timestamp(6) with time zone NOT NULL,
    "updatedAt" timestamp(6) with time zone NOT NULL,
    "userID" bigint,
    token character varying(255),
    "tokenExpiresAt" timestamp with time zone,
    "tokenScopes" character varying(255)[]
);

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_id_unique PRIMARY KEY (id);

CREATE SEQUENCE IF NOT EXISTS public.user_sessions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.user_sessions_id_seq OWNED BY public.user_sessions.id;

ALTER TABLE ONLY public.user_sessions ALTER COLUMN id SET DEFAULT nextval('public.user_sessions_id_seq'::regclass);


-- TABLE public.user_settings --

CREATE TABLE IF NOT EXISTS public.user_settings (
    "userID" bigint NOT NULL,
    "createdAt" timestamp(6) with time zone NOT NULL,
    "updatedAt" timestamp(6) with time zone NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255) NOT NULL
);

ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT user_settings_pkey PRIMARY KEY ("userID");


-- TABLE public.users -- 

CREATE TABLE IF NOT EXISTS public.users (
    id bigint NOT NULL,
    "createdAt" timestamp(6) with time zone NOT NULL,
    "updatedAt" timestamp(6) with time zone NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    "isVerified" boolean DEFAULT false,
    scopes character varying(255)[]
);

CREATE SEQUENCE IF NOT EXISTS public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO outside;

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_id_unique PRIMARY KEY (id);


-- FOREIGN KEYS --

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT "user_sessions_userID_fkey" FOREIGN KEY ("userID") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT "user_settings_userID_fkey" FOREIGN KEY ("userID") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;
