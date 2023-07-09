import { assert } from '@ember/debug';
import { setOwner } from '@ember/owner';

import { Link } from 'ember-link';

import { Command } from './command';
import { LinkCommand } from './link-command';

import type Owner from '@ember/owner';
import type { LinkManagerService } from 'ember-link';

const INVOCABLES = Symbol('INVOCABLES');

export type Function = (...args: unknown[]) => void;
type Invocable = Command | Function;

export interface CommandInstance {
  (...args: unknown[]): void;
  link?: Link;
  [INVOCABLES]: Invocable[];
}

export type Commandable = Function | Command | LinkCommand | Link | CommandInstance;
export type CommandAction = Function | Link | CommandInstance;

function isLink(commandable: Commandable) {
  return commandable instanceof Link || commandable instanceof LinkCommand;
}

function isCommandInstance(commandable: Commandable): commandable is CommandInstance {
  return Object.getOwnPropertySymbols(commandable).includes(INVOCABLES);
}

function containsLink(commandable: Commandable) {
  if (isLink(commandable)) {
    return true;
  }

  return (
    isCommandInstance(commandable) && commandable.link !== undefined && isLink(commandable.link)
  );
}

export function getLink(commandable: Commandable) {
  if (isLink(commandable)) {
    return commandable;
  }

  if (
    isCommandInstance(commandable) &&
    commandable.link !== undefined &&
    isLink(commandable.link)
  ) {
    return commandable.link;
  }
}

export function createCommandInstance(
  owner: Owner,
  composition: Commandable | Commandable[]
): CommandInstance {
  const commandables = !Array.isArray(composition) ? [composition] : composition;

  // find the (first) link
  const potentialLink = commandables.find((commandable) => {
    console.log(
      commandable,
      Object.getPrototypeOf(commandable),
      commandable instanceof Link,
      commandable instanceof Object,
      Object.getPrototypeOf(commandable) === Link.prototype,
      Link.prototype
    );

    return containsLink(commandable);
  });
  const link = potentialLink ? getLink(potentialLink) : undefined;

  // keep remaining invocables
  const invocables = commandables.filter(
    (commandable) => commandable instanceof Command || typeof commandable === 'function'
  ) as Invocable[];

  // set owner to commands
  invocables.flatMap((commandable) => {
    if (commandable instanceof Command) {
      setOwner(commandable, owner);
    }

    if (isCommandInstance(commandable)) {
      return commandable[INVOCABLES];
    }

    return commandable;
  });

  const action = function (this: CommandInstance, ...args: unknown[]) {
    for (const fn of this[INVOCABLES]) {
      if (fn instanceof Command) {
        fn.execute(...args);
      } else {
        fn(...args);
      }
    }
  };

  (action as CommandInstance)[INVOCABLES] = invocables;

  if (link instanceof LinkCommand) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const linkManager = owner.lookup('service:link-manager') as LinkManagerService;

    assert(`missing 'service:link-manager' for 'LinkCommand'`, linkManager);
    action.link = linkManager.createLink(link.params) as Link;
  } else if (link instanceof Link) {
    action.link = link;
  }

  console.log(potentialLink, link);

  return action as CommandInstance;
}

function isCommandable(commandable: unknown): commandable is Commandable {
  return (
    typeof commandable === 'function' ||
    commandable instanceof Command ||
    commandable instanceof LinkCommand ||
    commandable instanceof Link
  );
}

export function commandFor(commands: unknown | unknown[]): CommandInstance {
  assert(
    `${commands} do not appear to be a command`,
    commands && Array.isArray(commands)
      ? commands.every((commandable) => isCommandable(commandable))
      : isCommandable(commands)
  );

  return commands as unknown as CommandInstance;
}
