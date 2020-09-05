import React, { Component } from 'react';
import logo from './logo.svg';
import {Data,dasaData,bukthiData,anthraData,sukshmaData,adhiSukshmaData} from "./mock_data/local";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component{
  constructor(props){
    super(props); 
    this.state={
      data:[]
    }
  }
  componentDidMount(){
    let houseChart=Data.houses;
    let PlanetChart=Data.planets;
    let chart=houseChart.concat(PlanetChart).sort((a,b) =>a.norm_degree - b.norm_degree);
    this.setState({data:chart})
  }
  render(){
     const {data}=this.state;
     console.log("chart",data);
  return(
    <div>  
    <div className="pt_search" >
    <input className="pt_input"  type="text" placeholder="Enter the name"/>
       <input className="pt_input" type="date"/>
        <input type="time" className="pt_input" />
        <input type="number"className="pt_input" placeholder="Seconds"/>
        <input type="number" className="pt_input"placeholder="Latitude"/>
        <input type="number"className="pt_input" placeholder="Longitude"/>
        <input type="number"className="pt_input" placeholder="TimeZone"/>
         <button className="pt_button">Search</button>
    </div>
    <div className="pt_table">
    <table className="table">
      <thead>
        <tr>
          <td>Planet Name</td>
          <td>Sign Name</td>
          <td>Sign Lord</td>
          <td>House No</td>
          <td>House Lord</td>
          <td>Nakshathra Name</td>
          <td>Nakshathra Lord</td>
          <td>Normal Degree</td>
          <td>Sub lord</td>
          <td>Sub Sub Lord</td>
          <td>Sub Sub Lord</td>
          <td></td>
        </tr>
      </thead>
        {data.map((c, idx) => (
          <tr>
           <td>{c.planet_name}</td>
        <td>{c.sign_name}</td>
        <td>{c.sign_lord}</td>
        <td>{c.house}</td>
        <td>{c.house_lord}</td>
        <td>{c.nakshatra_name}</td>
        <td>{c.nakshatra_lord}</td>
        <td>{c.norm_degree}</td>
        <td>{c.sub_lord}</td>
        <td>{c.sub_sub_lord}</td>
        <td>{c.sub_sub_sub_lord}</td>
          </tr>
        ))}
        </table>

    </div>
    <div style={{marginTop:50}}>
    <h1 style={{fontSize:14,textAlign:"center"}}>Datas</h1>
   
    <div className="pt_maincard">
  
    <div className="pt_card">
    <h1 style={{fontSize:14,textAlign:"center"}}>DasaData</h1>
     {dasaData.map(i=>{
       return(
      <div className="pt_smallcard">
        <div style={{display:"flex",fontSize:12}}>
       <p>{i.planet}</p>&nbsp; 
       <p>{i.start}</p>&nbsp;
       <p>{i.end}</p>
       </div>
       </div>
     )})}
     </div>
     <div className="pt_card">
       <h1 style={{fontSize:14,textAlign:"center"}}>BukthiData</h1>
      {bukthiData.map(i=>{
       return(
      <div className="pt_smallcard">
      <div style={{display:"flex",fontSize:12}}>
       <p>&nbsp;{i.planet}</p>
       <p>&nbsp;{i.start}</p>&nbsp;
       <p>{i.end}</p>
       </div>
       </div>
     )})}
     </div>
     <div className="pt_card">
       <h1 style={{fontSize:14,textAlign:"center"}}>AnthraData</h1>
      {anthraData.map(i=>{
       return(
      <div className="pt_smallcard">
      <div style={{display:"flex",fontSize:12}}>
       <p>{i.planet}</p>
       <p>&nbsp;{i.start}</p>&nbsp;
       <p>{i.end}</p>
       </div>
       </div>
     )})}
     </div>
     <div className="pt_card">
       <h1 style={{fontSize:14,textAlign:"center"}}>SukshmaData</h1>
      {sukshmaData.map(i=>{
       return(
      <div className="pt_smallcard">
       <div style={{display:"flex",fontSize:12}}>
       <p>{i.planet}</p>
       <p>&nbsp;{i.start}</p>&nbsp;
       <p>&nbsp;{i.end}</p>
       </div>
       </div>
     )})}
     </div>
     <div className="pt_card">
       <h1 style={{fontSize:14,textAlign:"center"}}>AdhisukshmaData</h1>
      {adhiSukshmaData.map(i=>{
       return(
      <div className="pt_smallcard">
      <div style={{display:"flex",fontSize:12}}>
       <p>{i.planet}</p>
       <p>&nbsp;{i.start}</p>&nbsp;
       <p>&nbsp;{i.end}</p>
       </div>
       </div>
     )})}
     </div>
     </div>
     <button className="pt_button" style={{float:"right",marginRight:20,marginTop:20}}>Reset</button>
    </div>
    </div>

  )

  }
}

export default App;
