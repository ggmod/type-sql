import { Client } from 'pg';
import { PgQueryProcessor, QuerySource } from "../../dist";
import PG_CONFIG from '../pg-config';

let client = new Client(PG_CONFIG);
client.connect();

let db = new QuerySource(new PgQueryProcessor(client, { parameterized: true }));

export function sync(fn) {
    return done => {
        fn().then(() => { done(); }, err => { done.fail(err) });
    }
}

const BEFORE_ALL = `
DROP TABLE IF EXISTS "Book";
DROP TABLE IF EXISTS "Author";
DROP TABLE IF EXISTS "BookOrder";
DROP TABLE IF EXISTS "BookType";
DROP SEQUENCE IF EXISTS "test_sequence";

CREATE SEQUENCE "test_sequence";

CREATE TABLE "Book" ( 
	"id" Integer DEFAULT nextval('test_sequence'::regclass) NOT NULL,
	"title" Character Varying( 2044 ) NOT NULL,
	"author" Character Varying( 2044 ),
	"author_id" Integer,
	"price" Integer,
	"available" Boolean,
	"date" Timestamp With Time Zone,
	"data" JSON,
	PRIMARY KEY ( "id" ) 
);

CREATE TABLE "Author" (
    "id" Integer DEFAULT nextval('test_sequence'::regclass) NOT NULL,
	"name" Character Varying( 2044 ) NOT NULL,
	PRIMARY KEY ( "id" ) 
);

CREATE TABLE "BookOrder" (
    "bookId" Integer NOT NULL,
	"orderId" Integer NOT NULL,
	"count" Integer NOT NULL,
	PRIMARY KEY ( "bookId", "orderId" ) 
);

CREATE TABLE "BookType" (
	"name" Character Varying( 2044 ) NOT NULL,
	"description" Character Varying( 2044 ),
	PRIMARY KEY ( "name" ) 
);
`;

const BEFORE_EACH = `
DELETE FROM "Book";
DELETE FROM "Author";
DELETE FROM "BookOrder";
DELETE FROM "BookType";
ALTER SEQUENCE "test_sequence" RESTART WITH 1;
`;

export { db, client, BEFORE_ALL, BEFORE_EACH };
