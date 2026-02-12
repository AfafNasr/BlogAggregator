import { db } from "../index";
import { feeds,users } from "../schema";
import { eq } from "drizzle-orm";
import { fetchFeed as fetchRSS } from "../rss";

export async function createFeed(name: string, url: string, userId: string) {
  const [feed] = await db
    .insert(feeds)
    .values({
      name,
      url,
      userId,
    })
    .returning();

  return feed;
}

export async function getFeeds() {
  return await db
    .select({
      id: feeds.id,
      name: feeds.name,
      url: feeds.url,
      userName: users.name,
    })
    .from(feeds)
    .innerJoin(users, eq(feeds.userId, users.id));
}
export async function getFeedByURL(url: string) {
  const result = await db
    .select()
    .from(feeds)
    .where(eq(feeds.url, url));

  return result[0];
}
export async function markFeedFetched(feedId: string) {
  const now = new Date();
  await db.update(feeds)
    .set({ last_fetched_at: now, updatedAt: now })
    .where(f => f.id.equals(feedId));
  console.log(`[markFeedFetched] Feed ${feedId} marked fetched at ${now.toISOString()}`);
}

export async function getNextFeedToFetch() {
  const [feed] = await db.select().from(feeds)
    .orderBy(f => f.last_fetched_at, "asc")
    .limit(1);
  console.log("[getNextFeedToFetch] Next feed to fetch:", feed?.name || "None");
  return feed;
}
