import Style from "./AppBackground.module.css";
import React from "react";
import BackgroundMap from "./BackgroundMap";

export default class AppBackground extends React.Component {
  render() {
    return (
      <div className={Style.full}>
        <BackgroundMap location={this.props.location} />
        <BackgroundLandscape
          location={this.props.location}
          style={this.props.style}
        />
      </div>
    );
  }
}

//creates an svg for the background sun/moon, clouds
class BackgroundLandscape extends React.Component {
  render() {
    return (
      <svg className={Style.svg}>
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%"> {/* cloud gradient */}
            <stop
              offset="0%"
              style={{ stopColor: "rgb(255,255,255)", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "rgb(0,0,0)", stopOpacity: 1 }}
            />
          </linearGradient>
          <filter id="f2" x="-50" y="-50" height="300" width="300"> {/* cloud blur */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="30" />
          </filter>
        </defs>
        <svg> {/* sun/moon container */}
          <g transform="translate(-150 -150)">
            <svg
              x={this.props.style.sun.x + "%"}
              y={this.props.style.sun.y + "%"}
              width="300"
              height="300"
            >
              <defs> {/* blur (halo) around sun/moon */}
                <filter id="f1" x="-50" y="-50" height="300" width="300">
                  <feGaussianBlur
                    in="SourceGraphic"
                    result="blur"
                    stdDeviation="20"
                  />
                  <feBlend in="blur" in2="BackgroundImage" mode="screen" />
                </filter>
              </defs>
              <mask id="moonMask"> {/* mask for shadow on moon */}
                <rect x="0" y="0" width="300" height="300" fill="white" />
                <circle cx="225" cy="150" r="100" fill="black" />
              </mask>
              <g
                opacity={this.props.style.sun.opacity + "%"}
                transform="scale(1,1)"
              > {/* sun/moon circle */}
                <circle
                  cx="150"
                  cy="150"
                  r="100"
                  fill={
                    "hsl(" +
                    this.props.style.sun.halo.hue +
                    ", " +
                    this.props.style.sun.halo.sat +
                    "%, " +
                    this.props.style.sun.halo.lum +
                    "%)"
                  }
                  filter="url(#f1)"
                />
                <circle
                  cx="150"
                  cy="150"
                  r="100"
                  strokeWidth="0"
                  fill="white"
                  opacity="0.8"
                  mask={this.props.style.sun.isDaylight ? "" : "url(#moonMask)"}
                />
              </g>
            </svg>
          </g>
        </svg>
        <g filter="url(#f2)" opacity={this.props.style.cloud.opacity + "%"}> {/* cloud container */}
          {new Array(this.props.style.cloud.count).fill("x").map((x, key) => {
            //multiple clouds by count in random positions
            return (
              <circle
                key={key}
                cx={Math.random() * 120 - 10 + "%"}
                cy={Math.random() * 50 + 10 + "%"}
                r={Math.random() * 130 + 20 + "px"}
                fill="url(#grad1)"
              />
            );
          })}
        </g>
      </svg>
    );
  }
}
