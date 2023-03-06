import Helper from '@ember/component/helper';
import { getOwner } from '@ember/owner';

import { makeAction } from '../-private/utils';

import type { CommandInstance } from '../';
import type { Commandable } from '../-private/commandables';
import type Owner from '@ember/owner';

export interface CommandHelperSignature {
  Args: {
    Positional: Commandable[];
  };
  Return: CommandInstance;
}

export default class CommandHelper extends Helper<CommandHelperSignature> {
  compute(commands: Commandable[]): CommandInstance {
    return makeAction(getOwner(this) as Owner, commands);
  }
}
