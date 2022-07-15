import React, { useEffect, useState } from 'react';
import './App.css';
import useAsyncFetch from './useAsyncFetch'; // a custom hook
import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import { UserData } from "./Data.js"
import MonthPicker from './MonthPicker';


const lakeCapacities = [
  "4552000",
  "3537577", 
  "2447650",
  "2400000",
  "56400",
  "2030000",
  "1602000"
];

function App() {
  
  const [view, updateView] = useState("hidden");
  const [date, setDate] = useState({month: "April", year: 2020});
  
  console.log(view);
  const monthsDict = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
  }

    const monthsDictRev = {
    "January": 1,
    "February": 2,
    "March": 3,
    "April": 4,
    "May": 5,
    "June": 6,
    "July": 7,
    "August": 8,
    "September": 9,
    "October": 10,
    "November": 11,
    "December": 12
  }

  const [data, updateData] = useState({year: 2020, month: 4});
  
    function yearChange(newYear) {
      let m = date.month;
      setDate({year: newYear, month: m });
      updateData({year: newYear, month: monthsDictRev[m]});
    }

    function monthChange(newMonth){
      let y = date.year;
      setDate({month: monthsDict[newMonth], year: y});
      updateData({year: y, month: newMonth});
    }

  // let a = LakesDisplay()
  
  if(false) {
  return (

      <main ><LakesDisplay /></main> 
    
  )
  }
  
  return (
    <div className = "container">
      <div className = "header">
        <h3 className="line1">Water storage in &nbsp;</h3>
        <h3 className="line2">California Reservoirs</h3>
      </div>
      <main className="main">
        <div className="topOfPage">
          <div className = "information">
            <p className = "bodyText">
            California's reservoirs are part of a <a href="https://www.ppic.org/wp-content/uploads/californias-water-storing-water-november-2018.pdf">complex water storage system</a>.  The State has very variable weather, both seasonally and from year-to-year, so storage and water management is essential.  Natural features - the Sierra snowpack and vast underground aquifers - provide more storage capacity,  but reservoirs are the part of the system that people control on a day-to-day basis.  Managing the flow of surface water through rivers and aqueducts, mostly from North to South, reduces flooding and attempts to provide a steady flow of water to cities and farms, and to maintain natural riparian habitats.  Ideally, it also transfers some water from the seasonal snowpack into long-term underground storage.  Finally, hydro-power from the many dams provides carbon-free electricity. 
            </p>
            <p> California's water managers monitor the reservoirs carefully, and the state publishes daily data on reservoir storage.</p>
            <ButtonView update = {updateView} view = {view} />
          </div>
          <div className = "droughtImage">
            <img src="https://cdn.theatlantic.com/thumbor/HYdYHLTb9lHl5ds-IB0URvpSut0=/900x583/media/img/photo/2014/09/dramatic-photos-of-californias-historic-drought/c01_53834006/original.jpg
            "/>
            Lake Oroville in the 2012-2014 drought. Image credit Justin Sullivan, from The Atlatic article Dramatic Photos of California's Historic Drought.
          </div>
        </div>
        
        <div className="bottomOfPage">
          <div className = "lakeDisplay" style = {{visibility:view}}>
            <main ><LakesDisplay data = {data} /></main>
          </div>
          <div className = "monthPicker" style = {{visibility:view}}>
            <p id = "data" style = {{visibility:view}}>
              Here's a quick look at some of the data on reservoirs from the <a href="https://cdec.water.ca.gov/index.html">California Data Exchange Center</a>, which consolidates climate and water data from multiple federal and state government agencies, and  electric utilities.  Select a month and year to see storage levels in the eleven largest in-state reservoirs.
            </p>
            <p style={{ color: 'rgb(120,199,227)' }}> <strong>Change month:</strong></p>
            <MonthPicker  
              // props 
              date = {date}
              yearFun = {yearChange}
              monthFun = {monthChange}
            />
          </div>
        </div>
        
            
      </main>
    </div> 
  );
}

function LakesChart(props) {
  const nicknames = new Map();
  nicknames.set(0, 'Shasta');
  nicknames.set(1, 'Oroville');
  nicknames.set(2, 'Trinity Lake');
  nicknames.set(3, 'New Melones');
  nicknames.set(4, 'San Luis');
  nicknames.set(5, 'Don Pedro');
  nicknames.set(6, 'Berryessa');
  
  if (props.lakes) {
    let n = props.lakes.length;
    console.log("64:", props.lakes);

    // objects containing row values
    let currLevelsObj = {label: "current storage level",data: [], backgroundColor: ["rgb(66,145,152)"]}
    let totalCapObj = {label: "total capacity", data: [], backgroundColor: ["rgb(120,199,227)"]}
    let labels = [];
    
    for (let i=0; i<n; i++) {
      currLevelsObj.data.push(props.lakes[i].value);
      totalCapObj.data.push(lakeCapacities[i]);
      labels.push(nicknames.get(i));
    }


  let userData = {};
  userData.labels = labels;
  // currLevelsObj.data = UserData.map((data) => data.userGain)
  // totalCapObj.data = currLevelsObj.data.map((data) => (data * 1.5))
  userData.datasets = [currLevelsObj, totalCapObj];

console.log(userData);
let options = {
  plugins: {
    title: {
      display: true,
    },
    legend: {
      display: false,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    xAxes: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 95,
                    minRotation: 65
                },
                stacked: true
            },
    y: {
      grid: {
        display: false
      }
    }
  }
};


      return (
        <div id="chart-container">
          <Bar options={options} data={userData} />
        </div>
      )
  }
}


function LakesDisplay(data) {

  console.log("in LakesDisplay");
  console.log("in LakesDisplay: ---", data);
  // static var will contain the list of schools
  const [lakes, setLakeData] = useState([]);

  // call the custom fetch hook, passing it the callback functions that it can use
  
  // if(data.year == undefined) {data = {
  //   year : "2021",
  //   month : "09"
  // }

                               console.log("dd:", data.data);
                          
  //           }
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.data)
    };
  useAsyncFetch("/query/askForData", requestOptions, thenFun, catchFun);
  

  function thenFun (result) {
    // setSchools(result);
    console.log("result:", result.curr);
    setLakeData(result.curr);
    // render the list once we have it
  }

  function catchFun (error) {
    console.log(error);
  }

  // will re-render once state variable schools changes
  if (lakes) { //if(schools)
  return (
      <LakesChart lakes={lakes}> </LakesChart>
  )
  } else {
    return (<p>
      loading...
    </p>);
  }
// make list of li elements -- we are only interested in the names of the schools, so extract that from each element in schools
  /*
  let itemElems = [];
  for (let i = 0; i < schools.length; i++){
    let sch = schools[i];
    itemElems.push(<li key={i}> {sch.name+","+sch.midIncome+","+sch.sticker} </li>);
  }
*/
}

function ButtonView(props) {
  let updateButtonfn = props.update;
  let viewButtonState = props.view;
  let buttonToShow;
  let view = document.getElementById("data")

  

  console.log(view)
  
  if (viewButtonState === "hidden") {
         buttonToShow = <button onClick={function() {updateButtonfn("visible");}}>See More</button>
    
         }
         else {
          buttonToShow = <button onClick={function() {updateButtonfn("hidden");view.style.visibility = 'hidden';}
        }>See Less</button>
           
         }

  return (
       <div className="buttons">
         {buttonToShow}
       </div>
    
  );
}
export default App;