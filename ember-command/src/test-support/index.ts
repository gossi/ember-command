import { assert } from '@ember/debug';
import { setOwner } from '@ember/owner';
import { getContext as upstreamGetContext } from '@ember/test-helpers';
import { isTestContext } from '@ember/test-helpers/setup-context';

import { makeAction } from '../-private/utils';

import type { Command, CommandAction } from '../';
import type { Commandable } from '../-private/commandables';
import type { CommandInstance } from '../-private/utils';
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

  return makeAction((context as TestContext).owner, commandable);
}

/**
 * Use this to prepare a command for integration testing by assigning the
 * owner to the command.
 *
 * @param command The command
 * @returns The command with an assigned owner
 */
export function arrangeCommand(command: Command): Command {
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
  return makeAction(context.owner, commandable);
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
