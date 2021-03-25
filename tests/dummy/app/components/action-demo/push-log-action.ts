import { Action } from 'ember-actionables';

export default class PushLogAction extends Action {
  execute() {
    console.log('puuuushed');
  }
}
