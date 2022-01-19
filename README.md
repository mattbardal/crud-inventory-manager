# crud-inventory-manager
This application is an online CRUD inventory manager built for the Summer 2022 Shopify Intern Challenge. It lets users create inventory entries, update previously created entries, delete entries, filter entries by name, and export the database as a CSV file. It was built using Node.JS/Express and SQLite3 for the back-end with a simple front-end using HTML, CSS, Bootstrap 5, and some vanilla JS. It is currently hosted on Heroku at https://blooming-sands-72900.herokuapp.com/.

## How it works
### Backend
This application stores all inventory data in a SQLite3 database. The database has a single table `item` as defined by:

```sql
CREATE TABLE IF NOT EXISTS item (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  desc TEXT NOT NULL,
  unit_price REAL NOT NULL,
  qty INTEGER NOT NULL
);
```

To communicate with this database, all CRUD requests are made through an Express API as defined in `server.js`. The api calls are as follows:

`GET /api/items` Lists all items in the database.<br />
`GET /api/item/:id` Lists a single database entry from it's ID.<br />
`GET /api/item/name/:name` Lists all database entries which include `:name` in their name.<br />
`GET /api/csv` Grabs all rows from the database and downloads as CSV.<br />

`POST /api/item/add` Handles POST requests to add new items to the database<br />
`PATCH /api/item/update/:id` Handles PATCH requests to update items in the database.<br />
`DELETE /api/item/delete/:id` Handles DELETE requests to delete items from the database.<br />

### Frontend
All front-end communication with the server is handled by the asynchronous fetch functions as defined in `public/asyncFunctions.js`. These are used with the event handlers in `public/frontend.js`. The front-end is built using Bootstrap 5 in order to have a clean layout to perform CRUD functionalities. 

## Run the app
To run this application locally, follow these steps:

1) Clone the repository `git clone https://github.com/mattbardal/crud-inventory-manager.git`
2) Navigate to the newly clone repo and install dependencies using `npm ci`
3) Run the app using npm start (defaults to localhost:3000).

## To-do
In addition to creating the CRUD backend as well as a simple front-end, I wanted to implement basic tests using [Jest](https://jestjs.io/), however I did not get the chance to implement this. If I would have, my go-to methodology would be to create extensive tests for the CRUD functionalities as they are the key functionalities of this application. 
