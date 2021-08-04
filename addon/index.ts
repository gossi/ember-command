import { getOwner, setOwner } from '@ember/application';
import { assert } from '@ember/debug';

import { Commandable, Invocable } from 'ember-command/-private/commandables';
import { UILink } from 'ember-link';
import LinkManagerService from 'ember-link/services/link-manager';

import { Command } from './-private/command';
import { LinkCommand } from './-private/link-command';

export { Command, LinkCommand };

type InvocableCommandable = Command | Invocable;

export interface CommandInstance {
  (...args: unknown[]): void;
  link?: UILink;
}

export type CommandAction = Invocable | UILink | CommandInstance;

export function makeAction(
  owner: unknown,
  composition: Commandable | Commandable[]
): CommandInstance {
  const commandables = !Array.isArray(composition)
    ? [composition]
    : composition;

  // find the (first) link
  const link = commandables.find(
    commandable =>
      commandable instanceof UILink || commandable instanceof LinkCommand
  ) as unknown as UILink | LinkCommand;

  // keep remaining invocables
  const invocables = commandables.filter(
    commandable =>
      commandable instanceof Command || typeof commandable === 'function'
  ) as InvocableCommandable[];

  // set owner to commands
  invocables.map(commandable => {
    if (commandable instanceof Command) {
      setOwner(commandable, owner);
    }

    return commandable;
  });

  const action = (...args: unknown[]) => {
    for (const fn of invocables) {
      if (fn instanceof Command) {
        fn.execute(...args);
      } else {
        fn(...args);
      }
    }
  };

  if (link instanceof LinkCommand) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const linkManager = owner.lookup(
      'service:link-manager'
    ) as LinkManagerService;
    assert(`missing 'service:link-manager' for 'LinkCommand'`, linkManager);
    action.link = linkManager.createUILink(link.params) as UILink;
  } else if (link instanceof UILink) {
    action.link = link;
  }

  return action;
}

function isCommandable(commandable: unknown) {
  return (
    typeof commandable === 'function' ||
    commandable instanceof Command ||
    commandable instanceof LinkCommand ||
    commandable instanceof UILink
  );
}

export function commandFor(commands: unknown | unknown[]): CommandInstance {
  assert(
    `${commands} do not appear to be a command`,
    commands && Array.isArray(commands)
      ? commands.every(commandable => isCommandable(commandable))
      : isCommandable(commands)
  );

  return commands as unknown as CommandInstance;
}

interface DecoratorPropertyDescriptor extends PropertyDescriptor {
  initializer?(): unknown;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore typings are weird for that case. That's the best to make it work
// as expression - ie. ignoring was easier than to change the code to a factory 😱
const command: PropertyDecorator = function (
  _prototype: unknown,
  key: string | symbol,
  desc: PropertyDescriptor
) {
  const actions = new WeakMap();
  const { initializer, get } = desc as DecoratorPropertyDescriptor;
  const invoker = initializer ?? get;

  return {
    get() {
      let action = actions.get(this);

      if (!action) {
        assert(
          `Missing initializer for '${String(key)}'.`,
          typeof invoker === 'function'
        );
        action = makeAction(getOwner(this), invoker.call(this));
        actions.set(this, action);
      }

      return action;
    }
  };
};

export { command };
