import React from 'react';
//  Each page exports default component that is imported in 
//  Page.js file. Every component have three methods: timeout, priority and isActive.
//
//  - timeout: duration how long page is visible. Given in milliseconds.
//  - priority: how often page tends to show. Accepts any positive real number,
//    should be interpreted as relative to other priority values
//  - isActive: indicates whether component should be shown at all.
//    For example doesn't make much sense to show restaurant's meny after it is closed.
//
//  Page can also have inner state that allows dynamically changing what is shown.
//  See other pages for examples. Below is a minimal working example of page componend 
//  that is show on the information display.

export default class Example extends React.Component {
  static timeout = 2000;
  static priority = 3;

  static isActive() {
    return true;
  }

  render() {
    return <h1>I am page in the information display!</h1>
  }
}
