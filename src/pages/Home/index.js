import React, { Component, useState, Fragment } from 'react';
import ReactTooltip from 'react-tooltip';
import { connect } from "react-redux"
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
  subDasha4
} from "../../api_helper/slice/homeSlice";
import { prepareChartData } from "./helper"
import "../../App.css"


const DisplayDhasa = ({ data, title, handleClick, keyName }) => {
  const [selecInd, setSelecInd] = useState(null)
  return (
    data.length > 0
      ? (<div className="pt_card">
        <h1 style={{ fontSize: 14, textAlign: "center" }}>{title}</h1>
        {data.map(i => {
          return (
            <div className={`pt_smallcard ${selecInd === i ? "selected_card" : ""}`} onClick={() => {
              handleClick(i.planet, keyName)
              setSelecInd(i)
            }}>
              <div style={{ display: "flex", fontSize: 12 }}>
                <p>&nbsp;{i.planet.substring(0,2)}</p>
                <p>&nbsp;{i.start}</p>&nbsp;
       <p>{i.end}</p>
              </div>
            </div>
          )
        })}
      </div>)
      : null
  )
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dasha: {},
      date: '1985-10-13',
      time: '12:36',
      day: 13,
      month: 10,
      year: 1985,
      hour: 12,
      min: 36,
      seconds: 45,
      lat: 11.7384,
      lon: 78.9639,
      tzone: 5.5,
      ayanamsha: "KP"
    }
  }
  componentDidMount() {
  }

  handleInput = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSearch = () => {
    const { dispatch } = this.props
    const { ayanamsha, lat, lon, tzone, seconds, date, time } = this.state
    const payload = {
      ayanamsha,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      tzone: tzone,
      seconds: parseInt(seconds),
    }
    if (date) {
      const splitDate = date.split("-")
      payload.year = parseInt(splitDate[0])
      payload.month = parseInt(splitDate[1])
      payload.day = parseInt(splitDate[2])
    }

    if (time) {
      const splitTime = time.split(":")
      payload.hour = parseInt(splitTime[0])
      payload.min = parseInt(splitTime[1])
    }
    this.setState({
      payload: payload
    })
    if (ayanamsha && lat && lon && tzone && seconds && date && time) {
      dispatch(search(payload));
      dispatch(majorDasha(payload))
    } else {
      alert("Please enter all the data")
    }
  }

  handleDasha = (name, keyName) => {
    const { dispatch } = this.props
    const { dasha, payload } = this.state
    this.setState({
      dasha: {
        ...dasha,
        [keyName]: name
      }
    })
    let queryString = ""

    switch (keyName) {
      case "dasaData":
        queryString = `${name}`
        dispatch(clearDashaAction())
        dispatch(subDasha(payload, queryString))
        break
      case "bukthiData":
        queryString = `${dasha.dasaData}/${name}`
        dispatch(clearBukthiDataAction())
        dispatch(subDasha2(payload, queryString))
        break
      case "anthraData":
        queryString = `${dasha.dasaData}/${dasha.bukthiData}/${name}`
        dispatch(clearAnthraData(payload, queryString))
        dispatch(subDasha3(payload, queryString))
        break
      case "sukshmaData":
        queryString = `${dasha.dasaData}/${dasha.bukthiData}/${dasha.anthraData}/${name}`
        dispatch(clearSukshmaData(payload, queryString))
        dispatch(subDasha4(payload, queryString))
        break
      default:
        break
    }
  }

  render() {
    const { data,
      majorDasha,
      subDasha,
      subDasha2,
      subDasha3,
      subDasha4 } = this.props;
    return (
      <div>
        <div className="pt_search" >
          <input className="pt_input" name="ayanamsha" type="text" placeholder="KP" onChange={(event) => this.handleInput(event)} />
          <input className="pt_input" name="date" type="date" value={this.state.date} onChange={(event) => this.handleInput(event)} />
          <input type="time" name="time" className="pt_input" value={this.state.time} onChange={(event) => this.handleInput(event)} />
          <input type="number" name="seconds" className="pt_input" value={this.state.seconds} onChange={(event) => this.handleInput(event)} />
          <input type="number" name="lat" className="pt_input" value={this.state.lat} onChange={(event) => this.handleInput(event)} />
          <input type="number" name="lon" className="pt_input" value={this.state.lon} onChange={(event) => this.handleInput(event)} />
          <input type="text" name="tzone" className="pt_input" value={this.state.tzone} onChange={(event) => this.handleInput(event)} />
          <button className="pt_button" onClick={this.handleSearch}>Search</button>
        </div>
        <div className="pt_table">
          <table className="table">
            <thead>
              <tr>
                <td>B#</td>
                <td>Hidden</td>
                <td>SL</td>
                <td>DAL</td>
                <td>BHL</td>
                <td>ANL</td>
                <td>Full Degree</td>
                <td>PL</td>
                <td>PSL</td>
                <td>NL</td>
                <td>PSUL</td>
                <td>SSL</td>
          
              </tr>
            </thead>
            <tbody>
              {data.map((c, idx) => (
                <tr key={`data${idx}`}>
                  <td>{idx+1}</td>
                 
                  <td>
                      <Fragment>
                        <i class="material-icons"  style={{cursor:'pointer'}}data-tip data-for={`planetSignNametooltip${idx}`}>
                          visibility_off</i>
                        <ReactTooltip place="top" type="dark" id={`planetSignNametooltip${idx}`}>
                          PSN:{c.planetSignName||"-"}&nbsp;,DN:{c.houseNakshathraName||"-"},&nbsp;HSN:{c.houseSignName||"-"},&nbsp;SUKL:{c.sukLord||"-"},&nbsp;NN:{c.planetNakName||"-"},&nbsp;SSS:{c.planetSubSubSubLord||"-"}
                        </ReactTooltip>
                      </Fragment>
                  </td>
                  
                  {c.houseSignLord===undefined && <td>{"-"}</td>}
                  {c.houseSignLord!==undefined && <td>{c.houseSignLord.substring(0,2)}</td>}
                  {c.dhasaLord===undefined && <td>{"-"}</td>}
                  {c.dhasaLord!==undefined && <td>{c.dhasaLord.substring(0,2)}</td>}
                  {c.bukthiLord ===undefined&& <td>{"-"}</td>}
                  {c.bukthiLord !==undefined&& <td>{c.bukthiLord.substring(0,2)}</td>}
                  {c.antharaLord ===undefined&&<td>{"-"}</td>}
                  {c.antharaLord !==undefined&&<td>{c.antharaLord.substring(0,2)}</td>}
                  <td>{c.degree||"-"}</td>
                  {c.planet ===undefined &&<td>{c.planet||"-"}</td>}
                  {c.planet !==undefined &&<td>{c.planet.substring(0,2)}</td>}
                  {c.planetSignLord ===undefined &&<td>{c.planetSignLord||"-"}</td>}
                  {c.planetSignLord !==undefined &&<td>{c.planetSignLord.substring(0,2)}</td>}
                  {c.planetNakLord ===undefined&&<td>{"-"}</td>}
                  {c.planetNakLord !==undefined&&<td>{c.planetNakLord.substring(0,2)}</td>}
                  {c.planetSubLord ===undefined&&<td>{"-"}</td>}
                  {c.planetSubLord !==undefined&&<td>{c.planetSubLord.substring(0,2)}</td>}
                  {c.planetSubSubLord ===undefined&&<td>{"-"}</td>}
                  {c.planetSubSubLord !==undefined&&<td>{c.planetSubSubLord.substring(0,2)}</td>}
                 </tr>
              ))}
            </tbody>
          </table>

        </div>
        <div style={{ marginTop: 50 }}>
          <h1 style={{ fontSize: 14, textAlign: "center" }}>Datas</h1>

          <div className="pt_maincard">

            <DisplayDhasa data={majorDasha} title="DasaData" handleClick={this.handleDasha} keyName="dasaData" />
            <DisplayDhasa data={subDasha} title="BukthiData" handleClick={this.handleDasha} keyName="bukthiData" />
            <DisplayDhasa data={subDasha2} title="AnthraData" handleClick={this.handleDasha} keyName="anthraData" />
            <DisplayDhasa data={subDasha3} title="SukshmaData" handleClick={this.handleDasha} keyName="sukshmaData" />
            <DisplayDhasa data={subDasha4} title="AdhisukshmaData" handleClick={this.handleDasha} keyName="adhisukshmaData" />
          </div>
        </div>
      </div>

    )

  }
}

function mapStateToProps(state) {
  const { home } = state;
  const { search, majorDasha, subDasha, subDasha2, subDasha3, subDasha4 } = home
  const { houses, planets } = search || ""
  const chart = (houses && planets) ? prepareChartData(houses, planets) : [];
  return {
    home,
    data: chart,
    majorDasha,
    subDasha,
    subDasha2,
    subDasha3,
    subDasha4
  }
}

export default withRouter(connect(mapStateToProps)(Home))

