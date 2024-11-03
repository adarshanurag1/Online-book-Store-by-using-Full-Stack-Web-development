import pg from "pg";
import env from "dotenv";
env.config();
const db = new pg.Client({
    user: process.env.PG_user,
    host: process.env.PG_host,
    database: process.env.PG_database,
    password: process.env.PG_password,
    port: 5432,
  });
  db.connect();
export const getBook = async(req, res) => {
    try {
        const book = await db.query("SELECT * FROM books;");
        res.status(200).json(book);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json(error);
    }
};