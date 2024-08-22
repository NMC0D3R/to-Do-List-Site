const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRouter");
const taskRouter = require("./routes/taskRouter");
const globalErrorHandler = require("./utils/errorHandler");
const AppError = require("./utils/AppError");
const origins = ["http://localhost:5173"];

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      // Check if the request origin is in the allowedOrigins array, or if it's not set (e.g., when using Postman)
      if (origins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.static("public"));

app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);

app.all("*", (req, res, next) => {
  const err = new AppError(404, "the request route not exist");
  next(err);
});

app.use(globalErrorHandler);
module.exports = app;
