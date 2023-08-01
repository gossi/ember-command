import type CommandElement from './components/command-element';
import type command from './helpers/command';

export default interface EmberCommandRegistry {
  command: typeof command;
  CommandElement: typeof CommandElement;
}
