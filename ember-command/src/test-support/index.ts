import { assert } from '@ember/debug';
import { getContext as upstreamGetContext } from '@ember/test-helpers';
import { isTestContext } from '@ember/test-helpers/setup-context';

import { setOwner } from '../-private/-owner';
import { createCommandInstance } from '../-private/instance';

import type { Command, CommandAction } from '../';
import type { Commandable, CommandInstance } from '../-private/instance';
import type { TestContext } from '@ember/test-helpers';

function getContext(): TestContext {
  const context = upstreamGetContext();

  assert(
    'Please setup test context, with either `setupText()`, `setupRenderingTest()` or `setupApplicationTest()`.',
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
 * this.command = arrangeCommandAction(new FooBarCommand());
 * await render(hbs`<CommandElement @command={{this.command}}/>`);
 * ```
 *
 * @param commandable The commandable(s)
 * @returns the prepare command action
 */
export function arrangeCommandInstance(commandable: Commandable | Commandable[]): CommandInstance {
  const context = getContext();

  return createCommandInstance((context as TestContext).owner, commandable);
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

/**
 * Use this to prepare a command for a rendering test putting that command into
 * a component that accepts one.
 *
 * @example
 *
 * ```ts
 * this.command = setupCommandAction(this, new FooBarCommand());
 * await render(hbs`<CommandElement @command={{this.command}}/>`);
 * ```
 *
 * @param context the test context
 * @param commandable The commandable(s)
 * @returns the prepare command action
 * @deprecated use `arrangeCommandAction()` instead
 */
export function prepareCommandAction(
  context: TestContext,
  commandable: Commandable | Commandable[]
): CommandAction {
  return createCommandInstance(context.owner, commandable);
}

/**
 * Use this to prepare a command for integration testing by assigning the
 * owner to the command.
 *
 * @param context the test context
 * @param command The command
 * @returns The command with an assigned owner
 * @deprecated use `arrangeCommand()` instead
 */
export function prepareCommand(context: TestContext, command: Command): Command {
  setOwner(command, context.owner);

  return command;
}

/**
 * Use this to prepare a command for integration testing by assigning the
 * owner to the command.
 *
 * @param context the test context
 * @param commandable Any commandable
 * @returns The commandable with an assigned owner
 * @deprecated use `arrangeCommand()` instead
 */
export function prepareCommandable(context: TestContext, commandable: Commandable): Commandable {
  setOwner(commandable, context.owner);

  return commandable;
}
