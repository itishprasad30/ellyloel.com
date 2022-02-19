import React from 'react';
import { Giscus as GiscusComponent } from '@giscus/react';
import styled from 'styled-components';

import { ThemeContext } from '../components/theme-context';

const GiscusSection = styled.section`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Content = styled.div`
  width: min(80%, 70ch);
  display: flex;
  flex-direction: column;
`;

const Giscus = ({ category, categoryId, mapping, term, inputPosition }) => {
  function sendMessage(message) {
    const iframe = document.querySelector('iframe.giscus-frame');
    if (!iframe) return;
    iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
  }

  return (
    <GiscusSection id="Newsletter">
      <Content>
        <ThemeContext.Consumer>
          {({ colorMode }) => {
            sendMessage({
              setConfig: {
                theme: colorMode,
              },
            });

            return (
              <GiscusComponent
                repo="EllyLoel/ellyloel.com"
                repoId="MDEwOlJlcG9zaXRvcnkzNjQxNTkxODc="
                category={category}
                categoryId={categoryId}
                mapping={mapping}
                term={term}
                reactionsEnabled="1"
                emitMetadata="1"
                inputPosition={inputPosition}
                theme={colorMode}
              />
            );
          }}
        </ThemeContext.Consumer>
      </Content>
    </GiscusSection>
  );
};

export default Giscus;
