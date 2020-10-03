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
                <p>&nbsp;{i.planet}</p>
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
      dasha: {}
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
          <input className="pt_input" name="date" type="date" placeholder="2020-10-02" onChange={(event) => this.handleInput(event)} />
          <input type="time" name="time" className="pt_input" placeholder="08:00" onChange={(event) => this.handleInput(event)} />
          <input type="number" name="seconds" className="pt_input" placeholder="15" onChange={(event) => this.handleInput(event)} />
          <input type="number" name="lat" className="pt_input" placeholder="11.45" onChange={(event) => this.handleInput(event)} />
          <input type="number" name="lon" className="pt_input" placeholder="10.40" onChange={(event) => this.handleInput(event)} />
          <input type="text" name="tzone" className="pt_input" placeholder="5.5" onChange={(event) => this.handleInput(event)} />
          <button className="pt_button" onClick={this.handleSearch}>Search</button>
        </div>
        <div className="pt_table">
          <table className="table">
            <thead>
              <tr>
                <td>PL</td>
                <td>SN</td>
                <td>SL</td>
                <td>HN</td>
                <td>HL</td>
                <td>DN</td>
                <td>DAL</td>
                <td>Full Degree</td>
                <td>BHL</td>
                <td>ANL</td>
                <td>SUKL</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {data.map((c, idx) => (
                <tr key={`data${idx}`}>
                  <td>{c.planet}</td>
                  <td>
                    {c.planetSignName && (
                      <Fragment>
                        <i class="material-icons"  style={{cursor:'pointer'}}data-tip data-for={`planetSignNametooltip${idx}`}>
                          visibility_off</i>
                        <ReactTooltip place="top" type="dark" id={`planetSignNametooltip${idx}`}>
                          {c.planetSignName}
                        </ReactTooltip>
                      </Fragment>)}
                  </td>
                  <td>{c.planetSignLord}</td>
                  <td>{c.houseNo}</td>
                  <td>{c.houseLord}</td>
                  <td>
                    {c.houseNakshathraName && (
                      <Fragment>
                        <i class="material-icons" style={{cursor:'pointer'}} data-tip data-for={`houseNakshathraNametooltip${idx}`}>
                          visibility_off</i>
                        <ReactTooltip place="top" type="dark" id={`houseNakshathraNametooltip${idx}`}>
                          {c.houseNakshathraName}
                        </ReactTooltip>
                      </Fragment>)}
                  </td>
                  <td>{c.dhasaLord}</td>
                  <td>{c.degree}</td>
                  <td>{c.bukthiLord}</td>
                  <td>{c.antharaLord}</td>
                  <td>
                    {c.sukLord && (
                      <Fragment>
                        <i class="material-icons" style={{cursor:'pointer'}}sss data-tip data-for={`sukLordtooltip${idx}`}>
                          visibility_off</i>
                        <ReactTooltip place="top" type="dark" id={`sukLordtooltip${idx}`}>
                          {c.sukLord}
                        </ReactTooltip>
                      </Fragment>)}
                  </td>
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

