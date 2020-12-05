# next

> Get coming time after input with hour, minute, second, timezone

## Usage

```js
import next from 'https://deno.land/x/next@0.0.1/index.ts';

next({ hour: 3, minute: 3, timezone: 6.5}, new Date('Nov 13 2020 03:01:00 GMT+0630'))
//=> 2020-11-12T20:33:00.000Z
```

## API

Return coming time after `now` with hour, minute, seconds from `input`

```ts
interface Input {
    hour?: number;
    minute?: number;
    second?: number;
    timezone?: number;
}
next(input: Input, now?: Date | number) => Date
```

#### input

normal `hour`, `minute`, `second` and `timezone`
