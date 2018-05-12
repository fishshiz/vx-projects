import React, { Component } from "react";
import { LinePath, Line, Bar } from "@vx/shape";
import { appleStock } from "@vx/mock-data";
import { scaleTime, scaleLinear } from "@vx/scale";
import { localPoint } from "@vx/event";
import { extent, max, bisector } from "d3-array";

const stock = appleStock.slice(800);
console.log(stock.map(el => el.close));

const xSelector = d => new Date(d.date);
const ySelector = d => d.close;
const bisectDate = bisector(xSelector).left;

class Graph extends Component {
  constructor() {
    super();
    this.state = {
      position: null,
      close: "0.00"
    };
  }
  handleDrag = ({ event, data, xSelector, xScale, yScale }) => {
    const { x } = localPoint(event);
    const x0 = xScale.invert(x);
    let index = bisectDate(data, x0, 1);
    const d0 = data[index - 1];
    const d1 = data[index];
    let d = d0;
    let close = d0.close.toFixed(2);
    console.log(this.state.close);
    if (d1 && d1.date) {
      if (x0 - xSelector(d0) > xSelector(d1) - x0) {
        d = d1;
      } else {
        d = d0;
        index = index - 1;
      }
    }

    this.setState({
      position: {
        index,
        x: xScale(xSelector(d))
      },
      close
    });
  };
  render() {
    const { position, close } = this.state;
    const width = 500;
    const height = 300;

    const xScale = scaleTime({
      range: [0, width],
      domain: extent(stock, xSelector)
    });

    const yMax = max(stock, ySelector);

    const yScale = scaleLinear({
      range: [height, 0],
      domain: [0, yMax + yMax / 4]
    });

    return (
      <svg width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="#32deaa"
          rx={14}
        />
        <text
          textAnchor="middle"
          x={250}
          y={80}
          style={{
            fontFamily: "Arial",
            fontSize: "45px",
            fill: "rgba(255,255,255,.5)"
          }}
        >
          ${close}
        </text>
        <LinePath
          data={position ? stock.slice(0, position.index) : stock}
          xScale={xScale}
          yScale={yScale}
          x={xSelector}
          y={ySelector}
          strokeWidth={2}
          stroke="rgba(25,55,55,.5)"
        />
        {position && (
          <LinePath
            data={stock.slice(position.index)}
            xScale={xScale}
            yScale={yScale}
            x={xSelector}
            y={ySelector}
            strokeWidth={2}
            stroke="rgba(255,255,255,.5)"
          />
        )}

        {position && (
          <Line
            from={{ x: position.x, y: 0 }}
            to={{ x: position.x, y: height }}
            strokeWidth={1}
            stroke="transparent"
          />
        )}
        <Bar
          x={0}
          y={0}
          width={width}
          height={height}
          fill="transparent"
          rx={14}
          data={stock}
          onTouchStart={data => event =>
            this.handleDrag({
              event,
              data,
              xSelector,
              xScale,
              yScale
            })}
          onTouchMove={data => event =>
            this.handleDrag({
              event,
              data,
              xSelector,
              xScale,
              yScale
            })}
          onMouseMove={data => event =>
            this.handleDrag({
              event,
              data,
              xSelector,
              xScale,
              yScale
            })}
        />
      </svg>
    );
  }
}

export default Graph;
