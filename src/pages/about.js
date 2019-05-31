import React from 'react'
import { Link } from 'gatsby'
import { Box, Flex, Text } from 'rebass'

import Layout from '@components/layout'
import ClientsTicker from '@components/clients/ClientsTicker'
import Container from '@styles/Container'

const fontSizes = [4, 4, '3.5vw'];

const Service = (props) => {
  return (
    <Box width={[1/2, 1/3]} px={5} pb={[5, 3]}>
      <Text as="h3" fontSize={3} fontWeight={`bold`} mb={3}>{props.title}</Text>
      <Text as="p" fontSize="18px" m={0}>La CLEF is a web initiative produced by Télé-Québec in collaboration with the Government of Quebec (MEES) to raise awareness among Quebecers about illiteracy.</Text>
    </Box>
  );
};

const About = ({ pageContext }) => (
  <Layout locale={pageContext.locale}>
    <Container>
      <Box as="header" className="is-center" mb={6}>
        <Text as={`h1`} fontSize={fontSizes} fontFamily="serif" mb={5}>About.</Text>
        <Text as="p" fontSize={`1.8vw`} width={[1, '60vw']} mb={4} mx="auto">Founded in 2011, our agency is specialized in the analysis, strategy and development of brands and web platforms.</Text>
        <Text as="p" fontSize={3} textAlign="left" width={[1, '47vw']} mx="auto" mb={0}>Our expertise in developing digital online experiences was awarded numerous times in various fields: corporate, education & entertainment. By extension, we acquired a cutting edge savoir faire for thinking and producing digital content among a vast audience of brands and users. Our approach is characterized by an agile method, where strategy, design and technology all play together.</Text>
      </Box>

      <Box as="section" className={`is-center`} mb={6}>
        <Text as={`h2`} fontSize={fontSizes} fontFamily="serif" mb={4}>Services</Text>
        <Text as="p" fontSize={`1.8vw`} width={[1, 1/2]} mx="auto" mb={5}>Digital oriented, our services align on</Text>

        <Flex flexWrap="wrap" className={`is-left`}>
          <Service title="Research and Brand Strategy" />
          <Service title="Content Creation" />
          <Service title="Branding & Design" />
          <Service title="Web Development" />
          <Service title="Web Optimization" />
          <Service title="Creative Media Launch" />
        </Flex>
      </Box>

      <Box as="section" className={`is-center`} mb={6}>
        <Text as={`h2`} fontSize={fontSizes} fontFamily="serif" mb={4}>Clients</Text>
        <Text as="p" fontSize={`1.8vw`} width={[1, '64vw']} mx="auto" mb={0}>We work for the growth and the influence of brands from here and elsewhere in developing tools and customized campaigns.</Text>
      </Box>

    </Container>

    <ClientsTicker quantity={5} />
  </Layout>
);

export default About
