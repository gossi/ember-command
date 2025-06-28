import { assert } from '@ember/debug';
import { getContext as upstreamGetContext } from '@ember/test-helpers';
import { isTestContext } from '@ember/test-helpers/setup-context';

import { setOwner } from '../-private/-owner.ts';
import { createCommandInstance } from '../-private/instance.ts';

import type { Commandable, CommandInstance } from '../-private/instance.ts';
import type { TestContext } from '@ember/test-helpers';

function getContext(): TestContext {
  const context = upstreamGetContext();

  assert(
    'Please setup test context, with either `setupText()`, `setupRenderingTest()` or `setupApplicationTest()`.',
    // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
    isTestContext(context as object)
  );

  return context as TestContext;
}

/**
 * Use this to prepare a command for a rendering test putting that command into
 * a component that accepts one.
 *
 * @example
 *
 * ```ts
 * this.command = arrangeCommandInstance(new FooBarCommand());
 * await render(hbs`<CommandElement @command={{this.command}}/>`);
 * ```
 *
 * @param commandable The commandable(s)
 * @returns the command instance
 */
export function arrangeCommandInstance(commandable: Commandable | Commandable[]): CommandInstance {
  const context = getContext();

  return createCommandInstance(context.owner, commandable);
}

/**
 * Use this to prepare a command for integration testing by assigning the
 * owner to the command.
 *
 * @param command The command
 * @returns The command with an assigned owner
 */
export function arrangeCommand<C extends Commandable>(command: C): C {
  const context = getContext();

  setOwner(command, context.owner);

  return command;
}
