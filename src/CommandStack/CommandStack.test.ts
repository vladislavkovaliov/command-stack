import {CommandStack, Command} from "./CommandStack";

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

describe('[CommandStack.ts]', () => {

    describe('sync calling execute()', () => {
        test('should increment state', async () => {
            const cs = new CommandStack<number>(0);

            expect(cs.state).toEqual(0);

            await cs.execute(new Increment(1));
            expect(cs.state).toEqual(1);

            await cs.execute(new Increment(1));
            expect(cs.state).toEqual(2);
        });

        test('should increment and call undo()', async () => {
            const cs = new CommandStack<number>(0);

            expect(cs.state).toEqual(0);

            await cs.execute(new Increment(1));
            expect(cs.state).toEqual(1);

            await cs.execute(new Increment(1));
            await cs.undo();

            expect(cs.state).toEqual(1);
        });
    });

    describe('async', () => {
        test('async calling execute()', async () => {
            const cs = new CommandStack<Promise<number>>(Promise.resolve(0));

            await cs.execute(new AsyncIncrement(1));
            expect(await cs.state).toEqual(1);

            await cs.execute(new AsyncIncrement(1));
            expect(await cs.state).toEqual(2);
        });

        test('async calling and undo execute()', async () => {
            const cs = new CommandStack<Promise<number>>(Promise.resolve(0));

            await cs.execute(new AsyncIncrement(1));
            expect(await cs.state).toEqual(1);

            await cs.execute(new AsyncIncrement(1));
            await cs.undo();

            expect(await cs.state).toEqual(1);
        });
    });
})