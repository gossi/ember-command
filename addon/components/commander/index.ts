import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Action } from '../../index';
import { UILink } from 'ember-link';

interface CommanderArgs {
  command: Action;
}

export default class CommanderComponent extends Component<CommanderArgs> {
  get link(): UILink | undefined {
    if (this.args.command instanceof UILink) {
      return this.args.command;
    }

    return this.args.command.link;
  }

  @action
  invoke(event: Event) {
    if (typeof this.args.command === 'function') {
      this.args.command();
    }

    if (this.link) {
      this.link.transitionTo(event);
    }
  }
}
