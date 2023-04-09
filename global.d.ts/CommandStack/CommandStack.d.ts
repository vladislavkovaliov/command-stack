export declare abstract class Command<T = any, S = any> {
    abstract execute(state: T): S;
    abstract undo(state: T): S;
}
export declare class CommandStack<S> {
    private stack;
    private _state;
    constructor(state: S);
    get state(): S;
    execute: (command: Command<S>) => Promise<void>;
    undo: () => Promise<void>;
}
