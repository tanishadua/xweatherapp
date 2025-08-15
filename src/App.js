import axios from "axios";
import "./App.css";
import { useEffect, useState } from "react";
function App() {
  const [city, setCity] = useState("");
  const [temparature, setTemparature] = useState(0);
  const [humidity, setHumidity] = useState("");
  const [condition, setCondition] = useState("");
  const [speed, setSpeed] = useState("");
  const [show, setShow] = useState(false)
  const [showLoading, setShowLoading] = useState(false)

  const apiKey = "bb766a7b71cb44ba816124435251208";
  const handleInputChange = (e) => {
    setCity(e.target.value);
  };
  useEffect(()=>{
    setShow(false)
  },[city])
  //fetchData function is doing an API call and fetching the data and it will be used as a card
  //With the help of parameters, I am filtering only
  const fetchData = async () => {
    setShowLoading(true)
    try {
      const data = await axios.get(
        "https://api.weatherapi.com/v1/current.json",
        {
          params: {
            q: `${city}`,
            key: `${apiKey}`,
          },
        }
      );
      const result = data.data;
      //console.log(result)
      setTemparature(result.current.feelslike_c);
      //console.log(temparature)
      setHumidity(result.current.humidity);
      //console.log(humidity)
      setCondition(result.current.condition.text);
      setSpeed(result.current.wind_kph);
      setShow(true)
      setShowLoading(false)
    } catch (error) {
      console.error("Error fetching data", error);
      alert("Failed to fetch weather data");
    }
  };

  /*
  How this actually runs
First keystroke (city changes from "" → "a"):

useEffect runs.

setTimeout schedules fetchData() (default delay = 0ms if you don’t pass one).

There’s no cleanup yet because this is the first run for [city].

Second keystroke ("a" → "ab"):

React runs the cleanup function from the previous effect (the return () => clearTimeout(timerId) from step 1).
⮕ This clears the timer from the first keystroke before it can fire.

Then the new effect runs:

Creates a new timerId and schedules a new fetchData().

Third keystroke ("ab" → "abc"):

Cleanup from step 2 runs, clearing that timer.

New timer scheduled.

User stops typing:

No more cleanups triggered because city doesn’t change anymore.

The last timer finally fires → fetchData() runs.*/
  //useEffect is basically like a componentDidMount and componentDidUpdate here, it will run when the application is first mounted in the web browser; also
  //also it runs when user inputs city name to get the results
  /*That’s correct in the sense that the cleanup runs before the new setTimeout is created.
But the return from the first run only runs because city changed for the second time — React always does cleanup first, then runs the new effect.*/
  /* useEffect(()=>{
    if(city !== ""){
      const timerId = setTimeout(()=>{
        fetchData()
      },2000)
      //This is basically scheduled to run first when the user types the 2nd time , so this is run first and then the setTimeout runs in the next useEffect call
      return ()=> {
        clearTimeout(timerId)
      }
    }
  },[city])*/
  const attribute = [
    { attr: "Temparature", val: temparature },
    { attr: "Humidity", val: humidity },
    { attr: "Condition", val: condition },
    { attr: "Wind Speed", val: speed },
  ];

  return (
    <div className="App">
      <div>
        <input
          className="inputText"
          type="text"
          name="name"
          value={city}
          onChange={handleInputChange}
          placeholder="Enter city name"
        />
        <button className="search" onClick={fetchData}>Search</button>
      </div>
      {
        showLoading && <p>Loading data…</p>
      }
      { show && <div className="weather-cards">
        {attribute.map((item) => (
          <div className="weather-card">
            <p>{item.attr}</p>
            { item.attr === "Temparature" && <p className="num">{item.val}°C</p>} 
            { item.attr === "Humidity" && <p className="num">{item.val}%</p> }
            { item.attr === "Condition" && <p className="num">{item.val}</p> }
            { item.attr === "Wind Speed" && <p className="num">{item.val} kph</p> } 
          </div>
        ))}
      </div>}
    </div>
  );
}

export default App;
