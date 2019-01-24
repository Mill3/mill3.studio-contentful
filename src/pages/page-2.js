import React from 'react'
import { Link, graphql } from 'gatsby'

import Layout from '../components/layout'

const SecondPage = ({ pageContext }) => (
  <Layout>
    <h1>Page two { pageContext.locale } !</h1>
    <p>Welcome to your new Gatsby site!</p>
    <Link to="/">Go to root page</Link>
  </Layout>
);

export default SecondPage

