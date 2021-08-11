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
    };
  });
  let planetChart = planets
    .filter(
      (p) =>
        !(
          p.planet_name.startsWith("Ur") ||
          p.planet_name.startsWith("Pl") ||
          p.planet_name.startsWith("Ne")
        )
    )
    .map((p) => {
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
      };
    });
  planetChart = planetChart.sort((a, b) => a.degree - b.degree);
  let chart = houseChart.sort((a, b) => a.houseId - b.houseId);
  for (let pIdx = 0; pIdx < planetChart.length; pIdx++) {
    let located = locateIndex(chart, planetChart[pIdx].degree);
    chart.splice(located, 0, planetChart[pIdx]);
  }
  return chart;
};

const populatePrimaryPlanets = function (bhavaTable, bhavas) {
  let PParray = [];
  let PPobjTemp = {};
  bhavas.forEach((iterator) => {
    if (iterator.houseId) {
      PParray.push(PPobjTemp);
      PPobjTemp = {};
      PPobjTemp[iterator.bukthiLord] = true;
      PPobjTemp[iterator.dhasaLord] = true;
      PPobjTemp[iterator.antharaLord] = true;
    }
  });
  PParray.shift();
  PParray.push(PPobjTemp);
  PParray.forEach((iterator, index) => {
    bhavaTable[index + 1] = { primaryPL: iterator };
  });
};

const populateLocatedPL = function (bhavaTable, bhavas) {
  let locTemp = [];
  let locatedPLarr = [];
  bhavas.map((iterator) => {
    if (iterator.houseId) {
      locatedPLarr.push(locTemp);
      locTemp = [];
    } else {
      locTemp.push(iterator.planet);
    }
  });
  locatedPLarr.push(locTemp);
  locatedPLarr.shift();

  locatedPLarr.map((iterator, index) => {
    bhavaTable[index + 1]["locatedPL"] = iterator;
  });
};

const calculationPrimaryPlanets = function (bhavaTable) {
  let calcPPobj = {};
  let calcPParr = [];
  let index = 1;
  for (let bhava in bhavaTable) {
    //calcPPobj = {};
    calcPPobj = { ...bhavaTable[bhava]["primaryPL"] };

    bhavaTable[bhava]["locatedPL"].forEach((pt) => {
      calcPPobj[pt] = true;
    });

    calcPParr.push(calcPPobj);
  }
  return calcPParr;
};

const populateConnectedPL = function (bhavaTable, calcPrimaryPlanets, bhavas) {
  const bhavaPlanetsOnly = bhavas.filter((b) => b.planet != undefined);
  let planetList = [];
  calcPrimaryPlanets.forEach((PrimaryPlanet) => {
    let planetListTemp = bhavaPlanetsOnly
      .map((bhavaPlanet) => {
        return PrimaryPlanet[bhavaPlanet.planet] == true ||
          PrimaryPlanet[bhavaPlanet.planetNakLord] == true ||
          PrimaryPlanet[bhavaPlanet.planetSubLord] == true ||
          (bhavaPlanet.planetNakLord == bhavaPlanet.planetSubLord &&
            PrimaryPlanet[bhavaPlanet.planetSubSubLord] == true)
          ? bhavaPlanet.planet
          : "";
      })
      .filter((x) => x != "");
    planetList.push(planetListTemp);
  });
  planetList.forEach((element, index) => {
    bhavaTable[index + 1]["connectedPL"] = element;
    bhavaTable[index + 1]["connectedPLCount"] = element.length;
  });
};

const populateSSLlist = function (bhavaTable, calcPrimaryPlanets, bhavas) {
  const bhavaPlanetsOnly = bhavas.filter((b) => b.planet != undefined);
  let SSLlist = [];
  calcPrimaryPlanets.forEach((PrimaryPlanet) => {
    let SSLtemp = [];
    bhavaPlanetsOnly.forEach((bhavaPlanet) => {
      if (
        PrimaryPlanet[bhavaPlanet.planet] != true &&
        PrimaryPlanet[bhavaPlanet.planetNakLord] != true &&
        PrimaryPlanet[bhavaPlanet.planetSubLord] != true &&
        bhavaPlanet.planetNakLord != bhavaPlanet.planetSubLord &&
        PrimaryPlanet[bhavaPlanet.planetSubSubLord] == true
      )
        SSLtemp.push(bhavaPlanet.planet);
    });
    SSLlist.push(SSLtemp);
  });
  SSLlist.forEach((element, index) => {
    bhavaTable[index + 1]["SSLlist"] = element;
  });
};

const populateDefaultValue = function (bhavaTable, bhavas) {
  const LHS = bhavas.filter((b) => b.houseId);

  let BHL = [];
  BHL[0] = LHS[0]["bukthiLord"];
  for (let i = 2; i <= 12; i++) {
    if (bhavaTable[i]["connectedPL"].includes(BHL[0])) BHL[i - 1] = BHL[0];
    else BHL[i - 1] = LHS[i - 1]["bukthiLord"];
  }
  BHL.forEach((iterator, index) => {
    bhavaTable[index + 1]["defaultValue"] = iterator;
  });
};

const populatePrimaryBhava = function (planetTable, bhavas, planetList) {
  let bhavaTable = {};
  populatePrimaryPlanets(bhavaTable, bhavas);
  populateLocatedPL(bhavaTable, bhavas);
  const calcPrimPlan = calculationPrimaryPlanets(bhavaTable);
  populateConnectedPL(bhavaTable, calcPrimPlan, bhavas);
  let primBhTemp = [];
  let primBhArray = [];
  planetList.forEach((planet) => {
    primBhArray.push(primBhTemp);
    primBhTemp = [];

    calcPrimPlan.forEach((item, i) => {
      if (calcPrimPlan[i][planet]) primBhTemp.push(i + 1);
    });
  });
  primBhArray.push(primBhTemp);
  primBhArray.shift();
  planetList.forEach((planet, index) => {
    planetTable[planet] = { primaryBhava: primBhArray[index] };
  });
};

const populateLocatedBhava = function (planetTable, bhavas, planetList) {
  let locBhTemp = [];
  let locatedBh = [];
  let bhavaTable = {};
  populatePrimaryPlanets(bhavaTable, bhavas);
  populateLocatedPL(bhavaTable, bhavas);
  const calcPrimPlan = calculationPrimaryPlanets(bhavaTable);

  planetList.forEach((planet) => {
    locatedBh.push(locBhTemp);
    locBhTemp = [];
    calcPrimPlan.forEach((item, i) => {
      if (bhavaTable[i + 1]["locatedPL"].includes(planet))
        locBhTemp.push(i + 1);
    });
  });
  locatedBh.push(locBhTemp);
  locatedBh.shift();
  planetList.forEach((planet, index) => {
    planetTable[planet]["locatedBhava"] = locatedBh[index];
  });
};

const populateConnectedBhava = function (planetTable, bhavas, planetList) {
  let bhavaTable = {};
  populatePrimaryPlanets(bhavaTable, bhavas);
  populateLocatedPL(bhavaTable, bhavas);
  const calcPrimPlan = calculationPrimaryPlanets(bhavaTable);
  populateConnectedPL(bhavaTable, calcPrimPlan, bhavas);
  let connectedBhavaTemp = [];
  let connectedBhavas = [];

  planetList.forEach((planet) => {
    connectedBhavas.push(connectedBhavaTemp);

    connectedBhavaTemp = [];

    calcPrimPlan.forEach((item, i) => {
      if (bhavaTable[i + 1]["connectedPL"].includes(planet))
        connectedBhavaTemp.push(i + 1);
    });
  });
  connectedBhavas.push(connectedBhavaTemp);
  connectedBhavas.shift();
  planetList.forEach((planet, index) => {
    planetTable[planet]["connectedBhava"] = connectedBhavas[index];
  });
};

export const getPlanetTable = (bhavas) => {
  if (bhavas.length > 0) {
    const planetList = [
      "Sun",
      "Moon",
      "Mars",
      "Rahu",
      "Jupiter",
      "Saturn",
      "Mercury",
      "Ketu",
      "Venus",
    ];

    let planetTable = {};
    populatePrimaryBhava(planetTable, bhavas, planetList);
    populateLocatedBhava(planetTable, bhavas, planetList);
    populateConnectedBhava(planetTable, bhavas, planetList);
    let PlanetTableArray = [];
    for (const planet in planetTable) {
      PlanetTableArray.push({
        planetName: planet,
        primBh: planetTable[planet]["primaryBhava"],
        locBh: planetTable[planet]["locatedBhava"],
        connectBh: planetTable[planet]["connectedBhava"],
      });
    }

    return PlanetTableArray;
  }
};

export const getPPTable = function (bhavas) {
  if (bhavas.length > 0) {
    let bhavaTable = {};
    populatePrimaryPlanets(bhavaTable, bhavas);
    populateLocatedPL(bhavaTable, bhavas);
    const calcPrimPlan = calculationPrimaryPlanets(bhavaTable);
    populateConnectedPL(bhavaTable, calcPrimPlan, bhavas);
    populateSSLlist(bhavaTable, calcPrimPlan, bhavas);
    populateDefaultValue(bhavaTable, bhavas);

    const ppList = [];
    for (let bhava in bhavaTable) {
      ppList.push({
        houseId: bhava,
        count: bhavaTable[bhava]["connectedPLCount"],
        pp: Object.keys(bhavaTable[bhava]["primaryPL"]).map((p) =>
          p.substring(0, 2)
        ),
        loc: bhavaTable[bhava]["locatedPL"].map((p) => p.substring(0, 2)),
        pl: bhavaTable[bhava]["connectedPL"].map((p) => p.substring(0, 2)),
        SSLlist: bhavaTable[bhava]["SSLlist"].map((p) => p.substring(0, 2)),
      });
    }

    return ppList;
  }
};

export const locateIndex = (chart, planetDegree) => {
  let located = chart.length;
  for (let idx = 0; idx < chart.length - 1; idx++) {
    let currentDegree = chart[idx].degree;
    let nextDegree = chart[idx + 1].degree;
    if (currentDegree <= nextDegree) {
      if (currentDegree <= planetDegree && planetDegree <= nextDegree) {
        located = idx;
      }
    } else {
      if (currentDegree <= planetDegree && planetDegree > nextDegree) {
        located = idx;
      } else if (planetDegree <= nextDegree) {
        located = idx;
      }
    }
  }
  return located + 1;
};
