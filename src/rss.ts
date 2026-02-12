import { XMLParser } from "fast-xml-parser";

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  const response = await fetch(feedURL, {
    headers: {
      "User-Agent": "gator",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch feed: ${response.status}`);
  }

  const xmlText = await response.text();

  const parser = new XMLParser();
  const data = parser.parse(xmlText);

  if (!data.rss || !data.rss.channel) {
    throw new Error("Invalid RSS format: missing channel");
  }

  const channel = data.rss.channel;

  if (!channel.title || !channel.link || !channel.description) {
    throw new Error("Invalid RSS format: missing channel metadata");
  }

  let items: RSSItem[] = [];

  if (channel.item) {
    const rawItems = Array.isArray(channel.item)
      ? channel.item
      : [channel.item];

    for (const item of rawItems) {
      if (!item.title || !item.link || !item.description || !item.pubDate) {
        continue;
      }

      items.push({
        title: item.title,
        link: item.link,
        description: item.description,
        pubDate: item.pubDate,
      });
    }
  }

  return {
    channel: {
      title: channel.title,
      link: channel.link,
      description: channel.description,
      item: items,
    },
  };
}
