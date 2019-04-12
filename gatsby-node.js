const path = require("path")

exports.createPages = async ({ actions, graphql }) => {
  const { data, errors } = await graphql(`
    {
      allStatsJson(sort: { fields: timestamp, order: DESC }) {
        edges {
          node {
            openIssues
            closedIssues
            openPRs
            closedPRs
            mergedPRs
            stars
            timestamp
          }
        }
      }
    }
  `)

  if (errors) {
    throw errors
  }

  const pageTemplate = path.resolve("./src/templates/page.js")

  const starsDay = data.allStatsJson.edges
    .slice(0, 24)
    .map(doStuff("stars"))
    .filter(takeEvery(1))

  const starsWeek = data.allStatsJson.edges
    .slice(0, 24 * 7)
    .map(doStuff("stars"))
    .filter(takeEvery(3))

  const starsMonth = data.allStatsJson.edges
    .slice(0, 24 * 31)
    .map(doStuff("stars"))
    .filter(takeEvery(24))

  actions.createPage({
    component: pageTemplate,
    path: `/stars/day/`,
    context: {
      data: starsDay,
      prefix: `stars`,
      pastDays: 1,
    },
  })
  actions.createPage({
    component: pageTemplate,
    path: `/stars/week/`,
    context: {
      data: starsWeek,
      prefix: `stars`,
      pastDays: 7,
    },
  })
  actions.createPage({
    component: pageTemplate,
    path: `/stars/month/`,
    context: {
      data: starsMonth,
      prefix: `stars`,
      pastDays: 31,
    },
  })
}

function doStuff(a) {
  return ({ node }) => {
    return {
      value: node[a],
      timestamp: node.timestamp,
    }
  }
}

function takeEvery(n) {
  return (_, i) => i % n === 0
}
