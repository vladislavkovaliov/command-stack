export abstract class Command<T = any, S = any> {
    abstract execute(state: T): S;
    abstract undo(state: T): S;
}

export class CommandStack<S> {
    private stack: Command<S>[] = [];
    private _state: S;

    public constructor(state: S) {
        this._state = state;
    }

    get state() {
        return this._state;
    }

    public execute = async (command: Command<S>): Promise<void> => {
        this._state = await command.execute(this._state);
        this.stack.push(command);
    };

    public undo = async (): Promise<void> => {
        const command = this.stack.pop();

        if (command) {
            this._state = await command.undo(this._state);
        }
    };
}
