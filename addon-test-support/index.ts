import { TestContext } from '@ember/test-helpers';

import { setOwner } from '@ember/application';

import { CommandAction, makeAction } from 'ember-command';
import { Command } from 'ember-command/-private/command';

import { Commandable } from '../addon/-private/commandables';

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
 */
export function prepareCommand(
  context: TestContext,
  command: Command
): Command {
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
 */
export function prepareCommandable(
  context: TestContext,
  commandable: Commandable
): Commandable {
  setOwner(commandable, context.owner);
  return commandable;
}
