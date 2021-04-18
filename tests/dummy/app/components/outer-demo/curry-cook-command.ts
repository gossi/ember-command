import { Command } from 'ember-command';

export default class CurryCookCommand extends Command {
  execute(curry: string) {
    console.log(`cooking ${curry} curry`);
  }
}
