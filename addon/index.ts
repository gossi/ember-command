import { getOwner, setOwner } from '@ember/application';
import { assert } from '@ember/debug';
import { UILink } from 'ember-link';
import LinkManagerService from 'ember-link/services/link-manager';
import { Command } from './-private/command';
import { LinkCommand } from './-private/link-command';

export { Command, LinkCommand };

type Commandable = (...args: unknown[]) => void | Command | LinkCommand | UILink;

// or maybe CommandAction ?
export interface Action {
  (...args: unknown[]): void;
  link?: UILink;
}

export function makeAction(owner: unknown, composition: Commandable | Commandable[]) {
  const commandables = !Array.isArray(composition) ? [composition] : composition;

  // find the link
  const link = commandables.find(commandable =>
    commandable instanceof UILink || commandable instanceof LinkCommand
  ) as unknown as UILink | LinkCommand;

  // and remove it
  if (link) {
    commandables.splice(commandables.indexOf(link as unknown as Commandable), 1);
  }

  // set owner to commands
  commandables.map(commandable => {
    if (commandable instanceof Command) {
      setOwner(commandable, owner);
    }

    return commandable;
  });

  const action = (...args: unknown[]) => {
    for (const fn of commandables) {
      if (fn instanceof Command) {
        fn.execute(...args);
      } else {
        fn(...args);
      }
    }
  }

  if (link instanceof LinkCommand) {
    // @ts-ignore
    const linkManager = owner.lookup('service:link-manager') as LinkManagerService;
    assert(`missing 'service:link-manager' for 'LinkCommand'`, linkManager);
    action.link = linkManager.createUILink(link.params) as UILink;
  } else if (link instanceof UILink) {
    action.link = link;
  }

  return action;
}

export function commandFor(commandable: unknown | unknown[]): Action {
  const isCommandable = (commandable: unknown) => {
    return typeof commandable === 'function'
      || commandable instanceof Command
      || commandable instanceof LinkCommand
      || commandable instanceof UILink;
  }

  assert(
    `${commandable} do not appear to be a command`,
    commandable && Array.isArray(commandable) ? commandable.every(isCommandable) : isCommandable(commandable)
  );

  return commandable as unknown as Action;
}

interface DecoratorPropertyDescriptor extends PropertyDescriptor {
  initializer?(): unknown;
}

// @ts-ignore typings are weird for that case. That's the best to make it work
// as expression - ie. ignoring was easier than to construct a factory 😱
const command: PropertyDecorator = function (_prototype: unknown, key: string | symbol, desc: PropertyDescriptor) {
  let actions = new WeakMap();
  let { initializer } = desc as DecoratorPropertyDescriptor;

  return {
    get() {
      let action = actions.get(this);

      if (!action) {
        assert(
          `Missing initializer for '${String(key)}'.`,
          typeof initializer === 'function'
        );
        action = makeAction(getOwner(this), initializer.call(this));
        actions.set(this, action);
      }

      return action;
    }
  };
}

export { command };
