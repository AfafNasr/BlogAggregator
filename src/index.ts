import { setUser, readConfig } from "./config";
import { registerCommand, runCommand, CommandsRegistry } from "./commands";
import { handlerLogin } from "./commands";

function main() {
 const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);
const args = process.argv.slice(2);
if (args.length === 0) {
    console.error("Error: Not enough arguments provided");
    process.exit(1);
  }
const [cmdName, ...cmdArgs] = args;

  try {
    runCommand(registry, cmdName, ...cmdArgs);
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  } 
 
}

main();
