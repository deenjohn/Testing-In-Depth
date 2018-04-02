
//foo.js
module.exports = function foo() {};

//foo.test.mockImplementation.js

test('calls callback with arguments added', () => {
  jest.mock('../foo');
  const foo = require('../foo');

  foo.mockImplementation(() => 42);
  //console.log(foo);
  expect(foo()).toBe(42);
});

.........................................



//Test1

const doAdd = (a, b, callback) => {
	let res =callback(a + b);
	console.log(res)
};

test('calls callback with arguments added', () => {
	const mockCallback = jest.fn();
	doAdd(1, 2, mockCallback);
	expect(mockCallback).toHaveBeenCalledWith(3);
});

..................................................................



//math.js
export const add = (a, b) => {
	console.log('add')
	return a + b;
}
export const subtract = (a, b) => b - a;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => b / a;


//mathApp.js

import * as math from './math';

export const doAdd = (a, b) => math.add(a, b);
export const doSubtract = (a, b) => math.subtract(a, b);
export const doMultiply = (a, b) => math.multiply(a, b);
export const doDivide = (a, b) => math.divide(a, b);




//https://medium.com/@rickhanlonii/understanding-jest-mocks-f0046c68e53c



//math.test.jest.mock.js

import * as app from '../mathApp';
import * as math from '../math';

jest.mock('../math');

//jest.mock to automatically set
//all exports of a module to the Mock Function

test('calls math.add', () => {
  app.doAdd(1, 2);
  console.log(math.add);
  expect(math.add).toHaveBeenCalledWith(1, 2);
});

test('calls math.subtract', () => {
  app.doSubtract(1, 2);
  expect(math.subtract).toHaveBeenCalledWith(1, 2);
});
















