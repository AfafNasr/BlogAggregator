import fs from "fs";
import os from "os";
import path from "path";

type Config ={
dbUrl:string;
 currentUserName?: string;
};


function getConfigFilePath(): string {
  return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(cfg: Config): void {
  const jsonData = JSON.stringify(
    {
      db_url: cfg.dbUrl,
      current_user_name: cfg.currentUserName,
    },
    null,
    2
  );
  fs.writeFileSync(getConfigFilePath(), jsonData, "utf-8");
}

function validateConfig(rawConfig: any): Config {
  if (typeof rawConfig !== "object" || rawConfig === null) {
    throw new Error("Invalid config: not an object");
  }

  const dbUrl = rawConfig.db_url;
  if (typeof dbUrl !== "string") {
    throw new Error("Invalid config: db_url missing or not a string");
  }

  const currentUserName =
    typeof rawConfig.current_user_name === "string"
      ? rawConfig.current_user_name
      : undefined;

  return { dbUrl, currentUserName };
}
export function setUser(username: string): void {
  const cfg = readConfig();
  cfg.currentUserName = username;
  writeConfig(cfg);
}

export function readConfig(): Config {
  const filePath = getConfigFilePath();
  const rawData = fs.readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(rawData);
  return validateConfig(parsed);
}
