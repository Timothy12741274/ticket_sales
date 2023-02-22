import {combineReducers, configureStore} from "@reduxjs/toolkit";
import flightReducer from "./reducer/flight-reducer";


const rootReducer = combineReducers({
    flightReducer
})
export const setupStore = () => {
  return configureStore({
      reducer: rootReducer
  })
}
export type StoreType = ReturnType<typeof setupStore>
export type StateType = ReturnType<typeof rootReducer>
export type DispatchType = StoreType['dispatch']