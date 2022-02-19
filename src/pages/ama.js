import React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';
import Nav from '../components/nav/nav';
import getAmas from '../components/ama/get-amas';
import Newsletter from '../components/newsletter/newsletter';

const AMA = () => {
  const amas = getAmas();

  return (
    <Layout>
      <SEO title="Speaking" />
      <Nav siteTitle="<e//y>" />
      <h1>Hello</h1>
      {
        <ul>
          {amas.length > 0 &&
            amas.map((ama, index) => <li key={index}>{ama}</li>)}
        </ul>
      }
      <Newsletter />
    </Layout>
  );
};

export default AMA;
