import type { LinkParams } from 'ember-link';

// see: https://github.com/gossi/ember-command/issues/23
// const LINK_COMMAND = Symbol('LinkCommand');
const LINK_COMMAND = '__LinkCommand__';

export class LinkCommand {
  [LINK_COMMAND] = true;

  params: LinkParams;

  constructor(params: LinkParams) {
    this.params = params;
  }

  /**
   * This check exists because of:
   * https://github.com/gossi/ember-command/issues/23
   */
  static isLinkCommand(other: unknown): other is LinkCommand {
    return Object.getOwnPropertyNames(other).includes(LINK_COMMAND);
  }
}
