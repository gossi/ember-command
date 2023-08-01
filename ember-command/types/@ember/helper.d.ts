declare module '@ember/helper' {
  import {
    helperCapabilities,
    setHelperManager as glimmerSetHelperManager
  } from '@glimmer/manager';

  // export const setHelperManager = glimmerSetHelperManager;
  // export const capabilities = helperCapabilities;

  export { helperCapabilities as capabilities, glimmerSetHelperManager as setHelperManager };
}
