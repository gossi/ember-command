import Component from '@glimmer/component';
import { action } from '@ember/object';

import { Link } from 'ember-link';

import type { CommandAction, CommandInstance } from '../';
import type { Invocable } from '../-private/commandables';
import type { UILink } from 'ember-link';

interface CommandElementArgs {
  command: CommandAction;
  /**
   * Pass in a `(element)` as fallback when `@command` is empty. Anyway a `<span>`
   * is used.
   */
  element?: Component;
}

export default class CommandElementComponent extends Component<CommandElementArgs> {
  get tagName(): 'a' | 'button' | undefined {
    if (this.link) {
      return 'a';
    }

    if (this.command) {
      return 'button';
    }

    return undefined;
  }

  get command(): Invocable | undefined {
    if (typeof this.args.command === 'function') {
      return this.args.command;
    }

    return undefined;
  }

  get link(): Link | undefined {
    if (this.args.command instanceof Link) {
      return this.args.command;
    }

    return (this.args.command as CommandInstance)?.link;
  }

  @action
  invoke(event: Event): void {
    if (typeof this.args.command === 'function') {
      this.args.command();
    }

    if (this.link) {
      (this.link as UILink).transitionTo(event);
    }
  }
}
