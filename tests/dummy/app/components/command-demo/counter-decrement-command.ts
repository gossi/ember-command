import { inject as service } from '@ember/service';

import { Command } from 'ember-command';

import CounterService from 'dummy/tests/dummy/app/services/counter';

export default class CounterDecrementCommand extends Command {
  @service declare counter: CounterService;

  execute(): void {
    this.counter.counter--;
  }
}
