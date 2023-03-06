import {
  getContext as upstreamGetContext,
  TestContext
} from '@ember/test-helpers';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { isTestContext } from '@ember/test-helpers/setup-context';

import { setOwner } from '@ember/application';
import { assert, deprecate } from '@ember/debug';

import { CommandAction, makeAction, CommandInstance } from 'ember-command';
import { Command } from 'ember-command/-private/command';

import { Commandable } from '../addon/-private/commandables';

function getContext(): TestContext {
  const context = upstreamGetContext();

  assert(
    'Please setup test context, with either `setupText()`, `setupRenderingTest()` or `setupApplicationTest()`.',
    // eslint-disable-next-line @typescript-eslint/ban-types
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
export function arrangeCommandInstance(
  commandable: Commandable | Commandable[]
): CommandInstance {
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
 * @deprecated use `arrangeCommandInstance()` instead
 */
export function prepareCommandAction(
  context: TestContext,
  commandable: Commandable | Commandable[]
): CommandAction {
  deprecate(
    '`prepareCommandAction()` is deprecated. Use `arrangeCommandInstance()` instead.',
    false,
    {
      id: 'ember-command.test-support',
      until: '2.0.0',
      for: 'ember-command',
      since: {
        available: '1.1.0',
        enabled: '1.1.0'
      }
    }
  );
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
export function prepareCommand(
  context: TestContext,
  command: Command
): Command {
  deprecate(
    '`prepareCommand()` is deprecated. Use `arrangeCommand()` instead.',
    false,
    {
      id: 'ember-command.test-support',
      until: '2.0.0',
      for: 'ember-command',
      since: {
        available: '1.1.0',
        enabled: '1.1.0'
      }
    }
  );

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
export function prepareCommandable(
  context: TestContext,
  commandable: Commandable
): Commandable {
  deprecate(
    '`prepareCommandable()` is deprecated. Use `arrangeCommand()` instead.',
    false,
    {
      id: 'ember-command.test-support',
      until: '2.0.0',
      for: 'ember-command',
      since: {
        available: '1.1.0',
        enabled: '1.1.0'
      }
    }
  );

  setOwner(commandable, context.owner);

  return commandable;
}
