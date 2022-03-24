import { Command } from 'ember-command';

export default class PushLogCommand extends Command {
  execute(): void {
    // eslint-disable-next-line no-console
    console.log('puuuushed');
  }
}
