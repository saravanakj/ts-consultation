import React, { Component, useState, Fragment } from "react";
import ReactTooltip from "react-tooltip";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  search,
  majorDasha,
  clearDashaAction,
  clearBukthiDataAction,
  clearAnthraData,
  clearSukshmaData,
  subDasha,
  subDasha2,
  subDasha3,
  subDasha4,
  postCustomerData,
  updateCustomerData,
} from "../../api_helper/slice/homeSlice";
import { prepareChartData, getPPTable, getPlanetTable } from "./helper";
import "../../App.css";
import { LocationSearchInput } from "../../components/LocationSearchInput/LocationSearchInput";
import { db } from '../../firebase/firebaseConfig'
import Alert from '@material-ui/lab/Alert';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

const DisplayDhasa = ({ data, title, handleClick, keyName }) => {
  const [selecInd, setSelecInd] = useState(null);
  return data.length > 0 ? (
    <div className="pt_card">
      <h1>{title}</h1>
      <div className="pt_smallcard_cotaier">
        <table>
          {data.map((i) => {
            return (
              <tr
                className={`pt_smallcard ${
                  selecInd === i ? "selected_card" : ""
                }`}
                onClick={() => {
                  handleClick(i.planet, keyName);
                  setSelecInd(i);
                }}
              >
                <td className="dasa_cell w20">{i.planet.substring(0, 2)}</td>
                <td className="dasa_cell w40">{i.start.substring(0, 10)}</td>
                <td className="dasa_cell w40">{i.end.substring(0, 10)}</td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  ) : null;
};
const setOpacity = (plList = []) => {
  let planetList = ["Su", "Mo", "Ma", "Ra", "Ju", "Sa", "Me", "Ke", "Ve"];
  const styleObj = planetList.map((o) => {
    return { name: o, transparency: !plList.includes(o) };
  });
  return styleObj;
};

const opaqueStyle = { opacity: "0.2" };
const normalStyle = { opacity: "1" };

const DisplayPPList = ({ ppList }) => {
  return ppList.length > 0 ? (
    <div className="pl_card">
      <div className="pt_smallcard_cotaier">
        <table className="table">
          <tr className={`pt_smallcard`}>
            <th className="dasa_cell w20">Bhava#</th>
            <th className="dasa_cell w20">Count</th>
            <th className="dasa_cell w40">Primary Planets</th>
            <th className="dasa_cell w40">Planet Located</th>
            <th className="dasa_cell w40">Connected Planets</th>
          </tr>
          {ppList.map((i) => {
            const planetStyleObjects = setOpacity(i.pl);
            return (
              <tr className={`pt_smallcard`}>
                <td className={`pp_cell w20 ${i.count > 6 ? "highlight" : ""}`}>
                  {i.houseId}
                </td>
                <td className="pp_cell w20">{i.count}</td>
                <td className="pp_cell w40">{i.pp.join(", ")}</td>
                <td className="pp_cell w40">{i.loc.join(", ")}</td>
                <td className="pp_cell w40">
                  {planetStyleObjects.map((pl, i) => (
                    <span style={pl.transparency ? opaqueStyle : normalStyle}>
                      {pl.name}
                      {pl.name != "Ve" ? ", " : ""}
                    </span>
                  ))}
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  ) : null;
};
const DisplayPlanetList = ({ PlanetList }) => {
  return PlanetList[0].primBh.length > 0 ||
    PlanetList[1].primBh.length > 0 ||
    PlanetList[2].primBh.length > 0 ||
    PlanetList[3].primBh.length > 0 ||
    PlanetList[4].primBh.length > 0 ||
    PlanetList[5].primBh.length > 0 ||
    PlanetList[6].primBh.length > 0 ||
    PlanetList[7].primBh.length > 0 ||
    PlanetList[8].primBh.length > 0 ? (
    <div className="pl_card">
      <div className="pt_smallcard_cotaier">
        <table className="table">
          <tr className={`pt_smallcard`}>
            <th className="dasa_cell w20">Planet name</th>
            <th className="dasa_cell w20">Primary Bh</th>
            <th className="dasa_cell w40">Located Bh</th>
            <th className="dasa_cell w40">Connected Bh</th>
          </tr>
          {PlanetList.map((i) => {
            return (
              <tr className={`pt_smallcard`}>
                <td className={`pp_cell w20 `}>{i.planetName}</td>
                <td className="pp_cell w20">{i.primBh.join(", ")}</td>
                <td className="pp_cell w40">{i.locBh.join(", ")}</td>
                <td className="pp_cell w40">{i.connectBh.join(", ")}</td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  ) : null;
};
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
      time: "",
      day: null,
      month: null,
      year: null,
      hour: null,
      min: null,
      seconds: null,
      lat: 0,
      lon: 0,
      tzone: null,
      ayanamsha: "",
      place: "",
      showAlert: false,
    };
  }

  componentWillMount() {
    window.addEventListener("beforeunload", () => {
      this.props.history.replace("", null);
    });

    if (
      this.props &&
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.selectedRow
    ) {
      db.collection("customer")
        .doc(`${this.props.location.state.selectedRow}`)
        .onSnapshot((querySnapshot) => {
          const customerResponseData = querySnapshot && querySnapshot.data();

          this.setState(
            {
              date: customerResponseData.date,
              time: customerResponseData.time,
              day: customerResponseData.day,
              month: customerResponseData.month,
              year: customerResponseData.year,
              hour: customerResponseData.hour,
              min: customerResponseData.min,
              seconds: customerResponseData.seconds,
              lat: customerResponseData.lat,
              lon: customerResponseData.lon,
              tzone: customerResponseData.tzone,
              ayanamsha: customerResponseData.ayanamsha,
              place: customerResponseData.place,
            },
            () => {
              this.handleSearch();
            }
          );
        });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", () => {});
  }

  handleInput = (event) => {
    switch (event.target.name) {
      case "date":
        const splitDate = event.target.value.split("-");
        this.setState({
          ...this.state,
          [event.target.name]: event.target.value,
          year: parseInt(splitDate[0]),
          month: parseInt(splitDate[1]),
          day: parseInt(splitDate[2]),
        });
        break;
      case "time":
        const splitTime = event.target.value.split(":");
        this.setState({
          ...this.state,
          [event.target.name]: event.target.value,
          hour: parseInt(splitTime[0]),
          min: parseInt(splitTime[1]),
          seconds: parseInt(splitTime[2]),
        });
        break;

      case "lat":
        this.setState({
          ...this.state,
          lat: parseFloat(event.target.value),
        });
        break;

      case "lon":
        this.setState({
          ...this.state,
          lat: parseFloat(event.target.value),
        });
        break;
      case "seconds":
        this.setState({
          ...this.state,
          seconds: parseInt(event.target.value),
        });
        break;
      default:
        this.setState({
          [event.target.name]: event.target.value,
        });
    }
  };


  createKeywords = (name) => {
    const keywordsArray = [];
    let currentKeyword = '';
    name.split('').forEach(letter => {
      currentKeyword += letter.toLowerCase()
      keywordsArray.push(currentKeyword)
    });
    return keywordsArray;
  }

  generateKeywords = (name, place) => {
    const keywordName = this.createKeywords(name);
    const keywordPlace = this.createKeywords(place);

    return [
      ...new Set([...keywordName, ...keywordPlace,])
    ]
  };


  saveUpdateHandler = () => {
    const { dispatch } = this.props;

    if (this.props.data) {
      const {
        year,
        month,
        day,
        hour,
        min,
        seconds,
        lat,
        lon,
        ayanamsha,
        tzone,
        date,
        time,
        place,
      } = this.state;

      const customerData = {
        year,
        month,
        day,
        hour,
        min,
        seconds,
        lat,
        lon,
        ayanamsha,
        tzone,
        date,
        time,
        place,
      };

      const details = {
        data: customerData,
        keywords: this.generateKeywords(ayanamsha, place),
        chartDetails: {
          chart: this.props.data,
          bhavaChart: this.props.ppList,
        },
      };

      if (
        this.props &&
        this.props.location &&
        this.props.location.state &&
        this.props.location.state.selectedRow
      ) {
        dispatch(
          updateCustomerData(details, this.props.location.state.selectedRow)
        );
        this.props.history.push("/customer-list");
      } else {
        dispatch(postCustomerData(details));
        this.setState({
          showAlert: true,
        });
      }

      setTimeout(() => {
        this.setState({
          showAlert: false,
        });
      }, 4000);
    }
  };

  viewHandler = () => {
    this.props.history.push('/customer-list')
  };


  handleSearch = () => {
    const { dispatch } = this.props;

    const {
      year,
      month,
      day,
      hour,
      min,
      seconds,
      lat,
      lon,
      ayanamsha,
      tzone,
      date,
      time,
    } = this.state;

    const payload = {
      year,
      month,
      day,
      hour,
      min,
      seconds,
      lat,
      lon,
      ayanamsha,
      tzone,
    };

    if (ayanamsha && lat && lon && tzone && seconds && date && time) {
      dispatch(search(payload));
      dispatch(majorDasha(payload));
    } else {
      alert("Please enter all the data");
    }
  };

  handleDasha = (name, keyName) => {
    const { dispatch } = this.props;
    const { dasha, payload } = this.state;
    this.setState({
      dasha: {
        ...dasha,
        [keyName]: name,
      },
    });
    let queryString = "";

    switch (keyName) {
      case "dasaData":
        queryString = `${name}`;
        dispatch(clearDashaAction());
        dispatch(subDasha(payload, queryString));
        break;
      case "bukthiData":
        queryString = `${dasha.dasaData}/${name}`;
        dispatch(clearBukthiDataAction());
        dispatch(subDasha2(payload, queryString));
        break;
      case "anthraData":
        queryString = `${dasha.dasaData}/${dasha.bukthiData}/${name}`;
        dispatch(clearAnthraData(payload, queryString));
        dispatch(subDasha3(payload, queryString));
        break;
      case "sukshmaData":
        queryString = `${dasha.dasaData}/${dasha.bukthiData}/${dasha.anthraData}/${name}`;
        dispatch(clearSukshmaData(payload, queryString));
        dispatch(subDasha4(payload, queryString));
        break;
      default:
        break;
    }
  };

  locationSelected = (data) => {
    this.setState({
      lat: data.latLng.lat,
      lon: data.latLng.lng,
      place: data.address,
    });
  };

  onReceiveLocationOtherDetails = (data) => {
    let tzone = data.offset ? data.offset / 60 : this.state.tzone;
    this.setState({
      tzone: tzone,
    });
  };

  render() {
    const {
      data,
      ppList,
      PlanetList,
      majorDasha,
      subDasha,
      subDasha2,
      subDasha3,
      subDasha4,
    } = this.props;

      const CustomTooltip = withStyles({
        tooltip:{
          color: 'white',
          background: 'black'
        }
      })(Tooltip)

    return (
      <div>
        
        <Card style={{ width: '98%', margin: '25px auto', backgroundColor: '#E2E4EF', minHeight: 'calc(100vh - 50px)'}}>
      <CardContent className="row_block">
          <div className="pt_search" >
            <input className="pt_input search_txt_box w10" name="ayanamsha" type="text" placeholder="Name" value={this.state.ayanamsha} onChange={(event) => this.handleInput(event)} />
            <input className="pt_input w15" name="date" type="date" value={this.state.date} onChange={(event) => this.handleInput(event)} />
            <input type="time" step='1' name="time" placeholder="Time" className="pt_input w15" value={this.state.time} onChange={(event) => this.handleInput(event)} />
            <input type="hidden" name="lat" className="pt_input w10" value={this.state.lat} onChange={(event) => this.handleInput(event)} />
            <input type="hidden" name="lon" className="pt_input w10" value={this.state.lon} onChange={(event) => this.handleInput(event)} />
            <input type="text" name="tzone" placeholder="Time Zone" className="pt_input w10" value={this.state.tzone} onChange={(event) => this.handleInput(event)} />
            <div style={{display: 'flex', alignItems: 'center'}}>

            <CustomTooltip title={`lat:${this.state.lat.toFixed(4)} lon:${this.state.lon.toFixed(4)}`} arrow placement="top-start">
                <LocationOnIcon />
            </CustomTooltip>

            <LocationSearchInput address={this.state.place}
              className="places-input"
              locationSelected={this.locationSelected}
              onReceiveOtherDetails={this.onReceiveLocationOtherDetails}
            />
                        </div>

            <button className="pt_button w100p" onClick={this.handleSearch}>Generate</button>
            <button className="pt_button w100p" onClick={this.saveUpdateHandler} disabled={this.props.data.length
              ? false : true}>Save</button>
            <button className="pt_button w100p" onClick={this.viewHandler}>Look Up</button>

          </div>
      </CardContent>
      <CardActions>
        {data && data.length > 0 &&
        <div className="table_container">
          <div className="pt_table table_split float_left">
            <table className="table">
              <thead className="table_header">
                <tr>
                  <td className="bava_no">B#</td>
                  <td></td>
                  <td>SL</td>
                  <td>DAL</td>
                  <td>BHL</td>
                  <td>ANL</td>
                  <td>DEG</td>
                  <td>PL</td>
                  <td>PSL</td>
                  <td>NL</td>
                  <td>PSU</td>
                  <td>SSL</td>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.length > 0 &&
                  data.map((c, idx) => (
                    <tr key={`data${idx}`}>
                      <td className="bava_no">{c.houseId}</td>

                      <td className="dull_part1">
                        <Fragment>
                          <i
                            class="material-icons"
                            style={{ cursor: "pointer" }}
                            data-tip
                            data-for={`planetSignNametooltip${idx}`}
                          >
                            visibility_off
                          </i>
                          <ReactTooltip
                            place="top"
                            type="dark"
                            id={`planetSignNametooltip${idx}`}
                          >
                            PSN:{c.planetSignName || "-"}&nbsp;,DN:
                            {c.houseNakshathraName || "-"},&nbsp;HSN:
                            {c.houseSignName || "-"},&nbsp;SUKL:
                            {c.sukLord || "-"},&nbsp;NN:{c.planetNakName || "-"}
                            ,&nbsp;SSS:{c.planetSubSubSubLord || "-"}
                          </ReactTooltip>
                        </Fragment>
                      </td>

                      {c.houseSignLord === undefined && <td>{""}</td>}
                      {c.houseSignLord !== undefined && (
                        <td className="dull_part">
                          {c.houseSignLord.substring(0, 2)}
                        </td>
                      )}
                      {c.dhasaLord === undefined && (
                        <td className="highlight">{""}</td>
                      )}
                      {c.dhasaLord !== undefined && (
                        <td className="highlight">
                          {c.dhasaLord.substring(0, 2)}
                        </td>
                      )}
                      {c.bukthiLord === undefined && <td>{""}</td>}
                      {c.bukthiLord !== undefined && (
                        <td className="highlight">
                          {c.bukthiLord.substring(0, 2)}
                        </td>
                      )}
                      {c.antharaLord === undefined && <td>{""}</td>}
                      {c.antharaLord !== undefined && (
                        <td className="highlight">
                          {c.antharaLord.substring(0, 2)}
                        </td>
                      )}
                      <td>{c.degree.toFixed(2) || ""}</td>
                      {c.planet === undefined && (
                        <td className="highlight">{c.planet || ""}</td>
                      )}
                      {c.planet !== undefined && (
                        <td className="highlight">
                          {c.planet.substring(0, 2)}
                        </td>
                      )}
                      {c.planetSignLord === undefined && (
                        <td className="dull_part">{c.planetSignLord || ""}</td>
                      )}
                      {c.planetSignLord !== undefined && (
                        <td className="dull_part">
                          {c.planetSignLord.substring(0, 2)}
                        </td>
                      )}
                      {c.planetNakLord === undefined && <td>{""}</td>}
                      {c.planetNakLord !== undefined && (
                        <td className="highlight">
                          {c.planetNakLord.substring(0, 2)}
                        </td>
                      )}
                      {c.planetSubLord === undefined && <td>{""}</td>}
                      {c.planetSubLord !== undefined && (
                        <td className="highlight">
                          {c.planetSubLord.substring(0, 2)}
                        </td>
                      )}
                      {c.planetSubSubLord === undefined && <td>{""}</td>}
                      {c.planetSubSubLord !== undefined && (
                        <td className="highlight">
                          {c.planetSubSubLord.substring(0, 2)}
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="pt_table table_split float_right">
            <div className="pt_maincard bava_table_container">
              <DisplayPPList ppList={ppList} />
              <DisplayPlanetList PlanetList={PlanetList} />

              <DisplayDhasa
                data={majorDasha}
                title="Dasa Table"
                handleClick={this.handleDasha}
                keyName="dasaData"
              />
              <DisplayDhasa
                data={subDasha}
                title="Bukthi Table"
                handleClick={this.handleDasha}
                keyName="bukthiData"
              />
              <DisplayDhasa
                data={subDasha2}
                title="Anthra Table"
                handleClick={this.handleDasha}
                keyName="anthraData"
              />
              <DisplayDhasa
                data={subDasha3}
                title="Sukshma Table"
                handleClick={this.handleDasha}
                keyName="sukshmaData"
              />
              <DisplayDhasa
                data={subDasha4}
                title="Adhisukshma Table"
                handleClick={this.handleDasha}
                keyName="adhisukshmaData"
              />
            </div>
          </div>
        </div>
  }
        {
          this.state.showAlert &&
          <div className="alertWrapper">
            <Alert severity="success" style={{ backgroundColor: 'rgb(106, 90, 205)', color: 'white' }}>
              {this.props && this.props.location && this.props.location.state &&
                this.props.location.state.selectedRow && 'Data saved successfully!'}
            </Alert>
          </div>

        }

</CardActions>
</Card>

      </div>
    );
  }
}

function mapStateToProps(state) {
  const { home } = state;
  const { search, majorDasha, subDasha, subDasha2, subDasha3, subDasha4 } =
    home;
  const { houses, planets } = search || "";
  const chart = houses && planets ? prepareChartData(houses, planets) : [];
  const ppList = getPPTable(chart);
  const PlanetList = getPlanetTable(chart);

  return {
    home,
    data: chart,
    ppList,
    PlanetList,
    majorDasha,
    subDasha,
    subDasha2,
    subDasha3,
    subDasha4,
  };
}

export default withRouter(connect(mapStateToProps)(Home));
