import React from 'react';
import logo from './logo.svg';
import './App.css';
import CreateFlights from "./pages/flights/CreateFlights/CreateFlights";
import {Route, Routes} from "react-router-dom";
import Flights from "./pages/flights/Flights/Flights";

function App() {
  return (
    <div className="App">
        <Routes>
            <Route path={'/create_flights'} element={<CreateFlights/>}/>
            <Route path={'/'} element={<Flights/>}/>
        </Routes>
    </div>
  );
}

export default App;
