import React, {useEffect, useState} from 'react';
import DatePicker from "../../../components/DatePicker/DatePicker";
import dayjs, {Dayjs} from "dayjs";
import {Field, Form, Formik} from "formik";
import axios from "axios";
import {Autocomplete, Button, Checkbox, TextField} from "@mui/material";
import s from './Flights.module.css'
import {useAppDispatch, useAppSelector} from "../../../hooks/hooks";
import {flightReducer} from "../../../store/reducer/flight-reducer";
import { Paper, PaperProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import ryanair_lbl from '../../../asserts/ryanair_lbl.png'
import easyjet_lbl from '../../../asserts/U2.png'
import vueling_lbl from '../../../asserts/VY.png'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import SliderM from "../../../components/Slider/Slider";



const Flights = () => {
    const dispatch = useAppDispatch()
    useEffect(()=>{
        const setFlights = async () => {
            axios.get('http://localhost:5000/api/flights').then((res)=>{
                dispatch(flightReducer.actions.setFlights({flights: res.data}))
            })
        }
        setFlights()
    }, [])
    const flights = useAppSelector(state => state.flightReducer.flights)
    // @ts-ignore
    //console.log(flights)
        //flights.length !== 0 && console.log(getComposedFlights('Lisbon', 'Berlin', flights))

    //console.log(getComposedFlights('A', 'W', ['AB', 'BC', 'BD', 'CS', 'CX', 'DR', 'DE', 'RY', 'RP', 'EM', 'EW']))
    const [value, setValue] = React.useState<Dayjs | null>(
        dayjs(),
    );

    const options = ["Tokyo", "Lisbon", "Berlin", "Palma de Mallorca", "Barcelona"]

    const handleChange = (newValue: Dayjs | null) => {
        setValue(newValue);
    };

    const [fromValue, setFromValue] = useState('');
    const [toValue, setToValue] = useState('');
    const [filteredFlights, setFilteredFlights] = useState<Array<FlightType[]>>([])
    const handleBlur = (event:any) => {
        let i = 0
        let suitableOptions = options
        while (true){
            if(!event.target.value[i]){
                break;
            }
            suitableOptions = suitableOptions.filter((opt:any)=>opt[i].toLowerCase() === event.target.value[i].toLowerCase())
            if (i > 5){
                break;
            } else if(suitableOptions.length === 1){
                setFromValue(suitableOptions[0])
            }  else if(suitableOptions.length === 0) {
                setFromValue('')
                break;
            }
            i++;
        }
    };
    const handleBlur2 = (event:any) => {
        let i = 0
        let suitableOptions = options
        while (true){
            if(!event.target.value[i]){
                break;
            }
            suitableOptions = suitableOptions.filter((opt:any)=>opt[i].toLowerCase() === event.target.value[i].toLowerCase())
            if (i > 5){
                break;
            } else if(suitableOptions.length === 1){
                setToValue(suitableOptions[0])
            }  else if(suitableOptions.length === 0) {
                setToValue('')
                break;
            }
            i++;
        }
    };
    let [cheapestFl, setCheapestFl] = useState<FlightType[]>([])
    let [fastestFl, setFastestFl] = useState<FlightType[]>([])
    const h1 = () => {
        const allFilteredFlights = getAllFilteredFlights(fromValue, toValue, flights)
        // @ts-ignore
        const date = `${value?.get('date') < 10 ? "0" : ""}${value?.get('date')}-${value?.get('month') < 10 ? "0" : ""}${value?.get('month')+1}-${value?.get('year')}`
        const filteredByDateFlights = filterFlightsByDate(date, allFilteredFlights)
        //console.log(allFilteredFlights)
        const bgePrEqCondProvedFls = proveEqOfFltBgePrCond(filteredByDateFlights)
        setFilteredFlights(bgePrEqCondProvedFls)
        setCheapestFl(getCheapestFl(bgePrEqCondProvedFls))
        setFastestFl(getFastestFl(bgePrEqCondProvedFls))
    }
    const h2 = (e:any, opt:number) => {
      if(e.target.value === true){
          setFilteredFlights((s)=>filterByTransferCount(s, opt))
      }
    }
    const StyledPaper = styled(Paper)(({ theme }: { theme: any }) => ({
        backgroundColor: theme.palette.common.white,
    }));
    const h3 = (e:any, nv:any) => {
        console.log(e.target.value)
        console.log(nv)
    }
    return (
        <div>
            <div className={s.wrapper}>
                <Autocomplete
                    PaperComponent={StyledPaper}
                    className={s.autocomplete}
                    freeSolo
                    options={options}
                    onChange={(event:any, newValue:any) => {
                        setFromValue(newValue);
                    }}
                    onBlur={handleBlur}
                    value={fromValue}
                    renderInput={(params:any) => (
                        <TextField
                            {...params}
                            label="From"
                            margin="normal"
                            variant="outlined"
                        />
                    )}
                />
                <Autocomplete
                    PaperComponent={StyledPaper}
                    className={s.autocomplete}
                    freeSolo
                    options={options}
                    onChange={(event:any, newValue:any) => {
                        setToValue(newValue);
                    }}
                    onBlur={handleBlur2}
                    value={toValue}
                    renderInput={(params:any) => (
                        <TextField
                            {...params}
                            label="To"
                            margin="normal"
                            variant="outlined"
                        />
                    )}
                />
                <span className={s.span}>
                <DatePicker PaperComponent={StyledPaper} className={s.picker} value={value} handleChange={handleChange}/>
                    </span>
                <Button color={"warning"} className={s.btn} size={"large"} onClick={h1}>Find</Button>
                <div className={s.adjoin_dates}>

                </div>
            </div>
            <div className={s.catalog}>
                <div className={s.options}>
                    <div className={s.track_price}>
                        <span>{"track price".toUpperCase()}</span>
                    </div>
                    <div className={s.all_options}>
                        <div className={s.ind}>
                            <div className={s.transfers_inscription}>
                                transfers
                            </div>
                            <div className={s.transfer_options}>
                                {
                                    getTransferOptions(filteredFlights).map(opt=><div className={s.transfer_opt}>
                                        <span><Checkbox onChange={(e)=>h2(e, opt)}/>{` ${opt} transfer${opt !== 1 ? "s" : ""}`}</span>
                                        <span className={s.transfer_opt_fl_count}>{getFlPrice(getCheapestFl(filteredFlights))}</span>
                                    </div>)
                                }
                            </div>
                            <div><span>Transfer duration</span><span>{`${getLongestTransferInH(filteredFlights)}h`}</span></div>
                            <SliderM h3={h3}/>
                        </div>
                    </div>
                </div>
                <div className={s.main}>
                    {filteredFlights.map(f=>{
                            const price = f.map(ef=>ef.price).reduce((accum, currentV) => accum + currentV)
                            const baggage_price = f.map(ef=>ef.baggage_price).reduce((accum, currentV) => accum + currentV)
                            const airlines = f.map(ef=>ef.airline)
                        let flight_time = []
                        let tranfer_time = []
                        for (let i = 0; i < f.length; i++) {
                            flight_time.push(...f[i].flight_time)
                            tranfer_time.push(...f[i].transfer_time)
                        }
                        return <div className={s.lbl_wrapper}>
                            {f === cheapestFl && <div className={s.cheapest_lbl}>The cheapest</div>}
                            {f === fastestFl && cheapestFl !== fastestFl && <div className={s.fastest_lbl}>The fastest</div>}
                            <div className={s.easyFlightItem}>

                                <div className={s.eFlItFirstPart}>
                                    <span className={s.price}>{price}</span>
                                    <span>Baggage +{baggage_price ? baggage_price : "included"}</span>
                                    <button className={s.ticketBtn}>Choose ticket</button>
                                </div>
                                <div className={s.trace}>

                                </div>
                                <div className={s.eFlItSecondPart}>
                                    <div className={s.efAirlineAndBtns}>
                                        <div className={s.airlineRow}>{airlines.map(a=><span className={s.airline}>{<img className={s.aLbl} src={getAirlineLbl(a)}/>}</span>)}</div>
                                        <span>btns</span>
                                    </div>
                                    <div className={s.illustration}>
                                        <div className={s.efDepartInfo}>
                                            <span className={s.time}>{f[0].departure_date.slice(-5)}</span>
                                            <span className={s.dop_date_info}>{f[0].location_chain[0]}</span>
                                            <span className={s.dop_date_info}>{f[0].departure_date.slice(0, 2)}</span>
                                        </div>
                                        <div>
                                            <div className={s.lineWrapper}>
                                                <div className={s.location_inscription}>
                                                    <div className={s.first_insc}>{getShortName(f[0].location_chain[0])}</div>
                                                    <div className={s.last_insc}>{getShortName(f[f.length-1].location_chain[f[f.length-1].location_chain.length-1])}</div>
                                                </div>
                                        <PathLineIllustration flight_time={flight_time} transfer_time={tranfer_time}/>
                                            </div>
                                        </div>
                                            <div className={s.efArriveInfo}>
                                            <span className={s.time}>{f[f.length-1].arrival_date.slice(-5)}</span>
                                            <span className={s.dop_date_info}>{f[f.length-1].location_chain[f[0].location_chain.length - 1]}</span>
                                            <span className={s.dop_date_info}>{f[f.length-1].arrival_date.slice(0, 2)}</span>
                                        </div>
                                    </div>
                                </div>
                        </div></div>

                    })}
                </div>
            </div>
        </div>
    );
};
const fn = (from:any, to:any, flights:Array<any>) => {
    let fArr:Array<any> = []
    const arr = flights.filter((f:any)=>f[0] === from)
    arr.map((fl1:any)=>{
        const arr2 = flights.filter((f:any)=>f[0] ===fl1[1])
        arr2.map((fl2:any)=>{
            const arr3 = flights.filter((f:any)=>f[0] === fl2[1])
            arr3.map((fl3:any)=>{
                const arr4 = flights.filter((f:any)=>f[0] === fl3[1])
                arr4.map((fl4:any)=>{
                    fArr.push([fl1, fl2, fl3, fl4])
                })
            })
        })
    })
    return fArr
}
const fn2 = (from:any, to:any, flights:Array<any>) => {

}

type FlightType = {
    "id":1,
    location_chain:Array<string>,
    airport_chain:Array<string>,
    price:number,
    baggage_price:number,
    airline:string,
    flight_time:Array<number>,
    transfer_time:Array<number>,
    departure_date:string,
    arrival_date:string,
    createdAt:string,
    updatedAt:string
}

const getComposedFlights = (from:any, to:any, flights:Array<FlightType>) => {
    let fArr:Array<FlightType[]> = flights.filter((f)=>{
        return f.location_chain[0] === from
    }).map(f=>[f])
    /*let fArr:Array<FlightType> = arr*/

    const allComposedFlights = []
    for (let i = 2; i < 5; i++) {
        fArr = fn4(fArr, flights, i)
        allComposedFlights.push(...fArr)
    }
    const suitableFlights:Array<FlightType[]> = allComposedFlights.filter((cf)=>cf[cf.length-1].location_chain[cf[cf.length-1].location_chain.length-1] === to)
    return suitableFlights


}


const fn4:any = (fArr:Array<FlightType[]>, flights: Array<FlightType>, flightCount:number) => {
    for (let i = 0; i < flightCount-1; i++) {

        const newCf = fArr.map((cf) => {
            const Arr:Array<FlightType> = flights.filter((f) =>{
                    return f.location_chain[0] === cf[cf.length-1].location_chain[cf[cf.length-1].location_chain.length - 1]
            })/*.map(f=>Array.isArray(f) ? f : [f])*/
            if (Arr.length === 0) return null
            const NewCfs = Arr.map((f) => [...cf, f])
            return NewCfs
        })

        fArr = []

        for (let i = 0; i < newCf.length; i++) {
            if (newCf[i]){
                // @ts-ignore
                fArr.push(...newCf[i])
            }
        }

        return fArr

    }
}

const getFlights = (from:string, to:string, flights: Array<FlightType>) => {
  const filteredFlights = flights.filter(f=>f.location_chain[0] === from && f.location_chain[f.location_chain.length-1] === to)
    return filteredFlights.map(f=>[f])
}
const getAllFilteredFlights = (from:string, to:string, flights:Array<FlightType>): Array<FlightType[]> => {
  const composedFlights = getComposedFlights(from, to, flights)
    const easyFlights = getFlights(from, to, flights)
    return [...easyFlights, ...composedFlights]
}
const filterFlightsByDate = (date:any, flights:Array<FlightType>[]) => {
    const filteredFlights = flights.filter(cf=>cf[0].departure_date.slice(0, 10) === date)
    return filteredFlights
}
const proveEqOfFltBgePrCond = (flights: Array<FlightType[]>) => {
    const filteredFlights = flights.filter(f=>{
        let areEqual = true
        const compFlBgePrs = f.map(f=>f.baggage_price)
        return !(compFlBgePrs.includes(0) && compFlBgePrs.some((num) => num !== 0))
    })
    return filteredFlights
}
const getAirlineLbl = (name: string) => {
    if (name === "Ryanair") return ryanair_lbl
    if (name === "EasyJet") return easyjet_lbl
    if (name === "Vueling") return vueling_lbl
}
type PathLineIllustrationPropsType = {
    flight_time: Array<number>,
    transfer_time: Array<number>
}
const PathLineIllustration = ({flight_time, transfer_time}: PathLineIllustrationPropsType) => {
    const times = []
    for (let i = 0; i < flight_time.length; i++) {
        times.push(flight_time[i])
        transfer_time[i] && times.push(transfer_time[i])
    }
    const timeSum = times.reduce((accum, currV)=>accum + currV)
    const [showTime, setShowTime] = useState(-10)
    const h2 = (n:number) => {
        setShowTime(n)
    }
    return <div className={s.flightIllLine}>
        <FlightTakeoffIcon className={`${s.iconClName} ${s.flight_icon1}`}/>
        <div className={s.commonTimeFlightInfo}>{getTime(timeSum)}</div>
        {
            times.map((t, index) => {
                const segmentSize = t / timeSum * 300
                const isEven = index % 2 === 0
                const isFirst = index === 0
                const isLast = index === times.length-1

                return <div onMouseEnter={()=>h2(index)} onMouseLeave={()=>h2(-10)} className={s.a}><div className={`${isEven ? s.flight_seg : s.tranfer_seg}`}
                            style={{"width": `${segmentSize}px`}}>
                </div>
                    {/*<div className={`${isFirst && s.firstItClName} ${isLast && s.lastItClName}`}>*/}
                        {/*{isFirst && <FlightTakeoffIcon fontSize={"small"} className={s.iconClName}/>}
                        {isLast && <FlightLandIcon fontSize={"small"} className={s.iconClName}/>}*/}
                        {showTime === index && <div className={s.showTime}>{t}</div>}
                    {/*</div>*/}
                </div>
            })
        }
        <FlightLandIcon className={`${s.iconClName} ${s.flight_icon2}`}/>
    </div>
}
const getTime = (time:number) => {
    /*const days = Math.floor(time / 60)
    const */
        const days = Math.floor(time / 1440)
        const hours = Math.floor((time - 1140 * days) / 60)
        const minutes = time - days * 1140 - hours * 60
        return `${time >=1440 ? days + "d" : ""} ${hours}h ${minutes}m`
}
const getShortName = (name:string) => {
  switch (name){
      case "Lisbon": return "LIS"
      case "Berlin": return "BER"
      case "Zaragoza": return "ZAZ"
      case "Palma de Mallorca": return "PMI"
      case "London": return "LON"
      case "Tokyo": return "TYO"
      case "Narita": return "NRT"
      case "Barcelona": return "BCN"
      case "El Prat": return "BCN"
      case "Haneda": return "HND"
  }
}
const getCheapestFl = (flights: Array<FlightType[]>) => {
    const flightPrices = flights.map(cf=>{
        return cf.map(f=>f.price).reduce((acc, currV)=>acc + currV)
    })
    const cheapestPrice = flightPrices.reduce((max, currV)=>currV > max ? currV : max)
    return  flights[flightPrices.indexOf(cheapestPrice)]
}
const getFastestFl = (flights: Array<FlightType[]>) => {
    const flightDurations = flights.map(cf=>{
        return cf.map(f=>f.flight_time.reduce((acc, currV)=>acc + currV) + f.transfer_time.reduce((acc, currV)=>acc + currV))
    })
    const lowestTime = flightDurations.reduce((max, currV)=>currV > max ? currV : max)
    return flights[flightDurations.indexOf(lowestTime)]
}
const getTransferOptions = (flights: Array<FlightType[]>) => {
    let transferAmountOptions: Array<number> = []
    for (let i = 0; i < flights.length; i++) {
        let cFlAirportChain: Array<string> = []
        const cFlLength = flights[i].length
        for (let j = 0; j < cFlLength; j++) {
            cFlAirportChain.push(...flights[i][j].airport_chain)
        }
        cFlAirportChain = cFlAirportChain.filter((a, index)=>cFlAirportChain.indexOf(a) === index)
        transferAmountOptions.push(cFlAirportChain.length - 2)
    }
    return  transferAmountOptions.filter(((n, index)=>transferAmountOptions.indexOf(n) === index))
        .sort((a, b)=>a - b)
}
const getLongestTransferInH = (flights: Array<FlightType[]>) => {
    const flightsLength = flights.length
    let longestTransfer: number = 0
    for (let i = 0; i < flightsLength; i++) {
        let cfLength = flights[i].length
        let allCfTransferTimes: Array<number> = []
        for (let j = 0; j < cfLength; j++) {
            allCfTransferTimes.push(...flights[i][j].transfer_time)
        }
        longestTransfer = allCfTransferTimes.reduce((max, currV)=>currV > max ? currV : max)
    }
    return Math.floor(longestTransfer / 60)
}
const filterByTransferCount = (flights: Array<FlightType[]>, count:number) => {
  return flights.filter(cf=>cf.map(ef=>ef.transfer_time.length).reduce((max, currV)=>max + currV) === count)
}

const getFlPrice = (fl:FlightType[]) => {
  return fl.map(ef=>ef.price).reduce((max, currV)=>max + currV)
}
const filterFlByTransferDurationRng = (flights: Array<FlightType[]>) => {
    //flights.filter(cf=>cf.map(ef=>ef.transfer_time))
}
const getTransferTimeBetweenEasyFls = (flight: FlightType[]) => {
  flight.map(ef=>[ef.arrival_date, ef.departure_date]).reduce((prevV, currV)=>{
      return currV
  })
}
const solveDate = (fDate: string, sDate: string) => {
  
}

const findNextFlights = (flights:Array<any>, flight:any) => {
    const nextFs = flights.filter((f:any)=>f[0] ===flight[1])
    return nextFs
}
const filterFsByFrom = (flights:Array<any>, from:string) => {
    const filteredFs = flights.filter((f:any)=>f[0] === from)
    return filteredFs
}

export default Flights;