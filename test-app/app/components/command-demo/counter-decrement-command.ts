import { inject as service } from '@ember/service';

import { Command } from 'ember-command';

import type CounterService from '../../services/counter';

export default class CounterDecrementCommand extends Command {
  @service declare counter: CounterService;

  execute(): void {
    this.counter.counter--;
  }
}
