import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import { command, commandFor, LinkCommand } from 'ember-command';

import CounterDecrementCommand from './counter-decrement-command';
import CounterIncrementCommand from './counter-increment-command';
import FooBarAction from './foobar-log-command';
import PushLogCommand from './push-log-command';

import type CounterService from '../../services/counter';
import type { Link } from 'ember-link';
import type LinkManagerService from 'ember-link/services/link-manager';

interface CommandDemoSignature {
  Args: {
    cookCurry: (curry: string) => void;
  };
}

export default class CommandDemo extends Component<CommandDemoSignature> {
  @service declare linkManager: LinkManagerService;
  @service declare counter: CounterService;

  // how you'd do it in regular ember
  @action
  bananaAction(): void {
    // eslint-disable-next-line no-console
    console.log('banana');
  }

  get linkToC(): Link {
    return this.linkManager.createLink({ route: 'route-c' });
  }

  // commands
  @command push = commandFor(new PushLogCommand());
  @command compoundPush = commandFor([new PushLogCommand(), new FooBarAction()]);

  // links as commands
  @command navigateToC = this.linkToC;
  @command navigateToB = new LinkCommand({ route: 'route-b' });

  // command composed of link and function
  @command logWhileNavigate = commandFor([new PushLogCommand(), this.linkToC]);

  // commands with a shared service
  @command incrementCounter = commandFor(new CounterIncrementCommand());
  @command decrementCounter = commandFor(new CounterDecrementCommand());

  get counterValue(): number {
    return this.counter.counter;
  }

  // calling a command from a regular ember action
  @action
  bananaCommander(): void {
    void this.push();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    CommandDemo: typeof CommandDemo;
  }
}
