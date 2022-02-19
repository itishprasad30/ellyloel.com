import getAmas from '../components/ama/get-amas';

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;

  const NoteTemplate = require.resolve(`./src/templates/noteTemplate.js`);

  const NoteResults = await graphql(`
    {
      allMdx(filter: { frontmatter: { slug: { ne: null } } }) {
        nodes {
          frontmatter {
            slug
          }
        }
      }
      allFile(filter: { internal: { description: { regex: "/notes/" } } }) {
        nodes {
          internal {
            content
          }
        }
      }
    }
  `);

  if (NoteResults.errors) {
    reporter.panicOnBuild(
      `Error while running GraphQL query.`,
      new Error(NoteResults.errors)
    );
    return;
  }

  NoteResults.data.allMdx.nodes.forEach((node, index) => {
    createPage({
      path: `notes/${node.frontmatter.slug}`,
      component: NoteTemplate,
      context: {
        slug: node.frontmatter.slug,
        content: NoteResults.data.allFile.nodes[index].internal.content,
      },
    });
  });

  const AmaTemplate = require.resolve(`./src/templates/amaTemplate.js`);

  const AmaResults = getAmas();

  if (AmaResults.errors) {
    reporter.panicOnBuild(
      `Error while getting AMA's.`,
      new Error(AmaResults.errors)
    );
    return;
  }

  AmaResults.forEach((Ama) => {
    createPage({
      path: `ama/${Ama.number}`,
      component: AmaTemplate,
      context: {
        category: 'AMA',
        categoryId: 'DIC_kwDOFbSg084CA5Rc',
        mapping: 'number',
        term: Ama.number,
        inputPosition: 'bottom',
      },
    });
  });
};
