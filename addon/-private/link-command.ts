import { LinkParams, UILinkParams } from 'ember-link';

export class LinkCommand {
  params: LinkParams & UILinkParams;
  constructor(params: LinkParams & UILinkParams) {
    this.params = params;
  }
}
