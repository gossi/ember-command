import { Command } from 'ember-command';

export default class FooBarLogCommand extends Command {
  execute(): void {
    console.log('foobar');
  }
}
