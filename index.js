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
