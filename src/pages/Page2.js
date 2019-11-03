import React from 'react';

export default class Page2 extends React.Component {
  static timeout = 2000;
  static priority = 3;

  static isActive() {
    return true;
  }

  render() {
    return <h1>Page 2</h1>
  }
}
