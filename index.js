const express = require("express");
const cors = require("cors");
const PayOS = require("@payos/node");
require("dotenv").config();

const CLIENT_ID = process.env.CLIENT_ID;
const API_KEY = process.env.API_KEY;
const CHECKSUM_KEY = process.env.CHECKSUM_KEY;
const CLIENT_HOST = process.env.CLIENT_HOST;

const app = express();

const port = 3000;

const payos = new PayOS(CLIENT_ID, API_KEY, CHECKSUM_KEY);

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DOMAIN = CLIENT_HOST;

app.post("/", async (req, res) => {
  res.send("Lowland pay server");
});

app.post("/create-payment-link", async (req, res) => {
  try {
    const order = {
      description: "LowLand thanh toan",
      returnUrl: `${DOMAIN}/`,
      cancelUrl: `${DOMAIN}/payment-cancel`,
    };
    order.amount = req.body.amount;
    order.orderCode = req.body.orderCode;
    order.items = req.body.items;
    const paymentLink = await payos.createPaymentLink(order);
    res.send(paymentLink.checkoutUrl);
  } catch (error) {
    res.status(400);
    res.send("Error");
  }
});

app.post("/receive-hook", async (req, res) => {
  console.log(req);
  res.json();
});

app.post("/cancel-payment", async (req, res) => {
  try {
    const cancelledPaymentLink = await payos.cancelPaymentLink(
      req.body.orderCode,
      req.body.reason
    );
    res.send(cancelledPaymentLink);
  } catch (error) {
    res.status(400);
    res.send("Error");
  }
});

app.listen(port, () => {
  console.log("Listenning at port " + port);
});
