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
      degree: h.norm_degee,
      houseNo: h.house,
      houseLord: h.house_lord,
      
    }
  });
  let planetChart = planets.map((p) => {
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
    }
  });
  let chart = houseChart
    .concat(planetChart)
    .sort((a, b) => a.degree - b.degree);
  return chart;
}