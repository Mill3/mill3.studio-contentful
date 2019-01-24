import React from 'react'
import { Link } from 'gatsby'
import LocalizedLink from '@utils/LocalizedLink'

import Layout from '../components/layout'

const SecondPage = ({ pageContext }) => (
  <Layout locale={pageContext.locale}>
    <h1>Page two { pageContext.locale } !</h1>
    <p>Welcome to your new Gatsby site!</p>
    <LocalizedLink to="/">Go to root page</LocalizedLink>
  </Layout>
);

export default SecondPage

