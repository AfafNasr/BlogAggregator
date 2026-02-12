import { setUser, readConfig } from "./config";
import { createUser, getUserByName, deleteAllUsers, getUsers } from "./lib/db/queries/users.js";
import { fetchFeed } from "./rss";
import { createFeed, getFeeds, getFeedByURL, scrapeFeeds } from "./lib/db/queries/feeds";
import { Feed } from "./lib/db/schema";
import { User } from "./lib/db/schema";
import { createFeedFollow, getFeedFollowsForUser, deleteFeedFollow } from "./lib/db/queries/feedFollows";
import { db } from "./lib/db";
import { users, feeds, feedFollows } from "./lib/db/schema";

export type CommandHandler = (...args: string[]) => Promise<void>;
export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export async function handlerLogin(...args: string[]) {
  const username = args[0];

  if (!username) {
    throw new Error("Username is required");
  }

  const user = await getUserByName(username);

  if (!user) {
    throw new Error(`User "${username}" does not exist`);
  }


  setUser(user.name);

  console.log(`Logged in successfully as ${user.name}`);
}
export type CommandsRegistry = Record<string, CommandHandler>;

export async function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler
) {
  registry[cmdName] = handler;
}
export async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
): Promise<void> {
  const handler = registry[cmdName];

  if (!handler) {
    throw new Error(`Unknown command: ${cmdName}`);
  }

  await handler(...args);
}
export async function registerHandler(...args: string[]) {
  const username = args[0];

  if (!username) {
    throw new Error("Username is required");
  }

  const existingUser = await getUserByName(username);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const user = await createUser(username);

  
  setUser(user.name);

  console.log("User created successfully!");
  console.log(user);
}
export async function handlerReset(...args: string[]): Promise<void> {
  //await deleteAllUsers();
  await db.delete(feedFollows);
  await db.delete(feeds);
  await db.delete(users);

  
  console.log("Database reset successful");
}

export async function handlerUsers(args: string[]) {
  const cfg = readConfig();
  const current = cfg.currentUserName;

  const allUsers = await getUsers();

  for (const u of allUsers) {
    const suffix = current && u.name === current ? " (current)" : "";
    console.log(`* ${u.name}${suffix}`);
  }
}
export async function handlerAgg(args: string[]) {
  const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
  console.log(JSON.stringify(feed, null, 2));
}

function printFeed(feed: Feed, user: User) {
  console.log("Feed added successfully:");
  console.log("ID:", feed.id);
  console.log("Name:", feed.name);
  console.log("URL:", feed.url);
  console.log("User:", user.name);
  console.log("Created at:", feed.createdAt);
}

export async function handlerAddFeed(user: User, ...args: string[]): Promise<void> {
  console.log("[handlerAddFeed] args:", args, "user:", user?.name);

  if (args.length < 2) {
    throw new Error("usage: addfeed <name> <url>");
  }

  const url = args[args.length - 1]; 
  const name = args.slice(0, -1).join(" "); 

  const feed = await createFeed(name, url, user.id);
  const follow = await createFeedFollow(user.id, feed.id);

  console.log(`${follow.userName} is now following ${follow.feedName}`);
  printFeed(feed, user);
}
export async function handlerFeeds() {
  const feeds = await getFeeds();

  if (feeds.length === 0) {
    console.log("No feeds found.");
    return;
  }

  for (const feed of feeds) {
    console.log("Name:", feed.name);
    console.log("URL:", feed.url);
    console.log("User:", feed.userName);
    console.log("----");
  }
}
export async function handlerFollow(user: User, ...args: string[]) {
  console.log("[handlerFollow] args:", args, "user:", user?.name);

  if (args.length < 1) {
    throw new Error("usage: follow <url>");
  }

  const url = args.join(" "); 

  const feed = await getFeedByURL(url);

  if (!feed) {
    throw new Error("Feed not found");
  }

  const follow = await createFeedFollow(user.id, feed.id);
  console.log(`${follow.userName} is now following ${follow.feedName}`);
}

export async function handlerFollowing(user: User) {
  console.log("[handlerFollowing] user:", user?.name);

  const follows = await getFeedFollowsForUser(user.id);

  if (follows.length === 0) {
    console.log("No followed feeds found.");
    return;
  }

  for (const follow of follows) {
    console.log(follow.feedName);
  }
}

export const middlewareLoggedIn = (handler: UserCommandHandler) => {
  return async (...args: string[]) => {
    console.log("[middleware] args before user:", args);

    const config = readConfig();
    const userName = config.currentUserName;
    console.log("[middleware] currentUserName:", userName);

    if (!userName) {
      throw new Error("No user is currently logged in");
    }

    const user = await getUserByName(userName);
    console.log("[middleware] user found:", user);

    if (!user) {
      throw new Error(`Current user "${userName}" not found`);
    }

    await handler(user, ...args);
  };
};

export async function handlerUnfollow(user: User, url: string) {
  console.log("[handlerUnfollow] user:", user.name, "url:", url);

  const feed = await getFeedByURL(url);
  if (!feed) {
    throw new Error("Feed not found");
  }

  await deleteFeedFollow(user.id, feed.id);
  console.log(`${user.name} has unfollowed ${feed.name}`);
}

export async function parseDuration(durationStr: string): Promise<number> {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);
  if (!match) throw new Error("Invalid duration format, e.g., 1s, 5m, 1h");

  const [, value, unit] = match;
  const num = parseInt(value, 10);

  switch (unit) {
    case "ms": return num;
    case "s": return num * 1000;
    case "m": return num * 60 * 1000;
    case "h": return num * 60 * 60 * 1000;
    default: throw new Error("Unknown time unit");
  }
}

export async function handlerAgg(_cmd: string, timeBetweenStr: string) {
  if (!timeBetweenStr) throw new Error("Usage: agg <time_between_reqs>");

  const timeBetweenMs = await parseDuration(timeBetweenStr);
  console.log(`Collecting feeds every ${timeBetweenStr}`);

  scrapeFeeds().catch(console.error);

  const interval = setInterval(() => {
    scrapeFeeds().catch(console.error);
  }, timeBetweenMs);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}
