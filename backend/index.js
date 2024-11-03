import express from "express";
import env from "dotenv";
import pg from "pg";
import cors from "cors";

import bookRoute from "./route/book.route.js";
import userRoute from "./route/user.route.js";


const app = express();

app.use(cors());
app.use(express.json());

env.config();
const db = new pg.Client({
  user: process.env.PG_user,
  host: process.env.PG_host,
  database: process.env.PG_database,
  password: process.env.PG_password,
  port: 5432,
});
db.connect();
const port = process.env.PORT || 3000 ;


// app.get("/", async (req, res) => {
//   const countries = await db.query("SELECT * FROM books;");
//   res.send(countries);
// });
app.use("/book", bookRoute);
app.use("/user", userRoute);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
