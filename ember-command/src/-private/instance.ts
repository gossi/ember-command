import { assert } from '@ember/debug';

import { Link } from 'ember-link';

import { setOwner } from './-owner';
import { Command } from './command';
import { LinkCommand } from './link-command';

import type Owner from '@ember/owner';
import type { LinkManagerService } from 'ember-link';

// see: https://github.com/gossi/ember-command/issues/23
// const INVOCABLES = Symbol('INVOCABLES');
const INVOCABLES = '__INVOCABLES__';

export type Function = (...args: unknown[]) => void;
type Invocable = Command | Function;

export interface CommandInstance {
  (...args: unknown[]): void;
  link?: Link;
  [INVOCABLES]: Invocable[];
}

export type Commandable = Function | Command | LinkCommand | Link | CommandInstance;
export type CommandAction = Function | Link | CommandInstance;

const LINK_PROPERTIES = [
  'active',
  'activeWithoutModels',
  'activeWithoutQueryParams',
  'entering',
  'exiting',
  // 'open', // as of `ember-link@3`
  'transitionTo',
  'replaceWith',
  'qualifiedRouteName',
  'url',
  'models',
  'queryParams'
];

function getAllPropertyNames(obj: object) {
  let names: string[] = [];

  do {
    names.push(...Object.getOwnPropertyNames(obj));
    obj = Object.getPrototypeOf(obj);
  } while (obj !== Object.prototype);

  return names.filter((name) => name !== 'constructor');
}

function isLink(commandable: Commandable): commandable is Link {
  // `instanceOf` is not a reliable check, only when the host app runs with
  // embroider. In classic mode, the ember-link instance in the host app and in
  // ember-command addon are different and the check will fail, so this performs
  // some duck-type check
  const props = getAllPropertyNames(commandable);

  // the first check should be sufficient enough, but isn't due to:
  // https://github.com/gossi/ember-command/issues/23
  // so, there is another duck-type check for the link
  return commandable instanceof Link || LINK_PROPERTIES.every((prop) => props.includes(prop));
}

function isCommandInstance(commandable: Commandable): commandable is CommandInstance {
  return Object.getOwnPropertyNames(commandable).includes(INVOCABLES);
}

export function isCommand(commandable: unknown): commandable is Command {
  return (
    (commandable as Command).execute !== undefined &&
    typeof (commandable as Command).execute === 'function'
  );
}

function containsLink(commandable: Commandable) {
  // the correct check would be, the first commented out one, but can't be due to:
  // https://github.com/gossi/ember-command/issues/23
  // if (commandable instanceof Link || commandable instanceof LinkCommand) {
  if (isLink(commandable) || LinkCommand.isLinkCommand(commandable)) {
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

function getLinkCommand(commandable: Commandable) {
  if (LinkCommand.isLinkCommand(commandable)) {
    return commandable;
  }
}

export function createCommandInstance(
  owner: Owner,
  composition: Commandable | Commandable[]
): CommandInstance {
  const commandables = !Array.isArray(composition) ? [composition] : composition;

  // find the (first) link
  const potentialLink = commandables.find((commandable) => {
    return containsLink(commandable);
  });
  const link = potentialLink ? getLink(potentialLink) ?? getLinkCommand(potentialLink) : undefined;

  // keep remaining invocables
  const invocables = commandables.filter(
    (commandable) => isCommand(commandable) || typeof commandable === 'function'
  ) as Invocable[];

  // set owner to commands
  invocables.flatMap((commandable) => {
    // this is failing due to: https://github.com/gossi/ember-command/issues/23
    // if (commandable instanceof Command) {
    if (isCommand(commandable)) {
      setOwner(commandable, owner);
    }

    if (isCommandInstance(commandable)) {
      return commandable[INVOCABLES];
    }

    return commandable;
  });

  const action = function (this: CommandInstance, ...args: unknown[]) {
    for (const fn of invocables) {
      if (isCommand(fn)) {
        fn.execute(...args);
      } else {
        fn(...args);
      }
    }
  };

  (action as CommandInstance)[INVOCABLES] = invocables;

  if (link && LinkCommand.isLinkCommand(link)) {
    const linkManager = owner.lookup('service:link-manager') as LinkManagerService;

    assert(`missing 'service:link-manager' for 'LinkCommand'`, linkManager);
    action.link = linkManager.createLink(link.params);
  } else if (link && isLink(link)) {
    action.link = link;
  }

  return action as CommandInstance;
}

function isCommandable(commandable: unknown): commandable is Commandable {
  return (
    typeof commandable === 'function' ||
    commandable instanceof Command ||
    isCommand(commandable) ||
    commandable instanceof LinkCommand ||
    LinkCommand.isLinkCommand(commandable) ||
    commandable instanceof Link ||
    isLink(commandable as Commandable)
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
