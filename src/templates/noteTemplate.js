import React, { useState, useEffect, useRef } from 'react';
import { graphql, Link } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { MDXProvider } from '@mdx-js/react';
import { styled } from '../../stitches.config';
import { window } from 'browser-monads';
import Tippy from '@tippyjs/react';
import 'tippy.js/animations/shift-away.css';

import Layout from '../components/layout';
import SEO from '../components/seo';
import Nav from '../components/nav/nav';
import FormatStage from '../components/garden/format-stage';
import FormatTag from '../components/garden/format-tag';
import Graph from '../components/garden/graph';
import Footer from '../components/footer';

const NavStyled = styled('div', {
  '@laptopSmall': {
    'nav ul li::before, nav ul li::after,  nav h1::before, nav h1::after': {
      background: 'var(--color-green300)',
    },
  },
});

const Container = styled('article', {
  margin: '6em 1.5em 1.5em 1.5em',
  display: 'grid',
  gridTemplateColumns: 'auto',
  gridTemplateRows: 'repeat(3, max-content)',
  gridTemplateAreas: `
    'header'
    'content'
    'graphrefs'`,
  gap: '2em',

  '& a': {
    textDecoration: 'underline',
    textUnderlineOffset: '1px',
    color: 'var(--color-green500)',
    fontWeight: 600,
  },

  '@laptopSmall': {
    margin: '4em auto',
    width: '75%',
    gridTemplateColumns: '2fr 1fr',
    gridTemplateAreas: `
      'header header'
      'content graphrefs'`,
    gap: '3em',
  },

  '@desktopSmall': {
    gridTemplateColumns: '1fr max-content',
    width: '65%',
  },

  '@media (min-width: 90em)': { width: '55%' },
});

const Header = styled('header', {
  gridArea: 'header',
});

const Title = styled('h1', {
  margin: '0',
  fontSize: '2.5rem',
  lineHeight: 1,
  color: 'var(--color-text)',

  span: {
    marginLeft: '3px',
    verticalAlign: 'top',
    fontSize: '0.8em',
  },
});

const Metadata = styled('div', {
  width: '100%',
  marginTop: '1em',
  padding: '1em',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5em',
  lineHeight: 1.5,
  background: 'var(--color-background)',
  border: '1px solid var(--color-gray300)',
  borderRadius: '1rem',
  boxShadow: 'var(--shadow-elevation-low)',

  '& > div > *': {
    margin: '0',
  },

  '@tabletSmall': {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const StageTagsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '0.5em',

  '@laptopLarge': {
    flexDirection: 'row',
    alignItems: 'center',
    gap: '1em',
  },
});

const FormatStageStyled = styled('div', {
  width: 'fit-content',
  height: 'fit-content',
  padding: '0.25em 0.7em 0.25em 0.65em',
  border: '2px solid var(--color-green500)',
  borderRadius: '9999px',
  transition: 'all 0.3s ease-in-out',
  background: 'var(--color-background)',

  '& p': {
    transition: 'all 0.3s ease-in-out',
    color: 'var(--color-green300)',
  },
});

const Tags = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.25em',
});

const FormatTagStyled = styled('div', {
  width: 'fit-content',
  height: 'fit-content',
  padding: '0.2em 0.4em',
  borderRadius: '4px',
  color: 'var(--color-background)',
  background: 'var(--color-green500)',
});

const TimeContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  gap: '0.5em',

  '@laptopLarge': {
    flexDirection: 'row',
    alignItems: 'center',
    gap: '1em',
  },
});

const CreatedTime = styled('p', {
  '@tabletSmall': {
    textAlign: 'right',
  },
});

const ModifiedTime = styled('p', {
  '@tabletSmall': {
    textAlign: 'right',
  },
});

const Content = styled('div', {
  gridArea: 'content',
  lineHeight: 1.5,

  '& blockquote': {
    position: 'relative',
    width: 'fit-content',
    marginLeft: '1em',
    padding: '1em 2em',
    background: '#bcd05f1a',
    borderTopLeftRadius: '0',
    borderTopRightRadius: '1rem',
    borderBottomRightRadius: '1rem',
    borderBottomLeftRadius: '0',
    fontStyle: 'italic',
    letterSpacing: '0.5px',

    '& p': {
      margin: '0',
    },

    '&::before': {
      position: 'absolute',
      top: '0',
      left: '0',
      content: "''",
      display: 'block',
      width: '4px',
      height: '100%',
      backgroundColor: 'var(--color-green500)',
      borderRadius: '2px',
    },
  },
});

const Tooltip = styled('div', {
  backgroundColor: 'var(--color-background)',
  padding: '1em 1.5em',
  lineHeight: 1.5,
  border: '1px solid var(--color-gray300)',
  borderRadius: '1rem',
  boxShadow: 'var(--shadow-elevation-medium)',
  transition: 'all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1)',

  '& > *': {
    margin: '0',
  },

  '& h1': {
    lineHeight: 1,
    marginBottom: '0.25em',
  },

  '&:hover, &:focus': {
    transform: 'scale(1.015)',
    border: '1px solid var(--color-primary)',
    boxShadow: 'var(--shadow-elevation-high)',
  },
});

const References = styled('div', {
  gridRow: '2 / 3',
  gridColumn: '1 / 2',

  width: '100%',
  height: 'fit-content',
  maxHeight: 'max-content',
  padding: '1.5em 2em',

  lineHeight: 1.5,
  background: 'var(--color-background)',
  border: '1px solid var(--color-gray300)',
  borderRadius: '1rem',
  boxShadow: 'var(--shadow-elevation-low)',
  transition: 'all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1)',

  '&:hover, &:focus': {
    transform: 'scale(1.015)',
    border: '1px solid var(--color-primary)',
    boxShadow: 'var(--shadow-elevation-medium)',
  },

  '& h2': {
    margin: '0',
    marginBottom: '0.25em',
    fontWeight: 600,
    lineHeight: 1,
  },

  '& ul': {
    paddingLeft: '1.6em',
    margin: '0',
    marginTop: '0.25em',

    '& li::marker': {
      content: "'→  '",
    },
  },

  '@tabletLarge': {
    gridRow: '1 / 2',
    gridColumn: '2 / 3',
    height: '100%',
  },

  '@laptopSmall': {
    gridRow: '2 / 3',
    gridColumn: '1 / 2',
    height: 'fit-content',
  },
});

const GraphStyled = styled('div', {
  gridRow: '1 / 2',
  gridColumn: '1 / 2',
});

const GraphRefsContainer = styled('div', {
  gridArea: 'graphrefs',
  height: 'fit-content',
  display: 'grid',
  gridTemplateColumns: 'auto',
  gridTemplateRows: '1fr 1fr',
  gap: '2em',

  '@tabletLarge': {
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: 'auto',
  },

  '@laptopSmall': {
    gridTemplateColumns: 'auto',
    gridTemplateRows: '1fr 1fr',
  },
});

const FooterStyled = styled('div', {
  height: '4rem',
  position: 'relative',

  'footer small, footer small a, footer ul a': {
    color: 'var(--color-text)',
  },

  'footer small a::before, footer small a::after, footer ul li::before, footer ul li::after':
    {
      background: 'var(--color-green300)',
    },
});

const NoteTemplate = ({
  data: {
    mdx,
    file: { modifiedTime },
  },
}) => {
  const ref = useRef(null);

  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWidth(ref.current ? ref.current.offsetWidth : 0);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Layout>
      <SEO title={mdx.frontmatter.title} />
      <NavStyled>
        <Nav
          siteTitle="<e//y>"
          color="var(--color-green500)"
          navColor="var(--color-green500)"
        />
      </NavStyled>
      <Container>
        <Header>
          <Title>{mdx.frontmatter.title}</Title>
          <Metadata>
            <StageTagsContainer>
              <FormatStageStyled>
                <FormatStage stage={mdx.frontmatter.stage} />
              </FormatStageStyled>
              <Tags>
                {mdx.frontmatter.tags.map((tag, index) => {
                  return !tag ? null : (
                    <FormatTagStyled key={index}>
                      <FormatTag tag={tag} />
                    </FormatTagStyled>
                  );
                })}
              </Tags>
            </StageTagsContainer>
            <TimeContainer>
              {mdx.frontmatter.slug === 'now' ? null : (
                <CreatedTime>
                  <i className="twa twa-seedling"></i> Sprouted on{' '}
                  {formatDate(mdx.frontmatter.date)}
                </CreatedTime>
              )}
              <ModifiedTime>
                <i className="twa twa-cloud-with-rain"></i> Last watered on{' '}
                {formatDate(modifiedTime)}
              </ModifiedTime>
            </TimeContainer>
          </Metadata>
        </Header>
        <Content>
          <MDXProvider
            components={{
              a: (props) => (
                <Tippy
                  interactive={true}
                  placement="auto"
                  animation="shift-away"
                  inertia={true}
                  content={
                    <Tooltip>
                      {mdx.inboundReferences &&
                      mdx.inboundReferences.find(
                        (inRef) => inRef.frontmatter.title === props.title
                      ) ? (
                        <>
                          <h1>{props.title}</h1>
                          <p>
                            {mdx.inboundReferences
                              .find(
                                (inRef) =>
                                  inRef.frontmatter.title === props.title
                              )
                              .excerpt.replace(/\[ /g, '')
                              .replace(/ \]/g, '')}
                          </p>
                        </>
                      ) : mdx.outboundReferences &&
                        mdx.outboundReferences.find(
                          (outRef) => outRef.frontmatter.title === props.title
                        ) ? (
                        <>
                          <h1>{props.title}</h1>
                          <p>
                            {mdx.outboundReferences
                              .find(
                                (inRef) =>
                                  inRef.frontmatter.title === props.title
                              )
                              .excerpt.replace(/\[ /g, '')
                              .replace(/ \]/g, '')}
                          </p>
                        </>
                      ) : props.href.match(
                          // eslint-disable-next-line no-useless-escape
                          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
                        ) ? (
                        <p>
                          This is an external link{' '}
                          <i className="twa twa-globe-with-meridians"></i>
                        </p>
                      ) : (
                        <>
                          <p>
                            <em>
                              {/* eslint-disable-next-line react/no-unescaped-entities */}
                              This note doesn't exist yet
                            </em>{' '}
                            <i className="twa twa-exploding-head"></i>
                          </p>
                          <p>
                            <i className="twa twa-bird"></i>{' '}
                            <a
                              href={`https://twitter.com/intent/tweet?text=Hey%20%40ellyloel!%20You%20should%20write%20a%20note%20about%20${props.title}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              tweet
                            </a>{' '}
                            <em>at me to add it!</em>
                          </p>
                        </>
                      )}
                    </Tooltip>
                  }
                >
                  {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
                  <a {...props} />
                </Tippy>
              ),
            }}
          >
            <MDXRenderer>{mdx.body}</MDXRenderer>
          </MDXProvider>
        </Content>
        <GraphRefsContainer>
          <References ref={ref}>
            {mdx.inboundReferences.length > 0 ? (
              <>
                <h2>Referenced in:</h2>
                <ul>
                  {mdx.inboundReferences.map((ref, index) => (
                    <li key={index}>
                      <Tippy
                        interactive={true}
                        placement="auto"
                        animation="shift-away"
                        inertia={true}
                        content={
                          <Tooltip>
                            {mdx.inboundReferences &&
                            mdx.inboundReferences.find(
                              (inRef) =>
                                inRef.frontmatter.title ===
                                ref.frontmatter.title
                            ) ? (
                              <>
                                <h1>{ref.frontmatter.title}</h1>
                                <p>
                                  {mdx.inboundReferences
                                    .find(
                                      (inRef) =>
                                        inRef.frontmatter.title ===
                                        ref.frontmatter.title
                                    )
                                    .excerpt.replace(/\[ /g, '')
                                    .replace(/ \]/g, '')}
                                </p>
                              </>
                            ) : (
                              <>
                                <h1>{ref.frontmatter.title}</h1>
                                <p>
                                  {mdx.outboundReferences
                                    .find(
                                      (inRef) =>
                                        inRef.frontmatter.title ===
                                        ref.frontmatter.title
                                    )
                                    .excerpt.replace(/\[ /g, '')
                                    .replace(/ \]/g, '')}
                                </p>
                              </>
                            )}
                          </Tooltip>
                        }
                      >
                        <Link to={`/notes/${ref.frontmatter.slug}`}>
                          {ref.frontmatter.title}
                        </Link>
                      </Tippy>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <h2 style={{ marginBottom: 0 }}>No references</h2>
            )}
          </References>
          <GraphStyled>
            <Graph location={'note'} data={mdx} width={width} />
          </GraphStyled>
        </GraphRefsContainer>
      </Container>
      <FooterStyled>
        <Footer />
      </FooterStyled>
    </Layout>
  );
};

export default NoteTemplate;

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const query = graphql`
  query ($slug: String!, $content: String!) {
    mdx(frontmatter: { slug: { eq: $slug } }) {
      body
      inboundReferences {
        ... on Mdx {
          frontmatter {
            title
            slug
          }
          excerpt
        }
      }
      outboundReferences {
        ... on Mdx {
          frontmatter {
            title
            slug
          }
          excerpt
        }
      }
      frontmatter {
        title
        slug
        stage
        tags
        date
      }
    }
    file(internal: { content: { eq: $content } }) {
      modifiedTime
    }
  }
`;
