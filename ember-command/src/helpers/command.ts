// import Helper from '@ember/component/helper';
import { capabilities, setHelperManager } from '@ember/helper';

import { decorate } from '../-private/decorator';
// import { getOwner } from '../-private/-owner';
import { createCommandInstance } from '../-private/instance';

import type { Commandable, CommandInstance } from '../-private/instance';
import type Owner from '@ember/owner';
import type { HelperCapabilities } from '@glimmer/interfaces';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NonInstanceType<K> = K extends InstanceType<any> ? object : K;
type DecoratorKey<K> = K extends string | symbol ? K : never;

interface Args {
  positional: unknown;
  named: object;
}

type CommandHelperSignature = (
  commandables: Commandable | Commandable[],
  owner: Owner
) => CommandInstance;

class CommandHelperManager {
  capabilities: HelperCapabilities = capabilities('3.23', {
    hasValue: true
  });

  constructor(private owner: Owner | undefined) {}

  createHelper(fn: CommandHelperSignature, args: Args) {
    return { fn, args };
  }

  getValue({ fn, args }: { fn: CommandHelperSignature; args: Args }) {
    return fn(args.positional as Commandable[], this.owner as Owner);
  }
}

interface DecoratorPropertyDescriptor extends PropertyDescriptor {
  initializer?(): unknown;
}

export default function command(...commandables: Commandable[]): CommandInstance;

/**
 * The `@use` decorator can be used to use a Resource in javascript classes
 *
 * ```js
 * import { command } from 'ember-resources';
 *
 * class MyC {
 *   @command data = Clock;
 * }
 *
 * ```
 */
export default function command<Prototype, Key>(
  prototype: NonInstanceType<Prototype>,
  key: DecoratorKey<Key>,
  descriptor?: DecoratorPropertyDescriptor
): void;

// commandables: Commandable[] | object,
//   key?: string | symbol | Owner,
//   desc?: DecoratorPropertyDescriptor

export default function command(
  ...args: Parameters<typeof decorate> | [Owner, ...Commandable[]] | Commandable[]
): void | CommandInstance {
  if (
    args.length === 3 &&
    ((args[2] as DecoratorPropertyDescriptor).get ||
      (args[2] as DecoratorPropertyDescriptor).initializer)
  ) {
    return decorate(
      args[0],
      args[1] as string | symbol,
      args[2] as DecoratorPropertyDescriptor
    ) as unknown as void;
  }

  return createCommandInstance(args[0] as Owner, args.slice(1) as Commandable[]);

  // if (key && desc && (desc.get || desc.initializer)) {
  //   return decorate(undefined, key as string | symbol, desc) as unknown as void;
  // }

  // return createCommandInstance(key as Owner, commandables as Commandable[]);
}

setHelperManager((owner) => new CommandHelperManager(owner as Owner), command);
