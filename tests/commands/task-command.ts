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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await this.changeBagTask.perform();
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, unicorn/consistent-function-scoping
  changeBagTask = dropTask(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await timeout(250);

    this.bag.carry = true;
  });
}
