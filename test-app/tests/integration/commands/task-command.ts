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

  async execute(): Promise<void> {
    await this.changeBag.perform();
  }

  changeBag = dropTask(async () => {
    await timeout(500);

    this.bag.carry = true;
  });
}
