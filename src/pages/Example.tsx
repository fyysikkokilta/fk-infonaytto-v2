import React, { useEffect } from 'react'
import { PageProps } from '../types'
//  Each page exports component that is imported in 
//  Page.js file. Every component should have two function exported:
//
//  - name: name of the page. Used for CSS transition class names.
//  - priority: how often page tends to show. Accepts any positive real number,
//    should be interpreted as relative to other priority values
//  - isActive: indicates whether component should be shown at all.
//    For example doesn't make much sense to show restaurant's meny after it is closed.
//
//  Next page is shown with showNext prop. It is function that takes no arguments.
//  It is recommended to use it with useEffect hook to show next page after some time.
//
//  Page can also have inner state that allows dynamically changing what is shown.
//  See other pages for examples. Below is a minimal working example of page componend 
//  that is show on the information display.

const Example = ({ showNext }: PageProps) => {
  useEffect(() => {
    showNext(3000)
  }, [])
  return <h1>I am page in the information display!</h1>
}

const exportObject = { name: 'Example', priority: 1, isActive: () => true, component: Example }

export default exportObject
