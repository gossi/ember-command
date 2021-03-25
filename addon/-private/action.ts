export class Action<T = unknown> {
  execute(..._args: T[]): void {}
}
