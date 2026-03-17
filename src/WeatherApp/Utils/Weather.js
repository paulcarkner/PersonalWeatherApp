const apiKey = "f4bcb6a805ca765f7df85383dc7fdbab"; //todo: hide in env, for demonstration only

//get location-specific forecast from OpenWeatherMap.org
export async function fetchForecast(lat, lon, exclude) {
  return await fetch(
    `https://api.openweathermap.org/data/3.0/onecall?exclude=${exclude}&lat=${lat}&lon=${lon}&appid=${apiKey}`
  ).then((res) => res.json());
}

//convert Kelvin (as decimal) to Celsius (as string)
export function processTemp(temp, decimals) {
  return (temp - 273.15).toFixed(decimals);
}

//convert UNIX time code to DateTime
export function UNIXtoDateTime(unix, offset) {
  return new Date((unix + offset + new Date().getTimezoneOffset() * 60) * 1000);
}

//convert time to UTC
export function getUTCTime(d) {
  return d.getUTCHours() + ":" + ("0" + d.getUTCMinutes()).slice(-2);
}

//get day name from DateTime
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export function getUTCDay(d) {
  return daysOfWeek[d.getUTCDay(d)];
}

//creates a weather style object
export function getWeatherStyle(time, sunrise, sunset, cloud) {
  let isDaylight = time > sunrise && time < sunset; //is it day time or night time
  let sunPercent = isDaylight //if day time
    ? (time - sunrise) / (sunset - sunrise) //percentage of way through day
    : time < sunrise //else, if before sunrise
    ? (time - new Date(sunset - 24 * 60 * 60 * 1000)) /
      (sunrise - new Date(sunset - 24 * 60 * 60 * 1000)) //percentage of way between yesterday's sunset and sunrise
    : (time - sunset) / (new Date(sunrise + 24 * 60 * 60 * 1000) - sunset); //else, percentage of way between sunset and tomorrow's sunrise
  sunPercent = Math.floor(sunPercent * 10); //convert percentage to 0-9 index for arrays
  return {
    sun: {
      isDaylight: isDaylight, //sun or moon
      x: [85, 90, 90, 80, 65, 35, 20, 10, 10, 15][sunPercent], //sun/moon location % on page
      y: [50, 35, 25, 15, 10, 10, 15, 25, 35, 50][sunPercent],
      halo: {
        //sun/moon halo colour (yellow/blue)
        hue: isDaylight ? 60 : 210,
        sat: 100,
        lum: isDaylight ? 50 : 70,
      },
      opacity: 100 - cloud, //hide sun/moon by cloud percentage
    },
    gradient: {
      //create sky gradient colouring
      start: {
        hue: (isDaylight
          ? [277, 227, 217, 217, 217, 217, 217, 217, 220, 306]
          : [213, 213, 213, 213, 213, 213, 213, 213, 213, 213])[sunPercent],
        sat:
          (isDaylight
            ? [76, 99, 82, 82, 82, 82, 82, 82, 73, 63]
            : [58, 58, 58, 58, 58, 58, 58, 58, 58, 58])[sunPercent] *
          (1 - (cloud / 100) * 0.8),
        lum:
          (isDaylight
            ? [7, 67, 60, 60, 72, 72, 60, 60, 64, 47]
            : [7, 7, 7, 7, 7, 7, 7, 7, 7, 7])[sunPercent] *
          (1 - (cloud / 100) * 0.5),
      },
      end: {
        hue: (isDaylight
          ? [3, 38, 217, 217, 217, 217, 217, 217, 230, 355]
          : [202, 202, 202, 202, 202, 202, 202, 202, 202, 202])[sunPercent],
        sat:
          (isDaylight
            ? [65, 75, 82, 82, 82, 82, 82, 82, 87, 93]
            : [19, 19, 19, 19, 19, 19, 19, 19, 19, 19])[sunPercent] *
          (1 - (cloud / 100) * 0.8),
        lum:
          (isDaylight
            ? [80, 90, 50, 50, 72, 72, 50, 50, 70, 89]
            : [86, 70, 60, 50, 40, 40, 50, 60, 70, 86])[sunPercent] *
          (1 - (cloud / 100) * 0.5),
      },
    },
    cloud: {
      count: cloud,
      opacity: cloud * 0.5,
    },
  };
}
