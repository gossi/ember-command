import { Command } from 'ember-command';

export default class CookCurryCommand extends Command {
  execute(curry: string): void {
    // eslint-disable-next-line no-console
    console.log(`cooking ${curry} curry`);
  }
}
