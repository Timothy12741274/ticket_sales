import React from 'react';
import logo from './logo.svg';
import './App.css';
import CreateFlights from "./pages/flights/CreateFlights/CreateFlights";
import {Route, Routes} from "react-router-dom";
import Flights from "./pages/flights/Flights/Flights";
import CreateAirport from "./pages/countries/CreateCountries/CreateAirport";
import UpdateAirport from "./pages/countries/CreateCountries/UpdateAirport";
import UpdateFlights from "./pages/flights/UpdateFlights/UpdateFlights";

function App() {
  return (
    <div className="App">
        <Routes>
            <Route path={'/create_flights'} element={<CreateFlights/>}/>
            <Route path={'/create_airport'} element={<CreateAirport/>}/>
            <Route path={'/update_airport'} element={<UpdateAirport/>}/>
            <Route path={'/update_flights'} element={<UpdateFlights/>}/>
            <Route path={'/'} element={<Flights/>}/>
        </Routes>
    </div>
  );
}

export default App;
