import 'ember-source/types';
import 'ember-source/types/preview';
import '@glint/environment-ember-loose';
import '@glint/environment-ember-template-imports';

import type EmberCommandRegistry from 'ember-command/template-registry';
import type EmberLinkRegistry from 'ember-link/template-registry';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry extends EmberCommandRegistry, EmberLinkRegistry {
    // local entries
  }
}
