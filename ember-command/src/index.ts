import { Command } from './-private/command';
// import { decorator } from './-private/decorator';
import { commandFor } from './-private/instance';
import { LinkCommand } from './-private/link-command';
import command from './helpers/command';

import type { Commandable, CommandAction, CommandInstance } from './-private/instance';

export { Command, command, commandFor, LinkCommand };

export type { Commandable, CommandAction, CommandInstance };
