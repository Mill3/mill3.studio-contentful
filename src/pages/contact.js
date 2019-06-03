import React from 'react'
import LocalizedLink from '@utils/LocalizedLink'

import Layout from '@components/layout'
import Container from '@styles/Container'


const About = ({ pageContext }) => (
  <Layout locale={pageContext.locale}>
    <Container>
      <h1>Contact us</h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, quisquam reiciendis. Voluptate ab natus quibusdam at quo voluptas labore officia quae, perferendis harum magni error accusantium suscipit minus ex dicta! </p>
      <LocalizedLink to="/">Go to root page</LocalizedLink>
    </Container>
  </Layout>
);

export default About

