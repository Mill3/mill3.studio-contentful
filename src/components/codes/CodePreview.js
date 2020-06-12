import React from 'react';
import styled from 'styled-components'
import { Box, Flex, Heading, Text } from 'rebass'

const Wrapper = styled.a`
  border: 2px solid rgba(255, 255, 255, 0.5);
`

const CodePreview = () => {
  return (
    <Flex as="article" width={1}>
      <Flex as={Wrapper} flexDirection="column" width={1} height={'100%'} p={30}>
        <Box>image</Box>
        <Heading as="h2" fontFamily="sans" fontSize={[24]} fontWeight="400" lineHeight={1.166666667}>nom du package</Heading>
        <Text as="p" fontSize={[18]} fontWeight="300">description du package</Text>
        <Text as="p">bouton</Text>
      </Flex>
    </Flex>
  )
}

export default CodePreview
