require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
app.use(cors({ origin: "*", credentials: true }));
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected To DB"));
app.use(express.json());
const toursRouter = require("./routes/tours");
const usersRouter = require("./routes/users");
app.use("/tours", toursRouter);
app.use("/users", usersRouter);

app.listen(process.env.PORT, () => console.log("listening on port 5000"));
