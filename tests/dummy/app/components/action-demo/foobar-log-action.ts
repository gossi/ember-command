import { Action } from 'ember-actionables';

export default class FooBarLogAction extends Action {
  execute() {
    console.log('foobar');
  }
}
