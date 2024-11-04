import { Command } from 'ember-command';

export default class MutateAction extends Command {
  execute(obj: Record<string, unknown>, change: Record<string, unknown>): void {
    for (const [key, value] of Object.entries(change)) {
      obj[key] = value;
    }
  }
}
