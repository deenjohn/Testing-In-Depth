

//please refer below links before going through the test 

//https://github.com/facebook/jest/blob/e9aa321e0587d0990bd2b5ca5065e84a1aecb2fa/packages/jest-mock/src/index.js#L674-L708

//https://medium.com/@rickhanlonii/understanding-jest-mocks-f0046c68e53c

// https://blog.kentcdodds.com/but-really-what-is-a-javascript-mock-10d060966f7d


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


//thumb-war.js

import { getWinner } from './utils';

function thumbWar(player1, player2) {
  const numberToWin = 2;
  let player1Wins = 0;
  let player2Wins = 0;
  while (player1Wins < numberToWin && player2Wins < numberToWin) {
    const winner = getWinner(player1, player2);
    if (winner === player1) {
      player1Wins++;
    } else if (winner === player2) {
      player2Wins++;
    }
  }
  return player1Wins > player2Wins ? player1 : player2;
}

export default thumbWar;


//utils.js

function getWinner(player1, player2) {
  const winningNumber = Math.random();
  return winningNumber < 1 / 3
    ? player1
    : winningNumber < 2 / 3 ? player2 : null;
}

export { getWinner };


//mock-test1.js

import thumbWar from '../thumb-war';
import * as utils from '../utils';

test('returns winner', () => {
  const originalGetWinner = utils.getWinner;

  utils.getWinner = (p1, p2) => p2;
  
  const winner = thumbWar('Ken Wheeler', 'Kent C. Dodds');
  expect(winner).toBe('Kent C. Dodds');

  utils.getWinner = originalGetWinner;
});


//mock-test2.js

import thumbWar from '../thumb-war';
import * as utils from '../utils';

test('returns winner', () => {
  const originalGetWinner = utils.getWinner;

  utils.getWinner = (...args) => {
    utils.getWinner.mock.calls.push(args);
    return args[1];
  };
  utils.getWinner.mock = { calls: [] };

  const winner = thumbWar('Ken Wheeler', 'Kent C. Dodds');

  expect(winner).toBe('Kent C. Dodds');
  expect(utils.getWinner.mock.calls).toHaveLength(2);

  utils.getWinner.mock.calls.forEach(args => {
    expect(args).toEqual(['Ken Wheeler', 'Kent C. Dodds']);
  });

  utils.getWinner = originalGetWinner;
});


//mock.test3.js

import thumbWar from '../thumb-war';
import * as utils from '../utils';

test('returns winner', () => {
  const originalGetWinner = utils.getWinner;

	utils.getWinner = jest.fn((p1, p2) => p2);
	
  const winner = thumbWar('Ken Wheeler', 'Kent C. Dodds');

  expect(winner).toBe('Kent C. Dodds');
  expect(utils.getWinner).toHaveBeenCalledTimes(2);

  utils.getWinner.mock.calls.forEach(args => {
    expect(args).toEqual(['Ken Wheeler', 'Kent C. Dodds']);
  });

  utils.getWinner = originalGetWinner;
});



//mock.test4.js

import thumbWar from '../thumb-war';
import * as utils from '../utils';

test('returns winner', () => {
  jest.spyOn(utils, 'getWinner');

  utils.getWinner.mockImplementation((p1, p2) => p2);

  const winner = thumbWar('Ken Wheeler', 'Kent C. Dodds');

  expect(winner).toBe('Kent C. Dodds');
  utils.getWinner.mockRestore();
});




//mock.test5.js


import thumbWar from '../thumb-war';
import * as utilsMock from '../utils2';

jest.mock('../utils');

test('returns winner', () => {

	const winner = thumbWar('Ken Wheeler', 'Kent C. Dodds');
  expect(winner).toBe('Kent C. Dodds');
  expect(utilsMock.getWinner).toHaveBeenCalledTimes(2);

	utilsMock.getWinner.mock.calls.forEach(args => {
    expect(args).toEqual(['Ken Wheeler', 'Kent C. Dodds']);

	});

});













............................................
//snapshot testing 

//ActionLink.js

import React from 'react';

class ActionLink extends React.Component {
  render() {
    return <button onClick={this.props.onToggle}>Click me</button>;
  }
}

export default ActionLink;


//ActionLink.test.js

import React from 'react';
import { mount, render } from 'enzyme';
import ActionLink from '../ActionLink';

test('renders correctly', () => {
  const onToggle = jest.fn();
  const wrapper = mountToggle({
    onToggle
  });

  wrapper.find('button').simulate('click');
  expect(onToggle).toHaveBeenCalledTimes(1);
});

function mountToggle(props = {}) {
  const propsToUse = Object.assign(
    {
      onToggle() {}
    },
    props
  );
  return mount(<ActionLink {...propsToUse} />);
}










