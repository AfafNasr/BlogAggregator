import fs from "fs";
import path from "path";

interface Config {
  dbUrl: string;
  currentUserName?: string;
}

const CONFIG_PATH = path.resolve(process.env.HOME || "~", ".gatorconfig.json");

function getConfigFilePath(): string {
  if (!fs.existsSync(CONFIG_PATH)) {
    const defaultConfig = {
      db_url: "postgres://postgres:postgres@localhost:5432/gator?sslmode=disable",
      current_user_name: null
    };
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(defaultConfig, null, 2));
  }
  return CONFIG_PATH;
}

function validateConfig(rawConfig: any): Config {
  const dbUrl =
    typeof rawConfig.db_url === "string" && rawConfig.db_url.length > 0
      ? rawConfig.db_url
      : undefined;

  if (!dbUrl) {
    throw new Error("Invalid config: db_url missing or not a string");
  }

  const currentUserName =
    typeof rawConfig.current_user_name === "string"
      ? rawConfig.current_user_name
      : undefined;

  return { dbUrl, currentUserName };
}

export function readConfig(): Config {
  const rawData = fs.readFileSync(getConfigFilePath(), "utf-8");
  const parsed = JSON.parse(rawData);
  return validateConfig(parsed);
}

export function setUser(username: string) {
  const filePath = getConfigFilePath();
  const config = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  config.current_user_name = username;
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
}

