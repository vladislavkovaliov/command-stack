## Setup commands

### Define simple command
```typescript jsx
export class Increment extends Command<number> {
    private readonly incrementValue: number;

    constructor(incrementValue: number) {
        super();
        this.incrementValue = incrementValue;
    }

    execute(state: number): number {
        return state + this.incrementValue;
    }

    undo(state: number): number {
        return state - this.incrementValue;
    }

}
```
### Define async command
```typescript jsx

export class AsyncIncrement extends Command<Promise<number>> {
    private readonly incrementValue: number;
    public static TIMEOUT_MS = 2000;

    constructor(incrementValue: number) {
        super();
        this.incrementValue = incrementValue;
    }

    async execute(state: Promise<number>): Promise<number> {
        const currentState = await state;

        return new Promise((res) => {
            setTimeout(() => {
                return res(currentState + this.incrementValue);
            }, AsyncIncrement.TIMEOUT_MS);
        })
    }

    async undo(state: Promise<number>): Promise<number> {
        const currentState = await state;

        return currentState - this.incrementValue;
    }
}
```

## Usage

```typescript jsx

import { CommandStack, Command } from "command-stack-pattern";

const cs = new CommandStack<number>(0); // simple
await cs.execute(new Increment(1)); // state = 1

const csAsync = new CommandStack<Promise<number>>(Promise.resolve(0)); // async
await csAsync.execute(new AsyncIncrement(1)); // state = 1 after 2000ms


```