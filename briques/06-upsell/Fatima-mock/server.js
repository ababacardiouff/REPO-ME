const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("tiny"));

app.get("/health", (_, res) => res.json({ ok: true, service: "fatima-mock" }));

app.post("/api/v1/recommend/menu-bundle", (req, res) => {
  const { productId } = req.body || {};
  const items = [
    { id: "mock-1", name: "FATIMA Suggested Side", price: 500, currency: "XOF" },
    { id: "mock-2", name: "FATIMA Suggested Drink", price: 300, currency: "XOF" },
  ];

  setTimeout(
    () =>
      res.json({
        id: `bundle-${productId || "anon"}`,
        baseProductId: productId || null,
        items,
        total: items.reduce((sum, it) => sum + it.price, 0),
        currency: "XOF",
        createdAt: new Date().toISOString(),
        reason: "mocked",
      }),
    120
  );
});

app.post("/__override", (_, res) => res.status(204).end());

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Fatima-mock listening on ${port}`);
});
