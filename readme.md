# Type-safe SQL

This is a type-safe query builder for **SQL** written in **TypeScript**. It has built-in support for **Postgres** and **MySQL**, and it shouldn't be hard to adopt it for other database engines. 

#### Installing
`npm install type-sql`

#### Examples

```typescript
let result = await db.from(BOOK)
    .where(BOOK.author.lower().like('%john%')
        .and(BOOK.price.lt(10).or(BOOK.available.eq(true)))
        .and(BOOK.date.gte(new Date('2016-10-23T19:11:25.342Z'))))
    .groupBy(BOOK.author, BOOK.available)
    .having(BOOK.price.sum().between(1000, 2000))
    .orderBy(BOOK.author.asc().nullsFirst(), BOOK.price.sum().desc())
    .offset(20)
    .limit(10)
    .select(BOOK.author, BOOK.available, BOOK.price.sum().as('sum_price'));

await db.table(BOOK)
    .where(BOOK.author.eq('John Smith'), BOOK.price.lte(200))
    .update({
        author: 'John X.',
        available: false
    });

await db.table(BOOK).where(BOOK.title.isNull()).delete();

let generatedId = await db.table(BOOK).insert({ title: '...', author: '...' });
let book = await db.table(BOOK).get(generatedId);
```
#### Table definition
You have to define the structure of the tables with a table object, and optionally an entity interface. 
The table object is used for the builder, while the entity interface is used as an input type for INSERT and UPDATE queries, and as a result type of SELECT queries when all columns of a single table are queried.

(DDL generation from or to the table object is not supported)
```typescript
import { QueryTable, StringColumn, NumberColumn, BooleanColumn, DateColumn, BasicColumn } from "type-sql";

export interface Book {
    id?: number,
    title: string,
    author: string,
    price?: number,
    available?: boolean,
    date?: Date,
    data?: { x: number, y: number }
}

export class BookTable extends QueryTable<Book, number> {
    id = new NumberColumn(this, 'id');
    title = new StringColumn(this, 'title');
    author = new StringColumn(this,'author');
    price = new NumberColumn(this, 'price');
    date = new DateColumn(this, 'date');
    available = new BooleanColumn(this, 'available');
    data = new BasicColumn<this, any>(this, 'data');

    $id = this.id
}

export const BOOK = new BookTable('Book');
```

#### Query executor
The database object that acts as the source of the query builder must be initialized with a [Postgres](https://github.com/brianc/node-postgres) or [MySQL](https://github.com/mysqljs/mysql) client:

PostgreSQL:
```typescript
import { Client } from 'pg';
import { PgQuerySource } from "type-sql";

let client = new Client();
client.connect();

let db = new PgQuerySource(client);
```
MySQL:
```typescript
import mysql = require('mysql');
import { MySqlQuerySource } from "type-sql";

let client = mysql.createConnection(...);
client.connect();

let db = new MySqlQuerySource(client);
```

#### Features
The are many more examples among the [tests](https://github.com/ggmod/type-sql/tree/master/test), with features including
* joins
* more functions on columns
* composite ID
* inserting multiple entities
* shortcuts for deleting/updating/querying a single entity by ID
* aliased column name, for example to map snake_case columns to camelCase JavaScript object fields

#### SQL injection
The library uses "parameterized" queries by default, so that the input parameters are passed to the client separately from the sql string.

If for some reason you want to switch off the parameter escaping, then you can do it by passing the "parameterized: false" flag to the query source. Note that the query builder will still throw an error if the parameter's type is incorrect, so for example you can't pass a string to a number column even if the parameters are not escaped.
```typescript 
let db = new PgQuerySource(client, { parameterized: false });
``` 

#### Logging

You can log the SQL queries performed by the library two different ways:
By passing the logging flag to the query source object, and then the queries will be written to the console by the [debug](https://github.com/visionmedia/debug) tool under the 'type-sql' tag: 
```typescript 
let db = new PgQuerySource(client, { logging: true });
``` 
Or you can pass a custom logger function to the query source: 
```typescript 
let db = new PgQuerySource(client, { logger: (sql: string, params?: any[]) => { console.log(sql, params); }})
```

#### Licensing
MIT License
