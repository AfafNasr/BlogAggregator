import { setUser } from "./config";
export type CommandHandler = (cmdName: string, ...args: string[]) => void;
export function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    throw new Error(`Error: ${cmdName} command requires a username`);
  }
  const username = args[0];
  setUser(username);
  console.log(`User set to: ${username}`);
}
export type CommandsRegistry = Record<string, CommandHandler>;
export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
  registry[cmdName] = handler;
}
export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`Unknown command: ${cmdName}`);
  }
  handler(cmdName, ...args);
}

