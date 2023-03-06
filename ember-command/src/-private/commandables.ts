import type { Command } from './command';
import type { LinkCommand } from './link-command';
import type { Link } from 'ember-link';

export type Invocable = (...args: unknown[]) => void;
export type Commandable = Invocable | Command | LinkCommand | Link;
