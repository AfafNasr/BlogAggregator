import { setUser, readConfig } from "./config";
import { createUser, getUserByName, deleteAllUsers, getUsers } from "./lib/db/queries/users.js";

export type CommandHandler = (args: string[]) => Promise<void>;

export async function handlerLogin(args: string[]) {
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
  args: string[]
): Promise<void> {
  const handler = registry[cmdName];

  if (!handler) {
    throw new Error(`Unknown command: ${cmdName}`);
  }

  await handler(args);
}
export async function registerHandler(args: string[]) {
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
export async function handlerReset(args: string[]): Promise<void> {
  await deleteAllUsers();
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
