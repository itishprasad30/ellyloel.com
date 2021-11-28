module.exports = {
  siteMetadata: {
    siteUrl: 'https://www.ellyloel.com',
    title: 'Elly Loel',
    description:
      'This is my own lovely little corner of the internet. Look forward to plenty of interesting ideas & projects.',
    author: 'Elly Loel',
  },
  flags: {
    DEV_SSR: false,
    FAST_DEV: false,
    PRESERVE_FILE_DOWNLOAD_CACHE: false,
    PARALLEL_SOURCING: false,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `notes`,
        path: `${__dirname}/content/notes/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `projects`,
        path: `${__dirname}/content/projects/`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-double-brackets-link',
            options: {
              titleToURLPath: `${__dirname}/resolve-url.js`,
              stripBrackets: true,
              parseWikiLinks: true,
            },
          },
        ],
      },
    },
    `gatsby-plugin-catch-links`,
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-transformer-markdown-references`,
      options: {
        types: ['Mdx'], // or ['RemarkMarkdown'] (or both)
      },
    },
    `gatsby-plugin-styled-components`,
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /svg/,
        },
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`Raleway:400,400i,600,800,800i`, `Nanum Pen Script:400`],
        display: 'swap',
      },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images/`,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Elly Loel`,
        short_name: `ellyloel`,
        start_url: `/`,
        icon: `src/images/logo.png`,
      },
    },
  ],
};
