import React from "react"
import moment from "moment"
import { ResponsiveLine } from "@nivo/line"
import { Link } from "gatsby"
import styled from "styled-components"

import Header from "../components/header"

const LinkDiv = styled.div`
  a {
    margin-right: 20px;
    text-decoration: none;
    color: inherit;
    border: 2px solid transparent;
  }

  a.active {
    border-bottom-color: rebeccapurple;
  }
`

const PageTemplate = props => {
  let data = props.pageContext.data

  let graphData = {
    id: props.pageContext.prefix,
    data: [],
  }

  data.sort((a, b) => {
    return a.timestamp - b.timestamp
  })

  data.forEach(point => {
    graphData.data.push({
      x: moment.unix(point.timestamp).format("MM/DD/YYYY HH:mm"),
      y: point.value,
    })
  })

  let lastEntry = {}

  return (
    <div
      style={{
        fontFamily: "-apple-system",
      }}
    >
      <Header />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>
          {capitalize(props.pageContext.prefix)} - Past{" "}
          {props.pageContext.pastDays > 1 ? props.pageContext.pastDays : ""}{" "}
          {props.pageContext.pastDays > 1 ? "days" : "day"}
        </h1>
        <LinkDiv>
          <Link
            to={`/${props.pageContext.prefix}/day/`}
            activeClassName={"active"}
          >
            Day
          </Link>
          <Link
            to={`/${props.pageContext.prefix}/week/`}
            activeClassName={"active"}
          >
            Week
          </Link>
          <Link
            to={`/${props.pageContext.prefix}/month/`}
            activeClassName={"active"}
          >
            Month
          </Link>
        </LinkDiv>
      </div>
      <div style={{ height: 400 }}>
        <ResponsiveLine
          data={[graphData]}
          dotSize={8}
          xScale={{
            type: "time",
            format: "%m/%d/%Y %H:%M",
            precision: "minute",
          }}
          axisBottom={{
            format: "%b %d %I:%M%p",
            tickRotation: 20,
            tickSize: 10,
          }}
          axisLeft={{
            format: val => Number(val).toLocaleString(),
          }}
          tooltipFormat={val => {
            return Number(val).toLocaleString()
          }}
          yScale={{ min: "auto", max: "auto", type: "linear" }}
          margin={{ top: 25, left: 75, right: 75, bottom: 50 }}
          colors={"accent"}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>{props.pageContext.prefix}</th>
            <th>Growth since Last Entry</th>
          </tr>
        </thead>
        <tbody>
          {data.map(entry => {
            let growth = lastEntry.value ? entry.value - lastEntry.value : 0
            lastEntry = entry

            return (
              <tr>
                <td>{moment.unix(entry.timestamp).format("llll")}</td>
                <td>{entry.value.toLocaleString()}</td>
                <td
                  style={{
                    color:
                      growth > 0 ? "green" : growth < 0 ? "red" : "inherit",
                  }}
                >
                  {(growth > 0 ? "+" : "") + growth}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default PageTemplate

const capitalize = s => {
  if (typeof s !== "string") return ""
  return s.charAt(0).toUpperCase() + s.slice(1)
}
