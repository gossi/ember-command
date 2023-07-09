import type { LinkParams } from 'ember-link';

export class LinkCommand {
  params: LinkParams;
  constructor(params: LinkParams) {
    this.params = params;
  }
}
