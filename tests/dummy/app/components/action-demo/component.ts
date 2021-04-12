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

  // how you'd do it in regular ember
  @action
  bananaAction() {
    console.log('banana');
  }

  get linkToC() {
    return this.linkManager.createUILink({ route: 'route-c' });
  }

  // commands
  @command push = commandFor(new PushLogCommand());
  @command compoundPush = [new PushLogCommand(), new FooBarAction()];

  // links as commands
  @command navigateToC = this.linkToC;
  @command navigateToB = new LinkCommand({ route: 'route-b' });

  // command composed of link and function
  @command logWhileNavigate = [new PushLogCommand(), this.linkToC];

  // commands with a shared service
  @command incrementCounter = new CounterIncrementCommand();
  @command decrementCounter = new CounterDecrementCommand();

  get counterValue() {
    return this.counter.counter;
  }

  // calling a command from a regular ember action
  @action
  bananaCommander() {
    this.push();
  }
}
