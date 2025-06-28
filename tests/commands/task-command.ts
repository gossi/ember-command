import { Command } from 'ember-command';
import { dropTask, timeout } from 'ember-concurrency';

interface Bag {
  carry: boolean;
}

export default class TaskCommand extends Command {
  private bag: Bag;

  constructor(bag: Bag) {
    super();
    this.bag = bag;
  }

  async execute() {
    await this.changeBagTask.perform();
  }

  // eslint-disable-next-line unicorn/consistent-function-scoping
  changeBagTask = dropTask(async () => {
    await timeout(250);

    this.bag.carry = true;
  });
}
