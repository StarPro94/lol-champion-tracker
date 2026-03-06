import catalog from "./data/championCatalog.json";
import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async () => catalog,
});