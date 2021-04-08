import Component from '@glimmer/component';
import CurryCookCommand from './curry-cook-command';
import { command } from 'ember-command';

export default class OuterDemoComponent extends Component {
  @command cookTheCurry = new CurryCookCommand();
}
