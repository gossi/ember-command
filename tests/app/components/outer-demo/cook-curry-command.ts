import { Command } from '#src';

export default class CookCurryCommand extends Command {
  execute(curry: string): void {
    console.log(`cooking ${curry} curry`);
  }
}
