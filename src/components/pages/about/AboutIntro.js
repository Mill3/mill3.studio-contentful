import React from 'react';
import { Box } from 'rebass'

import { AboutSectionContainer } from './index'

const AboutIntro = ({ data, color }) => {
  return (
    <Box as={AboutSectionContainer} color={color}>
      About intro
    </Box>
  );
}

export default AboutIntro;