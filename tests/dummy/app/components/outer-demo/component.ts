import Component from '@glimmer/component';

import { command } from 'ember-command';

import CurryCookCommand from './curry-cook-command';

export default class OuterDemoComponent extends Component {
  @command cookTheCurry = new CurryCookCommand();
}
