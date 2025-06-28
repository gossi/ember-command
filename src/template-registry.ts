import type CommandElement from './components/command-element.gts';
import type command from './helpers/command.ts';

export default interface EmberCommandRegistry {
  command: typeof command;
  CommandElement: typeof CommandElement;
}
