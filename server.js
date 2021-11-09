import path from "path";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import logger from "morgan";
import https from "https";
import fs from "fs";

import connectDB from "./config/db.js";
import { fileFilter, fileStorage } from "./multer";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes";
import RequestMachineRoutes from "./routes/requestmachine";
import AdManagementRoutes from "./routes/adManagementRoutes";
import SubscriptionRoutes from "./routes/subscriptionRoutes";
import SettingRoutes from "./routes/settingRoutes";
import PrinterRoutes from "./routes/printerRoutes";
import PrintRoutes from "./routes/printRoutes";
import notificationRoutes from "./routes//notificationRoutes";

dotenv.config();

const PORT = 5051;

// SSL Configuration
const local = true;
let credentials = {};

if (local) {
  credentials = {
    key: fs.readFileSync("/etc/apache2/ssl/onlinetestingserver.key", "utf8"),
    cert: fs.readFileSync("/etc/apache2/ssl/onlinetestingserver.crt", "utf8"),
    ca: fs.readFileSync("/etc/apache2/ssl/onlinetestingserver.ca"),
  };
} else {
  credentials = {
    key: fs.readFileSync("../certs/ssl.key"),
    cert: fs.readFileSync("../certs/ssl.crt"),
    ca: fs.readFileSync("../certs/ca-bundle"),
  };
}

connectDB();
const app = express();
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(logger("dev"));

app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).fields([
    {
      name: "user_image",
      maxCount: 1,
    },
    {
      name: "ad_video",
      maxCount: 1,
    },
  ])
);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/requestmachine", RequestMachineRoutes);
app.use("/api/admanagement", AdManagementRoutes);
app.use("/api/subscription", SubscriptionRoutes);
app.use("/api/settings", SettingRoutes);
app.use("/api/printer", PrinterRoutes);
app.use("/api/print", PrintRoutes);
app.use("/api/notification", notificationRoutes);

const __dirname = path.resolve();
app.use("/uploads", express.static(__dirname + "/uploads"));

app.get("/", (req, res) => {
  res.send("API is running....");
});

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT, () => {
  console.log(
    "\u001b[" + 34 + "m" + `Server started on port: ${PORT}` + "\u001b[0m"
  );
});
