export abstract class Command {
  abstract execute(..._args: unknown[]): void;
}
