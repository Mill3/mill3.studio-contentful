import React from 'react';
import styled from 'styled-components'
import { Box, Flex, Heading, Text } from 'rebass'

import ArrowButton from '@components/buttons/ArrowButton'
import Github from '@svg/Github'
import NPM from '@svg/npm'

const Wrapper = styled.a`
  border: 2px solid rgba(255, 255, 255, 0.5);
`
const IconWrap = styled.div`
  svg {
    width: 100%;
    height: auto;
  }
`

const ICONS = {
  "github.com": Github,
  "www.github.com": Github,
  "npmjs.com": NPM,
  "www.npmjs.com": NPM,
}

const CodePreview = ({ url, name = "Package name", description = "description" }) => {
  const domain = new URL(url).hostname
  const Icon = ICONS?.[domain]

  return (
    <Flex as="article" width={1}>
      <Flex as={Wrapper} flexDirection="column" alignItems="flex-start" width={1} height={'100%'} p={30}>
        <Box as={IconWrap} width={[40]} height={90} pb={20}>
          {Icon && <Icon />}
        </Box>

        <Heading
          as="h2"
          fontFamily="sans"
          fontSize={['4.830917874vw', null, '3.125vw', '2.419354839vw', '1.666666667vw']}
          fontWeight="400"
          lineHeight={[1.2, null, 1.166666667]}
        >{name}</Heading>

        <Text
          as="p"
          fontSize={['4.347826087vw', null, '2.34375vw', '1.814516129vw', '1.25vw']}
          fontWeight="300"
          lineHeight={[1.5]}
          mt={[3]}
        >{description}</Text>

        <Flex as="p" flexGrow={1} flexDirection="column" alignItems="flex-start" justifyContent="flex-end" mt={[4]}>
          <ArrowButton color="white">Mon bouton</ArrowButton>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default CodePreview
