import client from "prom-client";

export const itemCreates = new client.Counter({
  name: "eats_catalog_item_creates_total",
  help: "Total items created"
});

export const itemUpdates = new client.Counter({
  name: "eats_catalog_item_updates_total",
  help: "Total items updated"
});

export const itemDeletes = new client.Counter({
  name: "eats_catalog_item_deletes_total",
  help: "Total items deleted"
});
