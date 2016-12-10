import { Client } from 'pg';
import { PgQueryProcessor, QuerySource } from "../../dist";
import PG_CONFIG from '../pg-config';

let client = new Client(PG_CONFIG);
client.connect();

let db = new QuerySource(new PgQueryProcessor(client));

export function sync(fn) {
    return done => {
        fn().then(() => { done(); }, err => { done.fail(err) });
    }
}

const BEFORE_ALL = `
DROP TABLE IF EXISTS "Book";
DROP TABLE IF EXISTS "Author";
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
`;

const BEFORE_EACH = `
DELETE FROM "Book";
DELETE FROM "Author";
ALTER SEQUENCE "test_sequence" RESTART WITH 1;
`;

export { db, client, BEFORE_ALL, BEFORE_EACH };
