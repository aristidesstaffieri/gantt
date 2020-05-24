SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF-8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;


-- still need to create user and grant privileges
CREATE SCHEMA IF NOT EXISTS gantt;
SHOW search_path;

-- CREATE EXTENSION citext;

CREATE EXTENSION pgcrypto;

-- Orgs
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL,
    password text,
    org_id UUID NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    token text
);

ALTER TABLE ONLY users
ADD CONSTRAINT users_email_unq UNIQUE (email);

ALTER TABLE ONLY users
ADD CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY users
ADD CONSTRAINT org_id_key FOREIGN KEY (org_id) REFERENCES organizations (id);

-- Teams
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  org_id UUID NOT NULL,
  users UUID[],
  roles UUID[]
);

ALTER TABLE ONLY teams
ADD CONSTRAINT org_id_key FOREIGN KEY (org_id) REFERENCES organizations (id);

-- Sessions
CREATE TABLE "session" (
  sid varchar NOT NULL COLLATE "default",
	sess json NOT NULL,
	expire timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- Projects
CREATE TABLE "projects" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  creator_id UUID NOT NULL,
  created_at timestamp without time zone DEFAULT now() NOT NULL,
  updated_at timestamp without time zone DEFAULT now() NOT NULL,
  gantt jsonb
);
