import type command from './helpers/command';

export interface EmberCommandRegistry {
  command: typeof command;
}
