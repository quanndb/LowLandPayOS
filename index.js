const express = require("express");
const cors = require("cors");
const PayOS = require("@payos/node");

const app = express();

const port = 3000;

const payos = new PayOS(
  "6d09642c-91fb-4643-ac10-99aacc99381e",
  "02b6746a-517a-4bd9-8e4e-65e83890af50",
  "a4b21d36582902f56af34fafe75550e28be29099891168b8ba6b05fc00e4e852"
);

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DOMAIN = "http://localhost:5173";

app.post("/create-payment-link", async (req, res) => {
  const order = {
    description: "LowLand thanh toan",
    returnUrl: `${DOMAIN}/payment-success`,
    cancelUrl: `${DOMAIN}/payment-cancel`,
  };
  order.amount = req.body.amount;
  order.orderCode = req.body.orderCode;
  const paymentLink = await payos.createPaymentLink(order);
  res.redirect(303, paymentLink.checkoutUrl);
});

app.post("/receive-hook", async (req, res) => {
  res.json(req);
});

app.listen(port, () => {
  console.log("Listenning at port " + port);
});
