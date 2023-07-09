import { Command } from 'ember-command';
import { timeout, dropTask } from 'ember-concurrency';

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

  @dropTask
  changeBag = dropTask(async () => {
    await timeout(500);

    this.bag.carry = true;
  });
}
