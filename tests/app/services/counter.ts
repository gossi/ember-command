import { tracked } from '@glimmer/tracking';
import Service from '@ember/service';

export default class CounterService extends Service {
  @tracked counter = 0;
}

declare module '@ember/service' {
  export interface Registry {
    counter: CounterService;
  }
}
