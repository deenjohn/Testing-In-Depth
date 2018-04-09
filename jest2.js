
//reference 
//https://www.robinwieruch.de/react-testing-tutorial/
// https://facebook.github.io/jest/docs/en/tutorial-async.html
// https://facebook.github.io/jest/docs/en/jest-object.html#jestspyonobject-methodname

//https://medium.com/@boriscoder/the-hidden-power-of-jest-matchers-f3d86d8101b0
// https://medium.com/@7ynk3r/react-testing-done-right-24fdb4ef43d8

// component to be tested

import React, { Component } from 'react';
import axios from 'axios';

export const doIncrement = (prevState) => ({
  counter: prevState.counter + 1,
});

export const doDecrement = (prevState) => ({
  counter: prevState.counter - 1,
});

class App2 extends Component {
  constructor() {
    super();

    this.state = {
      counter: 0,
      asyncCounters: null,
    };

    this.onIncrement = this.onIncrement.bind(this);
    this.onDecrement = this.onDecrement.bind(this);
  }

  componentDidMount() {
    axios.get('http://mydomain/counter')
      .then(counter => this.setState({ asyncCounters: counter }))
      .catch(error => console.log(error));
  }

  onIncrement() {
    this.setState(doIncrement);
  }

  onDecrement() {
    this.setState(doDecrement);
  }

  render() {
    const { counter } = this.state;

    return (
      <div>
        <h1>My Counter</h1>
        <Counter counter={counter} />

        <button
          type="button"
          onClick={this.onIncrement}
        >
          Increment
        </button>

        <button
          type="button"
          onClick={this.onDecrement}
        >
          Decrement
        </button>
      </div>
    );
  }
}

export const Counter = ({ counter }) =>
  <p>{counter}</p>

export default App2;


................................
//testing  Component


import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount, render } from 'enzyme';

import App2, { Counter, doIncrement, doDecrement } from '../App2';

describe('doIncrement-doDecrement', () => {
  test('should increment the counter in state', () => {
    const state = { counter: 0 };
    const newState = doIncrement(state);
    //console.log(newState);
    expect(newState.counter).toBe(1);
  });

  test('should decrement the counter in state', () => {
    const state = { counter: 0 };
    const newState = doDecrement(state);

    expect(newState.counter).toBe(-1);
  });
});

describe('Counter Snapshot', () => {
  test('renders', () => {
    const wrapper = shallow(<Counter counter={1} />);
    //let tree = component.toJSON();
    expect(wrapper).toMatchSnapshot();
  });
});

describe('App Component', () => {
  test('renders the Counter wrapper', () => {
    const wrapper = shallow(<App2 />);
    expect(wrapper.find(Counter).length).toBe(1);
  });

  test('App.Button', () => {
    const wrapper = shallow(<App2 />);
    expect(wrapper.find('button').length).toBe(2);
  });

  test('passes all props to Counter wrapper', () => {
    const wrapper = shallow(<App2 />);
    let counterWrapper = wrapper.find(Counter);

    expect(counterWrapper.props().counter).toBe(0);

    wrapper.setState({ counter: -1 });

    counterWrapper = wrapper.find(Counter);
    expect(counterWrapper.props().counter).toBe(-1);
  });

  test('increments the counter', () => {
    const wrapper = mount(<App2 />);

    wrapper.setState({ counter: 0 });

    expect(
      wrapper
        .find('button')
        .first()
        .html()
        .includes('Increment')
    ).toBe(true);

    wrapper
      .find('button')
      .first()
      .simulate('click');

    expect(wrapper.state().counter).toBe(1);
  });

  test('decrements the counter', () => {
    const wrapper = mount(<App2 />);

    wrapper.setState({ counter: 0 });

    expect(
      wrapper
        .find('button')
        .last()
        .html()
        .includes('Decrement')
    ).toBe(true);

    wrapper
      .find('button')
      .last()
      .simulate('click');

    expect(wrapper.state().counter).toBe(-1);
  });

  test('calls componentDidMount', () => {
    jest.spyOn(App2.prototype, 'componentDidMount');

    const wrapper = mount(<App2 />);
    
    expect(App2.prototype.componentDidMount).toHaveBeenCalledTimes(1);
  });
});


//testing  Component Async behaviour


import React from 'react';
import renderer from 'react-test-renderer';
import axios from 'axios';
import { shallow, mount, render } from 'enzyme';

import App2 from '../App2';

describe('App Async', () => {
  const result = [3, 5, 9];
  const promise = Promise.resolve(result);
  let spy;
  beforeEach(() => {
    spy = jest.spyOn(axios, 'get').mockImplementation(() => promise);
  });

  afterEach(() => {
    spy.mockReset();
    spy.mockRestore();
  });

  test('fetches async counters', async () => {
    const wrapper = mount(<App2 />);

		expect(wrapper.state().asyncCounters).toBeNull();

    let res = await promise;
    expect(wrapper.state().asyncCounters).toEqual(result);

    //expect(wrapper.state().asyncCounters).toBeNull();
  });
});









