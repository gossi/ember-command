import Component from '@glimmer/component';
import PushLogAction from './push-log-action';
import FooBarAction from './foobar-log-action';
import { actionable } from 'ember-actionables';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import LinkManagerService from 'ember-link/services/link-manager';
import CounterService from 'dummy/tests/dummy/app/services/counter';
import CounterIncrementAction from './counter-increment-action';
import CounterDecrementAction from './counter-decrement-action';

export default class CurriedButtonComponent extends Component {
  @service declare linkManager: LinkManagerService;
  @service declare counter: CounterService;

  @action
  bananaAction() {
    console.log('banana');
  }

  // with actionables

  @actionable push = new PushLogAction();
  @actionable compoundPush = [new PushLogAction(), new FooBarAction()];

  // actionables with a link

  @actionable navigateToC = this.linkToC;

  get linkToC() {
    return this.linkManager.createUILink({ route: 'route-c' });
  }

  // actionable link + function

  @actionable logWhileNavigate = [this.linkToC, new PushLogAction()];

  // running in a shared service

  @actionable incrementCounter = new CounterIncrementAction();
  @actionable decrementCounter = new CounterDecrementAction();

  get counterValue() {
    return this.counter.counter;
  }

  @action
  bananaCommander() {
    this.push();
  }
}
