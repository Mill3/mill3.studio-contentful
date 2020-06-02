import React from 'react';
import { Flex } from 'rebass'

import PersonPreview from '@components/persons/PersonPreview';

import { HORIZONTAL_SPACER } from '@components/content_rows'
import { AboutSectionContainer, AboutSectionHeading } from './index'

const AboutTeam = ({ data, color }) => {
  console.log('data:', data)
  return (
    <Flex
      as={AboutSectionContainer}
      color={color}
      flexDirection="column"
      justifyContent="start"
      alignItems="center"
      px={HORIZONTAL_SPACER}
    >
      <AboutSectionHeading heading={'h1'} textAlign="center">
        <span dangerouslySetInnerHTML={{ __html: data.teamIntro.title }}></span>
      </AboutSectionHeading>
    </Flex>
  );
}

export default AboutTeam;