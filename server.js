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
import { v4 as uuidv4 } from "uuid";
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
import notificationRoutes from "./routes/notificationRoutes";
import BranchRoutes from "./routes/BranchRoutes";
import folderRoutes from "./routes/folderRoutes";
import userguideRoutes from "./routes/userguideRoutes";
import homepageRoutes from "./routes/homepageRoutes";
import homeDataRoutes from "./routes/homeDataRoutes";
import policyterms from "./routes/policytermsRoutes";
import servicesRoutes from "./routes/servicesRoutes";

import Stripe from "stripe";
const stripe = Stripe("sk_test_OVw01bpmRN2wBK2ggwaPwC5500SKtEYy9V");

dotenv.config();

const PORT = 5051;

// SSL Configuration
const local = true;
let credentials = {};

if (local) {
  credentials = {
    key: fs.readFileSync("/etc/apache2/ssl/onlinetestingserver.key", "utf8"),
    cert: fs.readFileSync("/etc/apache2/ssl/onlinetestingserver.crt", "utf8"),
    ca: fs.readFileSync("/etc/apache2/ssl/onlinetestingserver.ca")
  };
} else {
  credentials = {
    key: fs.readFileSync("../certs/ssl.key"),
    cert: fs.readFileSync("../certs/ssl.crt"),
    ca: fs.readFileSync("../certs/ca-bundle")
  };
}

connectDB();
const app = express();
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(logger("dev"));

app.post("/api/checkout", async (req, res) => {
  console.log("Request:", req.body);

  let error;
  let status;
  try {
    const { product, token } = req.body;
    console.log(product, typeof product, "prodprice");
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    });

    const idempotency_key = uuidv4();
    const charge = await stripe.charges.create(
      {
        amount: product * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        // description: `Purchased the ${product.name}`,
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip
          }
        }
      },
      {
        idempotency_key
      }
    );
    console.log("Charge:", { charge });
    res.json(charge);

    status = "success";
  } catch (error) {
    console.error("Error:", error);
    status = "failure";
    res.json(error);
  }
});

app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter
  }).fields([
    {
      name: "user_image",
      maxCount: 1
    },
    {
      name: "ad_video",
      maxCount: 1
    },
    {
      name: "doc_schedule",
      maxCount: 1
    }
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
app.use("/api/Branch", BranchRoutes);
app.use("/api/folder", folderRoutes);
app.use("/api/userguide", userguideRoutes);
app.use("/api/homepage", homepageRoutes);
app.use("/api/homeDataRoutes", homeDataRoutes);
app.use("/api/policyterms", policyterms);
app.use("/api/services", servicesRoutes);

const __dirname = path.resolve();
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/api/download/uploads/:file_name", function (req, res) {
  console.log("IN HERE", req.params);
  const file = `${__dirname}/uploads/${req.params.file_name}`;
  res.download(file); // Set disposition and send it.
});

app.get("/", (req, res) => {
  res.send("API is running....");
});

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT, () => {
  console.log(
    "\u001b[" + 34 + "m" + `Server started on port: ${PORT}` + "\u001b[0m"
  );
});
