import Component from '@glimmer/component';
import { fn } from '@ember/helper';
import { action } from '@ember/object';
import * as services from '@ember/service';

import { link } from 'ember-link';

import { command, commandFor, LinkCommand } from '#src';

import Button from '../button.gts';
import CounterDecrementCommand from './counter-decrement-command';
import CounterIncrementCommand from './counter-increment-command';
import FooBarAction from './foobar-log-command';
import PushLogCommand from './push-log-command';

import type CounterService from '../../services/counter.ts';
import type { Link, LinkManagerService } from 'ember-link';

interface CommandDemoSignature {
  Args: {
    cookCurry: (curry: string) => void;
  };
}

// ember 3.28 has no exported `service` but `inject`
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-deprecated
const service = services.service ?? services.inject;

export default class CommandDemo extends Component<CommandDemoSignature> {
  @service declare linkManager: LinkManagerService;
  @service declare counter: CounterService;

  // how you'd do it in regular ember
  @action
  bananaAction(): void {
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

  <template>
    <Button @push={{this.push}}>
      log me
    </Button>

    <Button @push={{this.compoundPush}}>
      Compouned Action
    </Button>

    <Button @push={{this.bananaAction}}>
      Banana Action
    </Button>

    <Button @push={{this.bananaCommander}}>
      Banana Commander
    </Button>

    <hr />

    Counter:
    {{this.counterValue}}

    <Button @push={{this.incrementCounter}}>
      +
    </Button>
    <Button @push={{this.decrementCounter}}>
      -
    </Button>

    <hr />

    Cook a curry:

    <Button @push={{fn @cookCurry "green"}}>
      green
    </Button>
    <Button @push={{fn @cookCurry "yellow"}}>
      yellow
    </Button>
    <Button @push={{fn @cookCurry "red"}}>
      red
    </Button>

    <hr />

    Links to:

    <Button @push={{link route="route-a"}}>
      Route A
    </Button>
    -
    <Button @push={{this.navigateToB}}>
      Route B
    </Button>
    -
    <Button @push={{this.navigateToC}}>
      Route C
    </Button>
    -
    <Button @push={{this.logWhileNavigate}}>
      Route C and log
    </Button>
  </template>
}
