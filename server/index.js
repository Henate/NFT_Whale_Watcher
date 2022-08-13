const express = require("express");
const cors = require("cors");
const moonbirds = require("./moonbirdsOwners");
const moonbirdsH = require("./moonbirdsHistory");
const WeakDogs = require("./WeakDogsOwner");
const WeakDogsH = require("./WeakDogsHistory");

const collections = {
  "0x23581767a106ae21c074b2276D25e5C3e136a68b": {
    owners: moonbirds,
    history: moonbirdsH,
  },
  "0xF57e11e7Aa0419D0b2d95538DAf846d042DFEF51": {
    owners: WeakDogs,
    history: WeakDogsH,
  },
};

const app = express();

const port = 4000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to the Whale NFT server");
});

app.get("/collection", (req, res) => {
  const slug = req.query.slug;
  res.send(collections[slug].owners);
});

app.get("/user", (req, res) => {
  const slug = req.query.slug;
  const address = req.query.address;
  res.send(collections[slug].history[address]);
});

app.listen(port, () => console.log(`Whale NFT server running on ${port}`));
