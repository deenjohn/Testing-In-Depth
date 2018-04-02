

//please refer below 2 links before going through the test 

//https://github.com/facebook/jest/blob/e9aa321e0587d0990bd2b5ca5065e84a1aecb2fa/packages/jest-mock/src/index.js#L674-L708

//https://medium.com/@rickhanlonii/understanding-jest-mocks-f0046c68e53c




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

//Test2 - jest.mock

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


//math.test.jest.mock.js

//Test2.1

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




// Test2.2

import * as app from '../mathApp';
import * as math from '../math';

test('calls math.add', () => {
  const addMock = jest.spyOn(math, 'add');

  // calls the original implementation
  expect(app.doAdd(1, 2)).toEqual(3);

  // and the spy stores the calls to add
  expect(addMock).toHaveBeenCalledWith(1, 2);
});

//Test2.3

import * as app from '../mathApp';
import * as math from '../math';

test("calls math.add", () => {
  const addMock = jest.spyOn(math, "add");

  // override the implementation
  addMock.mockImplementation(() => "mock");
  expect(app.doAdd(1, 2)).toEqual("mock");

  // restore the original implementation
  addMock.mockRestore();
  expect(app.doAdd(1, 2)).toEqual(3);
});



..............................................

//Test1 - understanding jest mock

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


