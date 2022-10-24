import startCase from 'lodash.startcase';
import { ValidationAutoProp } from './types';
import {
  cond,
  eq,
  gt,
  length,
  lt,
  match,
  pipe,
  trim,
  truthy,
  typeOf,
} from './utilities';

// --[ errors ]----------------------------------------------------------------
const err = (error: string) => (recieved: any) => {
  throw new Error(`${error} but received ${recieved}`);
};
const longerThanError = err('longerThan must be used on a string');
const shorterThanError = err('shorterThan must be used on a string');
const matchesError = err('matches must be used on a string');
const minError = err('min requires a number representation');
const maxError = err('max requires a number representation');

/**
 * Auto-Prop function to generate a required validation.
 * Returns false when value is null, undefined, or empty string
 */
export const required = (error?: string): ValidationAutoProp => ({
  auto: true,
  prop: <S>(prop: keyof S) => ({
    error: error || `${startCase(prop as string)} is required.`,
    validation: (data: S): boolean =>
      cond([
        [eq(null), () => false],
        [eq(undefined), () => false],
        [typeOf('string'), pipe(trim, truthy)],
        [() => true, () => true],
      ])(data[prop]),
  }),
});

/**
 * Auto-Prop function to generate a regex validation.
 */
export const matches = (regex: RegExp, error?: string): ValidationAutoProp => ({
  auto: true,
  prop: <S>(prop: keyof S) => ({
    error: error || `${startCase(prop as string)} is invalid.`,
    validation: (data: S): boolean =>
      cond([
        [typeOf('string'), match(regex)],
        [() => true, matchesError],
      ])(data[prop]),
  }),
});

/**
 * Auto-Prop function to generate a longerThan validation.
 */
export const longerThan = (
  len: number,
  error?: string,
): ValidationAutoProp => ({
  auto: true,
  prop: <S>(prop: keyof S) => ({
    error:
      error ||
      `${startCase(prop as string)} must be more than ${len} characters.`,
    validation: (data: S): boolean =>
      cond([
        [typeOf('string'), pipe(trim, length, gt(len))],
        [typeOf('array'), pipe(length, gt(len))],
        [() => true, longerThanError],
      ])(data[prop]),
  }),
});

/**
 * Auto-Prop function to generate a longerThan validation.
 */
export const shorterThan = (
  len: number,
  error?: string,
): ValidationAutoProp => ({
  auto: true,
  prop: <S>(prop: keyof S) => ({
    error:
      error ||
      `${startCase(prop as string)} must be fewer than ${len} characters.`,
    validation: (data: S): boolean =>
      cond([
        [typeOf('string'), pipe(trim, length, lt(len))],
        [typeOf('array'), pipe(length, lt(len))],
        [() => true, shorterThanError],
      ])(data[prop]),
  }),
});

export const min = (value: number, error?: string): ValidationAutoProp => ({
  auto: true,
  prop: <S>(prop: keyof S) => ({
    error:
      error || `${startCase(prop as string)} must be greater than ${value}.`,
    validation: (data: S): boolean =>
      cond([
        [typeOf('number'), gt(value - 1)],
        [pipe(Number, isNaN, (x: boolean) => !x), pipe(Number, gt(value - 1))],
        [() => true, minError],
      ])(data[prop]),
  }),
});

export const max = (value: number, error?: string): ValidationAutoProp => ({
  auto: true,
  prop: <S>(prop: keyof S) => ({
    error: error || `${startCase(prop as string)} must be less than ${value}.`,
    validation: (data: S): boolean =>
      cond([
        [typeOf('number'), lt(value + 1)],
        [pipe(Number, isNaN, (x: boolean) => !x), pipe(Number, gt(value - 1))],
        [() => true, maxError],
      ])(data[prop]),
  }),
});

export const is = (
  value: any | ((x: any) => boolean),
  error?: string,
): ValidationAutoProp => ({
  auto: true,
  prop: <S>(prop: keyof S) => ({
    error: error || `${startCase(prop as string)} must be ${value}.`,
    validation: (data: S): boolean =>
      typeof value === 'function' ? value(data[prop]) : data[prop] === value,
  }),
});
