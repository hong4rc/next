import { assertEquals } from 'https://deno.land/std@0.79.0/testing/asserts.ts';

import next from './index.ts';

Deno.test('few minutes less', () => {
  assertEquals(
    next(
      { hour: 3, minute: 3, timezone: 6.5 },
      new Date('Nov 13 2020 03:01:00 GMT+0630'),
    ).toISOString(),
    new Date('Nov 13 2020 03:03:00 GMT+0630').toISOString(),
  );
});
Deno.test('few minutes left over', () => {
  assertEquals(
    next(
      { hour: 3, minute: 3, timezone: 6.5 },
      new Date('Nov 13 2020 03:04:00 GMT+0630'),
    ).toISOString(),
    new Date('Nov 14 2020 03:03:00 GMT+0630').toISOString(),
  );
});
Deno.test('match time', () => {
  assertEquals(
    next(
      { hour: 3, minute: 3, timezone: 6.5 },
      new Date('Nov 13 2020 03:03:00 GMT+0630'),
    ).toISOString(),
    new Date('Nov 14 2020 03:03:00 GMT+0630').toISOString(),
  );
});
