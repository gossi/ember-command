import { setOwner } from '@ember/application';

import { Command, CommandAction, makeAction } from 'ember-command';
import { Commandable } from 'ember-command/-private/commandables';
import { TestContext } from 'ember-test-helpers';

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