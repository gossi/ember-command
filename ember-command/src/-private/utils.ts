import { assert } from '@ember/debug';
import { setOwner } from '@ember/owner';

import { Link } from 'ember-link';

import { Command } from './command';
import { LinkCommand } from './link-command';

import type { Commandable, Invocable } from './commandables';
import type Owner from '@ember/owner';
import type LinkManagerService from 'ember-link/services/link-manager';

type InvocableCommandable = Command | Invocable;

export interface CommandInstance {
  (...args: unknown[]): void;
  link?: Link;
}

export type CommandAction = Invocable | Link | CommandInstance;

export function makeAction(
  owner: Owner,
  composition: Commandable | Commandable[]
): CommandInstance {
  const commandables = !Array.isArray(composition) ? [composition] : composition;

  // find the (first) link
  const link = commandables.find((commandable) => {
    console.log(
      'link',
      commandable instanceof Link,
      'link command',
      commandable instanceof LinkCommand,
      commandable
    );

    return commandable instanceof Link || commandable instanceof LinkCommand;
  }) as unknown as Link | LinkCommand;

  // keep remaining invocables
  const invocables = commandables.filter(
    (commandable) => commandable instanceof Command || typeof commandable === 'function'
  ) as InvocableCommandable[];

  // set owner to commands
  invocables.map((commandable) => {
    if (commandable instanceof Command) {
      setOwner(commandable, owner);
    }

    return commandable;
  });

  const action = (...args: unknown[]) => {
    const invocations = [];

    for (const fn of invocables) {
      if (fn instanceof Command) {
        invocations.push(fn.execute(...args));
      } else {
        invocations.push(fn(...args));
      }
    }

    return Promise.all(invocations);
  };

  if (link instanceof LinkCommand) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const linkManager = owner.lookup('service:link-manager') as LinkManagerService;

    assert(`missing 'service:link-manager' for 'LinkCommand'`, linkManager);
    action.link = linkManager.createUILink(link.params) as Link;
  } else if (link instanceof Link) {
    action.link = link;
  }

  return action;
}

function isCommandable(commandable: unknown) {
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
