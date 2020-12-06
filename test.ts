import {
  assert,
  assertEquals,
  assertNotEquals,
  assertThrows,
} from "https://deno.land/std@0.79.0/testing/asserts.ts";

import next, { Input } from "./index.ts";

const wrongNumber = "wrong" as unknown as number;

const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const validHour = () => random(0, 23);
const validMinute = () => random(0, 59);
const validSecond = validMinute;
const validTimezone = () => random(-12 * 4, 12 * 4) / 4;

const testArray = new Array(100).fill(0, 0);

Deno.test("invalid:input:type", () => {
  assertThrows(
    () => next(undefined as unknown as Input),
    TypeError,
    "`input` must be object",
  );
  assertThrows(
    () => next(null as unknown as Input),
    TypeError,
    "`input` must be object",
  );
  assertThrows(
    () => next("random string" as unknown as Input),
    TypeError,
    "`input` must be object",
  );
});

Deno.test("invalid:input:field type", () => {
  assertThrows(
    () => next({ hour: wrongNumber }),
    TypeError,
    "'hour' must be number",
  );
  assertThrows(
    () => next({ minute: wrongNumber }),
    TypeError,
    "'minute' must be number",
  );
  assertThrows(
    () => next({ second: wrongNumber }),
    TypeError,
    "'second' must be number",
  );
});

Deno.test("invalid:input:field range", () => {
  testArray.forEach(() => {
    assertThrows(
      () => next({ hour: random(24, 99) }),
      RangeError,
      "'hour' must be >=0 and <=23",
    );
    assertThrows(
      () => next({ minute: random(60, 99) }),
      RangeError,
      "'minute' must be >=0 and <=59",
    );
    assertThrows(
      () => next({ second: random(60, 99) }),
      RangeError,
      "'second' must be >=0 and <=59",
    );
  });
});

Deno.test("invalid:timezone:type", () => {
  assertThrows(() => next({ timezone: wrongNumber }), TypeError);
});

Deno.test("invalid:timezone:full, half or quarter", () => {
  assertThrows(() => next({ timezone: 1.4 }), RangeError);
});

Deno.test("invalid:timezone:range", () => {
  assertThrows(() => next({ timezone: -14 }), RangeError);
});

Deno.test("invalid:now:type", () => {
  assertThrows(() => next({}, wrongNumber), TypeError);
});

Deno.test("valid:less", () => {
  assertEquals(
    next(
      { hour: 3, minute: 3, timezone: 6.5 },
      new Date("Nov 13 2020 03:01:00 GMT+0630"),
    ).toISOString(),
    new Date("Nov 13 2020 03:03:00 GMT+0630").toISOString(),
  );
});

Deno.test("valid:left over", () => {
  assertEquals(
    next(
      { hour: 3, minute: 3, timezone: 6.5 },
      new Date("Nov 13 2020 03:04:00 GMT+0630"),
    ).toISOString(),
    new Date("Nov 14 2020 03:03:00 GMT+0630").toISOString(),
  );
});

Deno.test("valid:match", () => {
  assertEquals(
    next(
      { hour: 3, minute: 3, timezone: 6.5 },
      new Date("Nov 13 2020 03:03:00 GMT+0630"),
    ).toISOString(),
    new Date("Nov 14 2020 03:03:00 GMT+0630").toISOString(),
  );
});

Deno.test("valid:any", () => {
  testArray.forEach(() => {
    const now = new Date();
    const nextDate = next(
      {
        hour: validHour(),
        minute: validMinute(),
        second: validSecond(),
        timezone: validTimezone(),
      },
      now,
    );
    assertEquals(nextDate.constructor, Date);
    assertNotEquals(
      nextDate.toString(),
      "Invalid Date",
      "'next' must return valid date",
    );
    assert(nextDate > now);
  });
});
