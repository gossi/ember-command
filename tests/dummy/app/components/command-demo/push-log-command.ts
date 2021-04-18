import { Command } from 'ember-command';

export default class PushLogCommand extends Command {
  execute(): void {
    console.log('puuuushed');
  }
}
