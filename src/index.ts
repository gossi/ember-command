/**
 * Implement your Business Logic. Use the cqs pattern.
 *
 * @see https://gossi.github.io/ember-command
 * @module ember-command
 */

export { type Action, action } from './-private/action.ts';
export { Command } from './-private/command.ts';
export {
  type Commandable,
  type CommandAction,
  commandFor,
  type CommandInstance
} from './-private/instance.ts';
export { LinkCommand } from './-private/link-command.ts';
export { default as CommandElement, type CommandSignature } from './components/command-element.gts';
export { default as command } from './helpers/command.ts';
