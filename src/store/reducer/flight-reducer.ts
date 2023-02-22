import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    flights: []
}

export const flightReducer = createSlice({
    name: 'flight',
    initialState,
    reducers: {
        setFlights: (state, action) => {
            state.flights = action.payload.flights
        }
    }
})
export default flightReducer.reducer