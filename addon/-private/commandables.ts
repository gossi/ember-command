import { UILink } from 'ember-link';

import { Command } from './command';
import { LinkCommand } from './link-command';

export type Commandable = (
  ...args: unknown[]
) => void | Command | LinkCommand | UILink;

export type Invocable = (...args: unknown[]) => void;
