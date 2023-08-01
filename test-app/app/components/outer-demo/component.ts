import Component from '@glimmer/component';

import { command, commandFor } from 'ember-command';

import CookCurryCommand from './cook-curry-command';

export default class OuterDemo extends Component {
  @command cookTheCurry = commandFor(new CookCurryCommand());
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    OuterDemo: typeof OuterDemo;
  }
}
