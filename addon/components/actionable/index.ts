import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Action } from '../../index';
import { UILink } from 'ember-link';

interface ActionableArgs {
  action: Action;
}

export default class ActionableComponent extends Component<ActionableArgs> {
  get link(): UILink | undefined {
    if (this.args.action instanceof UILink) {
      return this.args.action;
    }

    return this.args.action.link;
  }

  @action
  invoke(event: Event) {
    if (typeof this.args.action === 'function') {
      this.args.action();
    }

    if (this.link) {
      this.link.transitionTo(event);
    }
  }
}
