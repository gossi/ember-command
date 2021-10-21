import { Link } from 'ember-link';

import { Command } from './command';
import { LinkCommand } from './link-command';

export type Invocable = (...args: unknown[]) => void;
export type Commandable = Invocable | Command | LinkCommand | Link;
