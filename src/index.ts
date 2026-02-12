import { registerCommand, runCommand, CommandsRegistry, handlerUsers } from "./commands.js";
import { handlerLogin, middlewareLoggedIn } from "./commands.js";
import { registerHandler , handlerReset, handlerAgg, handlerAddFeed, handlerFeeds, handlerFollow, handlerFollowing} from "./commands.js";

async function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", registerHandler);
  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "users", handlerUsers);
  registerCommand(registry, "agg", handlerAgg);
  registerCommand(registry,"addfeed",middlewareLoggedIn(handlerAddFeed));
  registerCommand(registry, "feeds", handlerFeeds);
  registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
  registerCommand(registry, "following", middlewareLoggedIn(handlerFollowing));
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Error: Not enough arguments provided");
    process.exit(1);
  }

const [cmdName, ...cmdArgs] = args;
console.log("[main] CMD:", cmdName);
console.log("[main] ARGS:", cmdArgs);

try {
  await runCommand(registry, cmdName, ...cmdArgs);
} catch (err: any) {
  console.error(err.message);
  process.exit(1);
}
  process.exit(0);
}

main();
