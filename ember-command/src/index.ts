import { Command } from './-private/command';
import { decorator } from './-private/decorator';
import { LinkCommand } from './-private/link-command';
import { commandFor } from './-private/utils';

import type { Commandable } from './-private/commandables';
import type { CommandAction, CommandInstance } from './-private/utils';

export {
  Command,
  decorator as command,
  Commandable,
  CommandAction,
  commandFor,
  CommandInstance,
  LinkCommand
};
