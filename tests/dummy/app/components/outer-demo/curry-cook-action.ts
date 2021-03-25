import { Action } from 'ember-actionables'

export default class CurryCookAction extends Action {
  execute(curry: string) {
    console.log(`cooking ${curry} curry`);
  }
}
