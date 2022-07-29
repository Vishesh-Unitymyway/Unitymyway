const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const userRouter = require("./Routes/userRoute");

dotenv.config({ path: "./config.env" });

const app = express();
const PORT = process.env.PORT || 4500;

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

mongoose
  .connect("mongodb://localhost:27017/Amazon")
  .then(() => {
    console.log("DATABASE CONNECTION SUCCESSFULL !!!");
  })
  .catch((err) => {
    console.log(err);
    console.log("DATABASE CONNECTION FAILED !!!");
  });

app.use("/api/v1/user", userRouter);

app.listen(PORT, () => {
  console.log(`App is running at PORT ${PORT}`);
});
