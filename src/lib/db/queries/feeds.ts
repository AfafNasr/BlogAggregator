import { db } from "../index";
import { feeds,users } from "../schema";
import { eq } from "drizzle-orm";
import { fetchFeed as fetchRSS } from "../../../rss";
import { sql } from "drizzle-orm";
import { createPost } from "./posts";

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
  await db
    .update(feeds)
    .set({ last_fetched_at: now, updatedAt: now })
    .where(f => f.id.equals(feedId));

  console.log(`[markFeedFetched] Feed ${feedId} marked fetched at ${now.toISOString()}`);
}
export async function getNextFeedToFetch() {
  const feedsResult = await db
    .select()
    .from(feeds)
    .orderBy(sql`last_fetched_at ASC NULLS FIRST`)
    .limit(1);

  return feedsResult[0]; 
}
export async function scrapeFeeds() {
  const feed = await getNextFeedToFetch();
  if (!feed) {
    console.log("[scrapeFeeds] No feed to fetch.");
    return;
  }

  console.log(`[scrapeFeeds] Fetching feed: ${feed.name} (${feed.url})`);
  await markFeedFetched(feed.id);

  try {
    const posts = await fetchRSS(feed.url);
console.log("ITEMS ARRAY:", posts.channel.item);
console.log("ITEMS LENGTH:", posts.channel.item?.length);

    console.log("RSS RESPONSE:", posts);
console.log("TYPE OF ITEMS:", typeof posts?.items);
console.log("IS ARRAY:", Array.isArray(posts?.items));

if (!posts?.channel?.item || !Array.isArray(posts.channel.item)){
      console.log(`[scrapeFeeds] No items found in feed: ${feed.url}`);
      return;
    }

for (const item of posts.channel.item ) {
 console.log("ITEM INSIDE LOOP:", item);
  await createPost({
    title: item.title || "Untitled",
    url: item.link,
    description: item.contentSnippet || item.summary,
    publishedAt: item.pubDate ? new Date(item.pubDate) : undefined,
    feedId: feed.id,
  });
}
console.log(`[scrapeFeeds] Saved ${posts.items?.length || 0} posts from ${feed.name}`);
    console.log(`[scrapeFeeds] Finished fetching feed: ${feed.name}`);
  } catch (err) {
    console.error(`[scrapeFeeds] Error fetching feed: ${feed.url}`, err);
  }
}
