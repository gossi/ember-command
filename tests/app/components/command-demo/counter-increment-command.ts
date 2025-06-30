import * as services from '@ember/service';

import { Command } from '#src';

import type CounterService from '../../services/counter';

// ember 3.28 has no exported `service` but `inject`
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-deprecated
const service = services.service ?? services.inject;

export default class CounterIncrementCommand extends Command {
  @service declare counter: CounterService;

  execute(): void {
    this.counter.counter++;
  }
}
