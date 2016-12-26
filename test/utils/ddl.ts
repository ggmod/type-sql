
const BEFORE_ALL_PG = `
DROP TABLE IF EXISTS "Book";
DROP TABLE IF EXISTS "Customer";
DROP TABLE IF EXISTS "Order";
DROP SEQUENCE IF EXISTS "test_sequence";

CREATE SEQUENCE "test_sequence";

CREATE TABLE "Book" ( 
	"id" Integer DEFAULT nextval('test_sequence'::regclass) NOT NULL,
	"title" Character Varying( 2044 ) NOT NULL,
	"author" Character Varying( 2044 ),
	"price" Integer,
	"available" Boolean,
	"date" Timestamp With Time Zone,
	"data" JSON,
	PRIMARY KEY ( "id" ) 
);

CREATE TABLE "Customer" (
	"name" Character Varying( 2044 ) NOT NULL,
	"email" Character Varying( 2044 ) NOT NULL,
	"phone_number" Character Varying( 2044 ),
	PRIMARY KEY ( "name" ) 
);

CREATE TABLE "Order" (
    "bookId" Integer NOT NULL,
	"customerId" Character Varying( 2044 ) NOT NULL,
	"quantity" Integer NOT NULL,
	PRIMARY KEY ( "bookId", "customerId" ) 
);
`;

const BEFORE_ALL_MYSQL = `
DROP TABLE IF EXISTS "Book";
DROP TABLE IF EXISTS "Customer";
DROP TABLE IF EXISTS "Order";

CREATE TABLE "Book" ( 
	"id" Int( 255 ) AUTO_INCREMENT NOT NULL,
	"title" VarChar( 2044 ) NOT NULL,
	"author" VarChar( 2044 ),
	"price" Int,
	"available" BOOLEAN,
	"date" DATETIME(3),
	"data" JSON,
	PRIMARY KEY ( "id" ) 
)
AUTO_INCREMENT = 1;

CREATE TABLE "Customer" (
	"name" VarChar( 255 ) NOT NULL,
	"email" VarChar( 2044 ) NOT NULL,
	"phone_number" VarChar( 2044 ),
	PRIMARY KEY ( "name" ) 
);

CREATE TABLE "Order" (
    "bookId" Int NOT NULL,
	"customerId" VarChar( 255 ) NOT NULL,
	"quantity" Int NOT NULL,
	PRIMARY KEY ( "bookId", "customerId" ) 
);
`.replace(/"/g, '`');

const BEFORE_EACH_SHARED = `
DELETE FROM "Book";
DELETE FROM "Customer";
DELETE FROM "Order";
`;

const BEFORE_EACH_PG = BEFORE_EACH_SHARED + 'ALTER SEQUENCE "test_sequence" RESTART WITH 1;';

const BEFORE_EACH_MYSQL = BEFORE_EACH_SHARED.replace(/"/g, '`') + 'ALTER TABLE `Book` AUTO_INCREMENT = 1';

export { BEFORE_ALL_PG, BEFORE_EACH_PG, BEFORE_ALL_MYSQL, BEFORE_EACH_MYSQL };
