import React, { Children } from 'react';
import { graphql } from 'gatsby';

import Layout from './layout';

const BasePage = ({children}) => (
  <Layout>
    {children}
  </Layout>
);

export default BasePage