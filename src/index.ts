import { registerCommand, runCommand, CommandsRegistry, handlerUsers } from "./commands.js";
import { handlerLogin } from "./commands.js";
import { registerHandler , handlerReset, handlerAgg, handlerAddFeed, handlerFeeds, handlerFollow} from "./commands.js";

async function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", registerHandler);
  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "users", handlerUsers);
  registerCommand(registry, "agg", handlerAgg);
  registerCommand(registry, "addfeed", handlerAddFeed);
  registerCommand(registry, "feeds", handlerFeeds);
  registerCommand(registry, "follow", handlerFollow);

  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Error: Not enough arguments provided");
    process.exit(1);
  }

const [cmdName, ...cmdArgs] = process.argv.slice(2);

try {
  await runCommand(registry, cmdName, cmdArgs);
} catch (err: any) {
  console.error(err.message);
  process.exit(1);
}
  process.exit(0);
}

main();
