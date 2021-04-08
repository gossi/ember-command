import Component from '@glimmer/component';
import PushLogCommand from './push-log-command';
import FooBarAction from './foobar-log-command';
import { command, commandFor, LinkCommand } from 'ember-command';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import LinkManagerService from 'ember-link/services/link-manager';
import CounterService from 'dummy/tests/dummy/app/services/counter';
import CounterIncrementCommand from './counter-increment-command';
import CounterDecrementCommand from './counter-decrement-command';

export default class CurriedButtonComponent extends Component {
  @service declare linkManager: LinkManagerService;
  @service declare counter: CounterService;

  @action
  bananaAction() {
    console.log('banana');
  }

  get linkToC() {
    return this.linkManager.createUILink({ route: 'route-c' });
  }

  // with actionables

  @command push = commandFor(new PushLogCommand());
  @command compoundPush = [new PushLogCommand(), new FooBarAction()];

  // actionables with a link

  @command navigateToC = this.linkToC;
  @command navigateToB = new LinkCommand({ route: 'route-b' });

  // actionable link + function

  @command logWhileNavigate = [new PushLogCommand(), this.linkToC];

  // running in a shared service

  @command incrementCounter = new CounterIncrementCommand();
  @command decrementCounter = new CounterDecrementCommand();

  get counterValue() {
    return this.counter.counter;
  }

  @action
  bananaCommander() {
    this.push();
  }
}
