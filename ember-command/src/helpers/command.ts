import Helper from '@ember/component/helper';
import { getOwner } from '@ember/owner';

import { createCommandInstance } from '../-private/instance';

import type { Commandable, CommandInstance } from '../-private/instance';
import type Owner from '@ember/owner';

export interface CommandHelperSignature {
  Args: {
    Positional: Commandable[];
  };
  Return: CommandInstance;
}

export default class CommandHelper extends Helper<CommandHelperSignature> {
  compute(commands: Commandable[]): CommandInstance {
    return createCommandInstance(getOwner(this) as Owner, commands);
  }
}
