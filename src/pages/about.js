import React from 'react'
import { Box, Flex, Text } from 'rebass'

import SEO from '@components/seo'
import { ChipButton } from '@components/buttons'
import ClientsTicker from '@components/clients/ClientsTicker'
import Container from '@styles/Container'
import PageSingle from '@components/pages/PageSingle'

const fontSizes = [5, 4, 5, '3.611111111vw'];
const subtitleFontSizes = [3, 3, 3, '1.805555556vw'];

const Service = (props) => {
  return (
    <Box width={[1, 1/2, 1/2, 1/3]} px={[0, 1, 3, 4, 5]} pb={[5, 5, 4, 3]}>
      <Text as="h3" className="fw-500" fontSize={3} mb={3}>{props.title}</Text>
      <Text as="p" fontSize="18px" m={0}>La CLEF is a web initiative produced by Télé-Québec in collaboration with the Government of Quebec (MEES) to raise awareness among Quebecers about illiteracy.</Text>
    </Box>
  );
};

const About = ({ pageContext, data }) => (
  <React.Fragment>

    <PageSingle data={ data } />

    <Container fluid css={{position: 'relative'}}>
      <ChipButton css={{position: 'absolute', zIndex: 3, top: '100%', right: 0, marginTop: -30}}>Show list</ChipButton>
    </Container>
    <ClientsTicker quantity={5} />

  </React.Fragment>
);

export default About

export const projectQuery = graphql`
  query aboutPageQuery($locale: String!) {
    page: contentfulPages(slug: { eq: "about" }, node_locale : { eq: $locale }) {
      ...PageSingle
    }
  }
`
