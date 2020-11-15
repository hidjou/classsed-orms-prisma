-- Create a custom type
CREATE TYPE "user_role_enum" AS ENUM ('user', 'admin', 'superadmin'); 

-- Create a table
CREATE TABLE "users"(
    "id" BIGSERIAL PRIMARY KEY NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "role" user_role_enum NOT NULL DEFAULT('user')
);

-- Create a table
CREATE TABLE "posts"(
    "id" BIGSERIAL PRIMARY KEY NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "body" TEXT,
    "userId" INTEGER NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "users"("id")
);

-- Create data
INSERT INTO "users" ("name", "email", "role")
VALUES('John Doe', 'john@email.com', 'admin'),
('jane Doe', 'jane@email.com', 'admin'),
('Ahmed Hadjou', 'ahmed@hadjou.com', 'user');

INSERT INTO "posts" ("title", "body", "userId")
VALUES('Hello World!!', 'Hey guys, I see a rainbow through this prisma :D', 1),
('So do I', 'It looks cooool!!!', 2),
('It does', 'Yeahhh', 1);

-- Drop schema
DROP TABLE "User"; DROP TABLE "Post"; DROP TYPE "user_role_enum";