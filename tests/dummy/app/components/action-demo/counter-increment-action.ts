import { Action } from 'ember-actionables';
import { inject as service } from '@ember/service';
import CounterService from 'dummy/tests/dummy/app/services/counter';

export default class CounterIncrementAction extends Action {
  @service declare counter: CounterService;

  execute() {
    this.counter.counter++;
  }
}
