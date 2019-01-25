import React from 'react'
import { Link } from 'gatsby'
import LocalizedLink from '@utils/LocalizedLink'

import Layout from '@components/layout'
import Container from '@styles/Container'


const About = ({ pageContext }) => (
  <Layout locale={pageContext.locale}>
    <Container>
      <h1>About us</h1>
      <p>Welcome to your new Gatsby site!</p>
      <LocalizedLink to="/">Go to root page</LocalizedLink>
    </Container>
  </Layout>
);

export default About

