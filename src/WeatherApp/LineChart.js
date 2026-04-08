import Style from "./LineChart.module.css";
import React from "react";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(...registerables);
Chart.register(ChartDataLabels);

export default class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }

  canvasChart = null;

  componentDidMount() {
    let major = this.props.major;
    this.canvasChart = new Chart(this.canvas.current, {
      type: "line",
      data: {
        labels: this.props.data.map((d) => d.x),
        datasets: [
          {
            data: this.props.data.map((d) => d.y),
            //fill: false,
            //borderColor: "#fff8",
            //borderDash: [5, 5],
            //borderWidth: 2,
            //pointRadius: 0,
            tension: 0.3,
            segment: {
              borderColor: function (context) {
                const yVal = context.p1.parsed.y;
                if (yVal >= 25) {
                  return "red";
                } else if (yVal <= 0) {
                  return "blue";
                } else if (yVal <= 0) {
                  return "dark blue";
                } else {
                  return "gray";
                }
              },
            },
          },
        ],
      },
      options: {
        animation: {
          duration: 0,
        },
        layout: {
          padding: { top: 15 },
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            //color: "white",
            clip: false,
            align: "top",
            offset: -2,
            formatter: (d, context) => {
              if (context.dataIndex % parseInt(this.props.major) !== 0)
                return null; //only show labels on major lines
              return d + this.props.append; //add appended string to labels
            },
          },
        },
        scales: {
          x: {
            grid: {
              //color: "green",
              drawBorder: false,
              //tickColor: "white",
            },
            ticks: {
              //color: "white",
              callback: function (val, index) {
                //hide the label of every 2nd dataset
                return index % parseInt(major) === 0
                  ? this.getLabelForValue(val)
                  : "";
              },
            },
          },
          y: {
            display: true,
            suggestedMin: parseInt(this.props.min),
            suggestedMax: parseInt(this.props.max),
            ticks: {
              major: {
                enabled: true,
              },
            },
          },
        },
      },
    });
  }

  componentWillUnmount() {
    this.canvasChart.destroy();
  }

  componentDidUpdate(prevProps) {
    if (this.props === prevProps) return; //only redraw if data changed
    this.canvasChart.destroy(); //redraw chart from scratch
    this.componentDidMount();
  }

  render() {
    return <canvas ref={this.canvas} height={this.props.height} />;
  }
}
