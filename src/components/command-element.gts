import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { action } from '@ember/object';

import { element } from 'ember-element-helper';

import { getLink } from '../-private/instance.ts';

import type { CommandAction, Function } from '../-private/instance.ts';
import type { ElementFromTagName, ElementSignature } from 'ember-element-helper';
import type { Link } from 'ember-link';

export interface CommandSignature<T extends string = 'span'> {
  Element: HTMLButtonElement | HTMLAnchorElement | ElementFromTagName<T>;
  Args: {
    command?: CommandAction;
    /**
     * Pass in a `(element)` as fallback when `@command` is empty. Anyway a `<span>`
     * is used.
     */
    element?: ElementSignature<'a' | 'button' | T>['Return'];
  };
  Blocks: {
    default: [];
  };
}

export default class CommandElement extends Component<CommandSignature> {
  get tagName(): 'a' | 'button' | undefined {
    if (this.link) {
      return 'a';
    }

    if (this.command) {
      return 'button';
    }

    return undefined;
  }

  get command(): Function | undefined {
    if (typeof this.args.command === 'function') {
      return this.args.command;
    }

    return undefined;
  }

  get link(): Link | undefined {
    return this.args.command && getLink(this.args.command);
  }

  @action
  invoke(event: Event): void {
    if (typeof this.args.command === 'function') {
      void this.args.command();
    }

    if (this.link) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (this.link.open) {
        this.link.open(event);
      } else {
        this.link.transitionTo(event);
      }
    }
  }

  <template>
    {{#let
      (if this.tagName (element this.tagName) (if @element @element (element "span")))
      as |Element|
    }}
      <Element
        href={{if this.link this.link.url}}
        type={{if this.command "button"}}
        {{on "click" this.invoke}}
        data-test-commander
        ...attributes
      >
        {{yield}}
      </Element>
    {{/let}}
  </template>
}
