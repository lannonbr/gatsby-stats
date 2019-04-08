import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import styled from "styled-components"
import moment from "moment"
import { ResponsiveLine } from "@nivo/line"

const query = graphql`
  {
    allStatsJson(sort: { fields: timestamp, order: DESC }, limit: 168) {
      nodes {
        id
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
`

const StyledNav = styled.nav`
  ul {
    padding: 0;
    display: flex;
    list-style-type: none;
  }
  li:not(:first-child) {
    margin-left: 30px;
  }
`

const MainStats = styled.section`
  display: flex;
  justify-content: space-between;
  margin-left: 20px;
  margin-right: 20px;

  div {
    display: flex;
    flex-direction: column;
    align-items: center;

    span:first-child {
      font-size: 30px;
    }

    span:last-child {
      color: hsl(211, 27%, 70%);
    }
  }
`

const StyledTable = styled.table`
  td,
  th {
    border: 1px solid black;
  }
`

export default () => {
  const data = useStaticQuery(query)

  let currentStats = data.allStatsJson.nodes[0]

  data.allStatsJson.nodes = data.allStatsJson.nodes.filter(
    ({ timestamp }) => moment.unix(timestamp).hour() === 0
  )

  data.allStatsJson.nodes.reverse()

  let starsGraphData = {
    id: "stars",
    data: [],
  }

  data.allStatsJson.nodes.forEach(node => {
    starsGraphData.data.push({
      x: moment.unix(node.timestamp).format("MM/DD HH:mm"),
      y: node.stars,
    })
  })

  return (
    <div
      style={{
        fontFamily: "-apple-system",
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Gatsby Stats</h1>
        <StyledNav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/">Issues</Link>
            </li>
            <li>
              <Link to="/">Pull Requests</Link>
            </li>
            <li>
              <Link to="/">Stars</Link>
            </li>
            <li>
              <Link to="/">Site Showcase Stats</Link>
            </li>
            <li>
              <Link to="/">Docs Stats</Link>
            </li>
          </ul>
        </StyledNav>
      </header>
      <h2>Current Statistics</h2>
      <MainStats>
        <div>
          <span>{currentStats.openIssues}</span>
          <span>Open Issues</span>
        </div>
        <div>
          <span>{currentStats.closedIssues}</span>
          <span>Closed Issues</span>
        </div>
        <div>
          <span>{currentStats.openPRs}</span>
          <span>Open PRs</span>
        </div>
        <div>
          <span>{currentStats.mergedPRs}</span>
          <span>Merged PRs</span>
        </div>
        <div>
          <span>{currentStats.closedPRs}</span>
          <span>Closed PRs</span>
        </div>
        <div>
          <span>{currentStats.stars.toLocaleString()}</span>
          <span>Stars</span>
        </div>
      </MainStats>
      <h2>Stars over the past week</h2>
      <div style={{ height: 400 }}>
        <ResponsiveLine
          data={[starsGraphData]}
          dotSize={10}
          yScale={{ min: "auto", max: "auto", type: "linear" }}
          margin={{ top: 75, left: 75, right: 75, bottom: 75 }}
          colors={"pastel1"}
        />
      </div>
      <h2>Past Week</h2>
      <StyledTable>
        <thead>
          <tr>
            <th>Time</th>
            <th>Open Issues</th>
            <th>Closed Issues</th>
            <th>Open PRs</th>
            <th>Merged PRs</th>
            <th>Closed PRs</th>
            <th>Stars</th>
          </tr>
        </thead>
        <tbody>
          {data.allStatsJson.nodes.map(node => {
            return (
              <tr key={node.id}>
                <td>{moment.unix(node.timestamp).format("llll")}</td>
                <td>{node.openIssues}</td>
                <td>{node.closedIssues}</td>
                <td>{node.openPRs}</td>
                <td>{node.mergedPRs}</td>
                <td>{node.closedPRs}</td>
                <td>{node.stars}</td>
              </tr>
            )
          })}
        </tbody>
      </StyledTable>
    </div>
  )
}
