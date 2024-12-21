import pg from "pg";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT || 5432, 
});

db.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Failed to connect to PostgreSQL:", err.message));

export const signup = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userCheck = await db.query("SELECT email FROM users WHERE email = $1;", [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "User already exists, try logging in" });
    }

    const hashPassword = await bcryptjs.hash(password, 10);

    const createdUser = await db.query(
      "INSERT INTO users (fullname, email, password) VALUES ($1, $2, $3) RETURNING fullname, email;",
      [fullname, email, hashPassword]
    );

    res.status(201).json({
      message: "User created successfully",
      user: createdUser.rows[0],
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const userResult = await db.query("SELECT * FROM users WHERE email = $1;", [email]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
