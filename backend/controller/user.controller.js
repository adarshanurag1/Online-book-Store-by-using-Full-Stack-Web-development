import pg from "pg";
import bcryptjs from "bcryptjs";
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
export const signup = async(req, res) => {
    try {
        const { fullname, email, password } = req.body;
        const user = await db.query("SELECT email FROM users WHERE email= $1;", [email]);
        
        if (user.rows[0]) {
            return res.status(400).json({ message: "User already exists , Try Loging in " });
        }
        const hashPassword = await bcryptjs.hash(password, 10);
        console.log(email,fullname,password);
        const createdUser = await db.query("INSERT INTO users (fullname,email,password) values ($1,$2,$3) RETURNING * ",[fullname,email,hashPassword]);
        res.status(201).json({
            message: "User created successfully",
            user: {
                _id: createdUser._id,
                fullname: createdUser.fullname,
                email: createdUser.email,
            },
        });
    } catch (error) {
        console.log("Error: " + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db.query("select * from users where email=$1;",[email]);
        if (user.rows[0].email===email) {
            var valid_email = true;
        }
        const isMatch = await bcryptjs.compare(password, user.rows[0].password);
        if (!valid_email || !isMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        } else {
            res.status(200).json({
                message: "Login successful",
                user: {
                    _id: user._id,
                    fullname: user.fullname,
                    email: user.email,
                },
            });
        }
    } catch (error) {
        console.log("Error: " + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


