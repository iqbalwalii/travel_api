require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected To DB"));
app.use(express.json());
const toursRouter = require("./routes/tours");
app.use("/tours", toursRouter);

app.listen(process.env.PORT, () => console.log("listening on port 5000"));