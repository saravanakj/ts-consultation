/*
b#    - Visible - B#
house-lord houses[].sign_lord - Visible - SL
dhasa-lord houses[].nak-lord - Visible - DAL
buk-lord houses[].sub-lord - Visible - BHL
anthara-lord houses[].sub-sub-lord - Visible - ANL
deg min sec getDegree(houses[].full_degree) - Visible
deg min sec getDegree(planets[].full_degree) - Visible
planet planets[].planet_name -  Visible - PL
house-lord planets[].sign_lord - Visible - SL
nak-lord         planets[].nak-lord - Visible - NL
sub-lord planets[].sub-lord - Visible - SL
sub-sub-lord planets[].sub-sub-lord - Visible - SSL

nak-name houses[].nak-name - Hidden - DN
sign-name houses[].sign_name - ( hidden ) - HSN
suk-lord houses[].sub-sub-sub-lord - Hidden - SUKL
nak-name planets[].nak-name - Hidden - NN
sign-name planets[].sign_name - Hidden - PSN
sub-sub-sub-lord planets[].sub-sub-sub-lord - Hidden - SSS

*/
export const prepareChartData = (houses, planets) => {
  let houseChart = houses.map((h) => {
    return {
      houseId: h.house_id,
      houseSignName: h.sign_name,
      houseSignLord: h.sign_lord,
      houseNakshathraName: h.nakshatra_name,
      dhasaLord: h.nakshatra_lord,
      bukthiLord: h.sub_lord,
      antharaLord: h.sub_sub_lord,
      sukLord: h.sub_sub_sub_lord,
      degree: h.full_degree,
      houseNo: h.house,
      houseLord: h.house_lord,
      
    }
  });
  let planetChart = planets.filter(p => !(p.planet_name.startsWith("Ur") || p.planet_name.startsWith("Pl") || p.planet_name.startsWith("Ne")) ).map((p) => {
    return {
      degree: p.full_degree,
      planet: p.planet_name,
      planetSignName: p.sign_name,
      planetSignLord: p.sign_lord,
      planetNakName: p.nakshatra_name,
      planetNakLord: p.nakshatra_lord,
      planetSubLord: p.sub_lord,
      planetSubSubLord: p.sub_sub_lord,
      planetSubSubSubLord: p.sub_sub_sub_lord,
    }
  });
  planetChart = planetChart.sort((a, b) => a.degree - b.degree);
  let chart = houseChart.sort((a, b) => a.houseId - b.houseId);
  for(let pIdx=0;pIdx< planetChart.length; pIdx++)  {
    let located = locateIndex(chart, planetChart[pIdx].degree);
    chart.splice(located,0,planetChart[pIdx]);
  }
  return chart;
}

export const locateIndex = (chart, planetDegree) => {
  let located = chart.length;
  for(let idx = 0; idx < chart.length-1;idx++) {
    let currentDegree = chart[idx].degree;
    let nextDegree = chart[idx + 1].degree;
    if(currentDegree <= nextDegree) {
      if(currentDegree <= planetDegree && planetDegree <= nextDegree) {
        located = idx;
      }
    } else {
      if(planetDegree <= nextDegree) {
        located = idx;
      }
    }
  }   
  return located+1;   
}
