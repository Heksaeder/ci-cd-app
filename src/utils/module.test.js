import {calculateAge} from './module.js';
/**
 * @function calculateAge
 */
describe('calculateAge Unit Test Suites', () => {
    it('should throw missing param p error', () => {
        expect(() => calculateAge()).toThrow('missing param p');
    });

    it('p is not a valid object', () => {
        expect(() => calculateAge({})).toThrow();
    });

    it('p doesnt have birth property', () => {
        expect(() => calculateAge({name: 'John'})).toThrow();
    });

    it('birth is not a valid date', () => {
        expect(() => calculateAge({birth: 'not a date'})).toThrow();
        expect(() => calculateAge({birth: 12345})).toThrow();
        expect(() => calculateAge({birth: {}})).toThrow();
        expect(() => calculateAge({birth: null})).toThrow();
        expect(() => calculateAge({birth: undefined})).toThrow();
    });
});