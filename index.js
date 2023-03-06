require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Travel_API",
      version: "1.1.0",
      description: "Express Library for a Travel Project",
    },
    servers: [
      { url: `http://localhost:${process.env.PORT}` },
      { url: "https://travel-api-rl2h.onrender.com" },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);
const app = express();

mongoose.set("strictQuery", true);
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
app.use(cors({ origin: "*", credentials: true }));
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected To DB"));
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use(express.json());

const toursRouter = require("./routes/tours");
const usersRouter = require("./routes/users");
app.use("/tours", toursRouter);
app.use("/users", usersRouter);

app.listen(process.env.PORT, () => console.log("listening on port 5000"));