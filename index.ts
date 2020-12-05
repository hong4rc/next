const minInHour = 60;
const millisecond = 1000;

interface Input {
  hour?: number;
  minute?: number;
  second?: number;
  timezone?: number;
}

interface ValidInput {
  hour: number;
  minute: number;
  second: number;
  timezone: number;
}

const timezoneOffset = new Date().getTimezoneOffset();
const defaultTimezone = -timezoneOffset / minInHour;

// deno-lint-ignore no-explicit-any
const isObject = (obj: any) => obj === Object(obj);

// deno-lint-ignore no-explicit-any
const validTimezone = (timezone: any) => {
  timezone = timezone ?? defaultTimezone;
  if (typeof timezone !== 'number') {
    throw new TypeError('`timezone` must be number');
  }
  if (Math.abs(timezone) > 12) {
    throw new RangeError(`'timezone' must be >=-12 and <=12`);
  }
  if (!Number.isInteger(timezone * 4)) {
    throw new RangeError(
      `'timezone' must be full, half or quarter, got ${timezone}`,
    );
  }
  return timezone;
};

// deno-lint-ignore no-explicit-any
const validNumber = (field: string, num: any, max: number) => {
  num = num ?? 0;
  if (!Number.isInteger(num)) {
    throw new TypeError(`'${field}' must be number`);
  }
  if (num < 0 || num > max) {
    throw new RangeError(`'${field}' must be >=0 and <=${max}`);
  }
  return num;
};

// deno-lint-ignore no-explicit-any
const validInput = (input: any): ValidInput => {
  if (!isObject(input)) {
    throw new TypeError('`input` must be object');
  }

  const validField = (field: 'hour' | 'minute' | 'second', max: number) => {
    return validNumber(field, input[field], max);
  };
  input = {
    hour: validField('hour', 23),
    minute: validField('minute', 59),
    second: validField('second', 59),
    timezone: validTimezone(input.timezone),
  };
  return input;
};

export default (input: Input, now: Date | number = Date.now()) => {
  const { hour, minute, second, timezone } = validInput(input);
  now = +now;
  if (Number.isNaN(now)) {
    throw new TypeError(`'now' must be numeric`);
  }
  const deltaMin = timezone * minInHour + timezoneOffset;
  const next = new Date(+now - (now % millisecond));
  next.setHours(hour);
  next.setSeconds(second);
  next.setMinutes(minute - deltaMin);
  if (next.getTime() <= now) {
    next.setDate(next.getDate() + 1);
  }
  return next;
};
