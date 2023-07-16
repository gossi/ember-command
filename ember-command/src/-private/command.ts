export abstract class Command {
  abstract execute(...args: unknown[]): void;
}
