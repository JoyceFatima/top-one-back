import { capitalize } from './string.funcs';

describe('capitalize', () => {
  it('should capitalize the first letter of a string', () => {
    const input = 'hello';
    const result = capitalize(input);
    expect(result).toBe('Hello');
  });

  it('should handle an empty string', () => {
    const input = '';
    const result = capitalize(input);
    expect(result).toBe('');
  });

  it('should not affect strings that are already capitalized', () => {
    const input = 'Hello';
    const result = capitalize(input);
    expect(result).toBe('Hello');
  });

  it('should capitalize the first letter and leave the rest of the string unchanged', () => {
    const input = 'hELLO';
    const result = capitalize(input);
    expect(result).toBe('HELLO');
  });

  it('should work with single-character strings', () => {
    const input = 'h';
    const result = capitalize(input);
    expect(result).toBe('H');
  });
});
