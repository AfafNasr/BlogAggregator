import { db } from "../db";
import { feeds } from "../schema";

export async function up() {
  await db.alterTable(feeds, t => {
    t.addColumn("last_fetched_at", "timestamp", { nullable: true });
  });
}

export async function down() {
  await db.alterTable(feeds, t => {
    t.dropColumn("last_fetched_at");
  });
}
