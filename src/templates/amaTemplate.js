import React from 'react';
import styled from 'styled-components';
import Giscus from '../components/giscus';

import Layout from '../components/layout';
import SEO from '../components/seo';
import Nav from '../components/nav/nav';
import Footer from '../components/footer';

const Container = styled.article`
  width: min(80%, 70ch);
`;

const AmaTemplate = (props) => (
  <Layout>
    <SEO title="" />
    <Nav siteTitle="<e//y>" />
    <Container>
      <Giscus {...props} />
    </Container>
    <Footer />
  </Layout>
);

export default AmaTemplate;
