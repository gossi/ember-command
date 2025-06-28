import { Command } from '#src';

export default class FooBarLogCommand extends Command {
  execute(): void {
    console.log('foobar');
  }
}
