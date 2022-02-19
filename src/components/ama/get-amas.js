const getAmas = () => {
  const owner = 'EllyLoel';
  const repo = 'ellyloel.com';

  const query = `query {
    repository(owner: "${owner}", name: "${repo}") {
      discussions(first: 100, categoryId: "DIC_kwDOFbSg084CA5Rc") {
        totalCount
        nodes {
          title
          number
          author {
            login
            avatarUrl
          }
        }
      }
    }
  }`;

  const baseUrl = 'https://api.github.com/graphql';

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
  };

  fetch(baseUrl, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ query }),
  })
    .then(async (res) => {
      const data = await res.json();
      const amas = data.data.repository.discussions.nodes;
      return amas;
    })
    .catch(async (err) => {
      console.error(await err);
      return { errors: await err };
    });

  return [];
};

export default getAmas;
