import React from 'react';

export default class Page1 extends React.Component {
  static timeout = 2000;
  static priority = 3;

  static isActive() {
    return true;
  }

  render() {
    return <h1>Page 1</h1>
  }
}
