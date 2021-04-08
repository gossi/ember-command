import { Command } from 'ember-command';

export default class FooBarLogCommand extends Command {
  execute() {
    console.log('foobar');
  }
}
