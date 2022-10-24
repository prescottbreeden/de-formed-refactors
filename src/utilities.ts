// --[ fucntional utils ]------------------------------------------------------
export const trim = (value: any) => value.trim();
export const truthy = (value: any) => !!value;
export const pipe =
  (...fns: Function[]) =>
  (arg: any) =>
    fns.reduce((acc, curr) => curr(acc), arg);
export const cond = (predicateFnMatrix: Function[][]) => (arg: any) => {
  for (const [predicate, func] of predicateFnMatrix) {
    if (predicate(arg)) return func(arg);
  }
};
export const typeOf = (type: string) => (value: any) => typeof value === type;
export const length = (value: string | any[]) => value.length;
export const gt = (testVal: number) => (value: number) => value > testVal;
export const lt = (testVal: number) => (value: number) => value < testVal;
export const match = (regExp: RegExp) => (value: string) => regExp.test(value);
export const eq = (a: any) => (b: any) => a === b

/**
 *  @Private
 *  Internal utility function. Takes an argument and if that argument is a
 *  function then it will call it with no parameters, otherwise it will just
 *  return the argument.
 */
export const readValue = <A>(value: A) => {
  return typeof value === 'function' ? value() : value;
};

/**
 *  @Private
 *  Internal utility function.
 */
export const stringIsNotEmpty = (str: string): boolean => {
  return str.trim().length > 0;
};

/**
 * @Private
 * Internal Utility. Function that takes either a string or a function stransforming a form state
 * to a string to generate an error for the validation state.
 */
export const generateError =
  <S>(state: S) =>
  (s: string | ((state: S) => string)) => {
    return typeof s === 'function' ? s(state) : s;
  };

/**
 *  @Private
 *  Internal Utility. Takes an event and extracts either the target.value
 *  property (or the target.checked property if type is 'checkbox') and returns
 *  it as the value of a key of target.name.
 *
 *  This allows for easy event updates by merging the output of this function
 *  with the current state of the form.
 *
 *  @example
 *  input: { target: { name: 'firstName', type: 'text', value: 'bob' } }
 *  output: { firstName: 'bob' }
 *
 *  input: { target: { checked: true, name: 'subscribed', type: 'checkbox' } }
 *  output: { subscribed: true }
 *
 *  [example usage]
 *  const genericOnChange = pipe(
 *    eventNameValue,
 *    merge(formState),
 *    setFormState
 *  )
 */
export const eventNameValue = (
  event: any,
): {
  [key: string]: string | number | boolean;
} => {
  if (event?.target) {
    const { name, checked, type, value } = event.target;
    if (type === 'checkbox') {
      return { [name]: checked };
    } else {
      return { [name]: value };
    }
  }
  throw new Error(
    `"eventNameValue" cannot read event object because it does not have a target property.`,
  );
};
