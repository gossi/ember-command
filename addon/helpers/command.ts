import { getOwner } from '@ember/application';
import Helper from '@ember/component/helper';

import { CommandInstance, makeAction } from 'ember-command';

import { Commandable } from '../-private/commandables';

export default class Substring extends Helper {
  compute(commands: Commandable[]): CommandInstance {
    return makeAction(getOwner(this), commands);
  }
}
