create table if not exists "users" (
    "id" serial primary key,
    "name" varchar(64) not null unique,
    "contact_email" varchar(64) not null unique,
    "contact_name" varchar(64) not null,
    "hash_iterations" integer not null default 0,
    "password" varchar(255) not null,
    "role" text check ("role" in ('user', 'admin')) not null,
    "salt" varchar(255) not null,
    "active" boolean not null default false,
    "form_response" json,
    "bio" varchar(1024),
    "profile_pic" bytea,
    "created_at" timestamptz not null default CURRENT_TIMESTAMP,
    "updated_at" timestamptz not null default CURRENT_TIMESTAMP
);

create table if not exists "teams" (
    "id" serial primary key,
    "name" varchar(64) not null unique,
    "is_eligible" boolean not null,
    "is_paid" boolean not null,
    "is_closed" boolean not null,
    "team_captain_id" integer,
    "created_at" timestamptz not null default CURRENT_TIMESTAMP,
    "updated_at" timestamptz not null default CURRENT_TIMESTAMP
);

alter table "teams" add constraint "teams_name_unique" unique ("name");
alter table "teams" add constraint "teams_users_foreign" foreign key ("team_captain_id") references "users" ("id");

create table if not exists "teams_users" (
    "id" serial primary key,
    "user_id" integer not null unique,
    "team_id" integer not null,
    "created_at" timestamptz not null default CURRENT_TIMESTAMP,
    "updated_at" timestamptz not null default CURRENT_TIMESTAMP
);

alter table "teams_users" add constraint "teams_users_teams_foreign" foreign key ("team_id") references "teams" ("id");
alter table "teams_users" add constraint "teams_users_users_foreign" foreign key ("user_id") references "users" ("id");
comment on column "teams_users"."user_id" is 'The user that is on the team';
comment on column "teams_users"."team_id" is 'The team that the user is on';

create table if not exists "submissions" (
    "id" serial primary key,
    "team_id" integer not null,
    "version" integer not null,
    "data" bytea not null,
    "lang" text check("lang" in ('cs', 'cpp', 'java', 'js', 'py', 'lua', 'Human')) not null,
    "status" text check ("status" in ('queued', 'building', 'finished', 'failed')) not null,
    "submission_url" varchar(255),
    "log_url" varchar(255),
    "image_name" varchar(255),
    "created_at" timestamptz not null default CURRENT_TIMESTAMP,
    "updated_at" timestamptz not null default CURRENT_TIMESTAMP
);

comment on column "submissions"."image_name" is 'The docker image of the submission contained on the Arena Docker Registry';
alter table "submissions" add constraint "submissions_team_id_foreign" foreign key ("team_id") references "teams" ("id");
alter table "submissions" add constraint "submissions_team_id_version_unique" unique ("team_id", "version");

create table if not exists "games" (
    "id" serial primary key,
    "status" text check ("status" in ('queued', 'playing', 'finished', 'failed')) not null,
    "win_reason" varchar(255),
    "lose_reason" varchar(255),
    "winner_id" integer,
    "log_url" varchar(255),
    "created_at" timestamptz not null default CURRENT_TIMESTAMP,
    "updated_at" timestamptz not null default CURRENT_TIMESTAMP
);

comment on column "games"."winner_id" is 'The id of the winning submission';
comment on column "games"."log_url" is 'Link to the game log.';
alter table "games" add constraint "games_winner_id_foreign" foreign key ("winner_id") references "submissions" ("id");

create table if not exists "games_submissions" (
    "id" serial primary key,
    "submission_id" integer not null,
    "game_id" integer not null,
    "output_url" varchar(255),
    "created_at" timestamptz not null default CURRENT_TIMESTAMP,
    "updated_at" timestamptz not null default CURRENT_TIMESTAMP
);

comment on column "games_submissions"."submission_id" is 'The submission that is a player in the linked game.';
comment on column "games_submissions"."game_id" is 'The game that is/was played by the linked player.';
comment on column "games_submissions"."output_url" is 'Link to the output generated by the linked submission.';
alter table "games_submissions" add constraint "games_submissions_submission_id_foreign" foreign key ("submission_id") references "submissions" ("id");
alter table "games_submissions" add constraint "games_submissions_game_id_foreign" foreign key ("game_id") references "games" ("id");

create table if not exists "invites" (
    "id" serial primary key,
    "team_id" integer not null,
    "user_id" integer not null,
    "is_completed" boolean not null default false,
    "created_at" timestamptz not null default CURRENT_TIMESTAMP,
    "updated_at" timestamptz not null default CURRENT_TIMESTAMP
);

alter table "invites" add constraint "invites_teams_foreign" foreign key ("team_id") references "teams" ("id");
alter table "invites" add constraint "invites_users_foreign" foreign key ("user_id") references "users" ("id");
comment on column "invites"."user_id" is 'The user that is on the team';
comment on column "invites"."team_id" is 'The team that the user is on';

create table if not exists "submissions_metadata" (
    "id" serial primary key,
    "submission_id" integer not null,
    "label" varchar(64),
    "label_color" varchar(64),
    "created_at" timestamptz not null default CURRENT_TIMESTAMP,
    "updated_at" timestamptz not null default CURRENT_TIMESTAMP
);

alter table "submissions_metadata" add constraint "submissions_metadata_submissions" foreign key ("submission_id") references "submissions" ("id");