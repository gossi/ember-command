import Component from '@glimmer/component';

import { command, commandFor } from '#src';

import CommandDemo from '../command-demo/command-demo.gts';
import CookCurryCommand from './cook-curry-command';

export default class OuterDemo extends Component {
  @command cookTheCurry = commandFor(new CookCurryCommand());

  <template><CommandDemo @cookCurry={{this.cookTheCurry}} /></template>
}
