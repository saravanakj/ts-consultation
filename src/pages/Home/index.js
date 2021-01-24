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
import { LocationSearchInput } from "../../components/LocationSearchInput/LocationSearchInput";

const DisplayDhasa = ({ data, title, handleClick, keyName }) => {
  const [selecInd, setSelecInd] = useState(null)
  return (
    data.length > 0
      ? (<div className="pt_card">
        <h1>{title}</h1>
        <div className="pt_smallcard_cotaier">
        {data.map(i => {
          return (
            
              <div className={`pt_smallcard ${selecInd === i ? "selected_card" : ""}`} onClick={() => {
                handleClick(i.planet, keyName)
                setSelecInd(i)
              }}>
                <div style={{ display: "table", fontSize: 12 }}>
                  <div className="dasa_cell w20">{i.planet.substring(0,2)}</div>
                  <div className="dasa_cell w40">{i.start.substring(0,10)}</div>
                  <div className="dasa_cell w40">{i.end.substring(0,10)}</div>
                </div>
              </div>
           
          )
        })}
         </div>
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
      date: '1981-10-14',
      time: '12:40:45',
      day: 14,
      month: 10,
      year: 1981,
      hour: 12,
      min: 40,
      seconds: 45,
      lat: 11.7384,
      lon: 78.9639,
      tzone: 5.5,
      ayanamsha: "KP",
      place: ''
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
      payload.seconds = parseInt(splitTime[2])
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

  locationSelected = (data) => {
    this.setState({
      lat: data.latLng.lat,
      lon: data.latLng.lng,
      place: data.address
    });
  }

  onReceiveLocationOtherDetails = (data) => {
    let tzone= data.offset ? data.offset/60 : this.state.tzone;
    this.setState({
      tzone: tzone
    });
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
        <div className="row_block">
          <div className="pt_search" >
            <input className="pt_input search_txt_box w10" name="ayanamsha" type="text" placeholder="Name" onChange={(event) => this.handleInput(event)} />
            <input className="pt_input w15" name="date" type="date" value={this.state.date} onChange={(event) => this.handleInput(event)} />
            <input type="text" name="time" className="pt_input w15" value={this.state.time} onChange={(event) => this.handleInput(event)} />
            <input type="number" name="lat" className="pt_input w10" value={this.state.lat} onChange={(event) => this.handleInput(event)} />
            <input type="number" name="lon" className="pt_input w10" value={this.state.lon} onChange={(event) => this.handleInput(event)} />
            <input type="text" name="tzone" className="pt_input w10" value={this.state.tzone} onChange={(event) => this.handleInput(event)} />
            <LocationSearchInput address={this.state.place}
              className="places-input"
               locationSelected={this.locationSelected} 
               onReceiveOtherDetails={this.onReceiveLocationOtherDetails}/>
            <button className="pt_button w100p" onClick={this.handleSearch}>Chart</button>
          </div>
        </div>
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
                  <td>Deg</td>
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
                    <td className="bava_no">{c.houseId}</td>
                  
                    <td className="dull_part1">
                        <Fragment>
                          <i class="material-icons"  style={{cursor:'pointer'}}data-tip data-for={`planetSignNametooltip${idx}`}>
                            visibility_off</i>
                          <ReactTooltip place="top" type="dark" id={`planetSignNametooltip${idx}`}>
                            PSN:{c.planetSignName||"-"}&nbsp;,DN:{c.houseNakshathraName||"-"},&nbsp;HSN:{c.houseSignName||"-"},&nbsp;SUKL:{c.sukLord||"-"},&nbsp;NN:{c.planetNakName||"-"},&nbsp;SSS:{c.planetSubSubSubLord||"-"}
                          </ReactTooltip>
                        </Fragment>
                    </td>
                    
                    {c.houseSignLord===undefined && <td>{""}</td>}
                    {c.houseSignLord!==undefined && <td className="dull_part">{c.houseSignLord.substring(0,2)}</td>}
                    {c.dhasaLord===undefined && <td className="highlight">{""}</td>}
                    {c.dhasaLord!==undefined && <td className="highlight">{c.dhasaLord.substring(0,2)}</td>}
                    {c.bukthiLord ===undefined&& <td>{""}</td>}
                    {c.bukthiLord !==undefined&& <td className="highlight">{c.bukthiLord.substring(0,2)}</td>}
                    {c.antharaLord ===undefined&&<td>{""}</td>}
                    {c.antharaLord !==undefined&&<td className="highlight">{c.antharaLord.substring(0,2)}</td>}
                    <td>{c.degree.toFixed(2)||""}</td>
                    {c.planet ===undefined &&<td className="highlight">{c.planet||""}</td>}
                    {c.planet !==undefined &&<td className="highlight">{c.planet.substring(0,2)}</td>}
                    {c.planetSignLord ===undefined &&<td className="dull_part">{c.planetSignLord||""}</td>}
                    {c.planetSignLord !==undefined &&<td className="dull_part">{c.planetSignLord.substring(0,2)}</td>}
                    {c.planetNakLord ===undefined&&<td>{""}</td>}
                    {c.planetNakLord !==undefined&&<td className="highlight">{c.planetNakLord.substring(0,2)}</td>}
                    {c.planetSubLord ===undefined&&<td>{""}</td>}
                    {c.planetSubLord !==undefined&&<td className="highlight">{c.planetSubLord.substring(0,2)}</td>}
                    {c.planetSubSubLord ===undefined&&<td>{""}</td>}
                    {c.planetSubSubLord !==undefined&&<td className="highlight">{c.planetSubSubLord.substring(0,2)}</td>}
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
          <div className="pt_table table_split float_right">
          <div className="pt_maincard bava_table_container">

            <DisplayDhasa data={majorDasha} title="Dasa Table" handleClick={this.handleDasha} keyName="dasaData" />
            <DisplayDhasa data={subDasha} title="Bukthi Table" handleClick={this.handleDasha} keyName="bukthiData" />
            <DisplayDhasa data={subDasha2} title="Anthra Table" handleClick={this.handleDasha} keyName="anthraData" />
            <DisplayDhasa data={subDasha3} title="Sukshma Table" handleClick={this.handleDasha} keyName="sukshmaData" />
            <DisplayDhasa data={subDasha4} title="Adhisukshma Table" handleClick={this.handleDasha} keyName="adhisukshmaData" />
          </div>
            

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

