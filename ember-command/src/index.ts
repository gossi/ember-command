import { action } from './-private/action';
import { Command } from './-private/command';
import { commandFor } from './-private/instance';
import { LinkCommand } from './-private/link-command';
import CommandElement from './components/command-element';
import command from './helpers/command';

import type { Commandable, CommandAction, CommandInstance } from './-private/instance';

export { action, Command, command, CommandElement, commandFor, LinkCommand };

export type { Commandable, CommandAction, CommandInstance };
