import {createSlice} from "@reduxjs/toolkit";
import {airportType} from "../../types/airport";


type initialStateType = {
    airports: Array<airportType>
}
const initialState: initialStateType = {
    airports: []
}

export const airportSlice = createSlice({
    name: 'airport',
    initialState,
    reducers: {
        setAirports: (state, action) => {
            state.airports = action.payload.airports
        }
    }
})
export default airportSlice.reducer