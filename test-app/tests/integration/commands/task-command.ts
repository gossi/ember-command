import { Command } from 'ember-command';
import { timeout } from 'ember-concurrency';
import { dropTask } from 'ember-concurrency-decorators';
import { taskFor } from 'ember-concurrency-ts';

interface Bag {
  carry: boolean;
}

export default class TaskCommand extends Command {
  #bag: Bag;
  constructor(bag: Bag) {
    super();
    this.#bag = bag;
  }

  async execute(): Promise<void> {
    await taskFor(this.changeBag).perform();
  }

  @dropTask
  *changeBag(): Generator {
    yield timeout(500);

    this.#bag.carry = true;
  }
}
