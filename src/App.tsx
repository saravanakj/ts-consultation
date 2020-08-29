import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { astroData } from "./data/localData";

/*
      b#   houses[].house_id
      sign-name houses[].sign_name
      house-lord houses[].sign_lord
      nak-name houses[].nak-name
      dhasa-lord houses[].nak-lord
      buk-lord houses[].sub-lord
      anthara-lord houses[].sub-sub-lord
      suk-lord houses[].sub-sub-sub-lord
      deg min sec getDegree(houses[].full_degree)
      deg min sec getDegree(planets[].full_degree)
      planet planets[].planet_name
      sign-name planets[].sign_name
      house-lord planets[].sign_lord
      nak-name planets[].nak-name
      nak-lord         planets[].nak-lord
      sub-lord planets[].sub-lord
      sub-sub-lord planets[].sub-sub-lord
      sub-sub-sub-lord planets[].sub-sub-sub-lord
*/
type ChartRow = Partial<{
  houseId: number;
  houseSignName: string;
  houseSignLord: string;
  houseNakshathraName: string;
  dhasaLord: string;
  bukthiLord: string;
  antharaLord: string;
  sukLord: string;
  planet: string;
  planetSignName: string;
  planetSignLord: string;
  planetNakName: string;
  planetNakLord: string;
  planetSubLord: string;
  planetSubSubLord: string;
  planetSubSubSubLord: string;
}> & { degree: number };

const prepareChartData = () => {
  let houseChart = astroData.houses.map((h) => {
    return {
      houseId: h.house_id,
      houseSignName: h.sign_name,
      houseSignLord: h.sign_lord,
      houseNakshathraName: h.nakshatra_name,
      dhasaLord: h.nakshatra_lord,
      bukthiLord: h.sub_lord,
      antharaLord: h.sub_sub_lord,
      sukLord: h.sub_sub_sub_lord,
      degree: h.norm_degee,
    } as ChartRow;
  });
  let planetChart = astroData.planets.map((p) => {
    return {
      degree: p.norm_degree,
      planet: p.planet_name,
      planetSignName: p.sign_name,
      planetSignLord: p.sign_lord,
      planetNakName: p.nakshatra_name,
      planetNakLord: p.nakshatra_lord,
      planetSubLord: p.sub_lord,
      planetSubSubLord: p.sub_sub_lord,
      planetSubSubSubLord: p.sub_sub_sub_lord,
    } as ChartRow;
  });
  let chart = houseChart
    .concat(planetChart)
    .sort((a, b) => a.degree - b.degree);
  return chart;
};

function App() {
  const [chartData, setChartData] = useState(new Array<ChartRow>());

  useEffect(() => {
    let data = prepareChartData();
    setChartData(data);
  }, []);

  if (chartData.length == 0) return <div>No data to display</div>;

  return (
    <div>
      <table>
        {chartData.map((c, idx) => (
          <tr>
            <td>{c.houseId}</td>
            <td>{c.houseSignName}</td>
            <td>{c.houseSignLord}</td>
            <td>{c.houseNakshathraName}</td>
            <td>{c.dhasaLord}</td>
            <td>{c.bukthiLord}</td>
            <td>{c.antharaLord}</td>
            <td>{c.sukLord}</td>
            <td>{c.degree}</td>
            <td>{c.planet}</td>
            <td>{c.planetSignName}</td>
            <td>{c.planetSignLord}</td>
            <td>{c.planetNakName}</td>
            <td>{c.planetNakLord}</td>
            <td>{c.planetSubLord}</td>
            <td>{c.planetSubSubLord}</td>
            <td>{c.planetSubSubSubLord}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default App;
