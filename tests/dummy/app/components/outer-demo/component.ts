import Component from '@glimmer/component';
import CurryCookAction from './curry-cook-action';
import { actionable } from 'ember-actionables';

export default class OuterDemoComponent extends Component {
  @actionable cookTheCurry = new CurryCookAction();
}
