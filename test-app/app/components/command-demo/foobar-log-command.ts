import { Command } from 'ember-command';

export default class FooBarLogCommand extends Command {
  execute(): void {
    // eslint-disable-next-line no-console
    console.log('foobar');
  }
}
