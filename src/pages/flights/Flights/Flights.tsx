import React, {ChangeEvent, useEffect, useState} from 'react';
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
import {airportType} from "../../../types/airport";
import {airportSlice} from "../../../store/reducer/airport-reducer";
import BadgeIcon from '@mui/icons-material/Badge';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import BasicModal from "../../../components/Modal/Modal";

type gblFilterType = {
    arlTimeRge: Array<number>
    dptTimeRge: Array<number>
    trCnt: Array<number>
    woTrs: boolean
    woNgtTrs: boolean
    woArpCge: boolean
    arlDate: Array<string>
    trDrnTimeRge: Array<number>
}
const Flights = () => {
    const dispatch = useAppDispatch()
    useEffect(()=>{
        const setFlights = async () => {
            axios.get('http://localhost:5000/api/flights').then((res)=>{
                dispatch(flightReducer.actions.setFlights({flights: res.data}))
            })
        }
        const setAirports = () => {
            axios.get('http://localhost:5000/api/airports').then((res)=>{
                dispatch(airportSlice.actions.setAirports({airports: res.data}))
            })
        }
        const setAll = () => {
            setFlights()
            setAirports()
        }
        setAll()
    }, [])
    const flights = useAppSelector(state => state.flightReducer.flights)
    const airports = useAppSelector(state => state.airportReducer.airports)
    // @ts-ignore
    //console.log(flights)
        //flights.length !== 0 && console.log(getComposedFlights('Lisbon', 'Berlin', flights))

    //console.log(getComposedFlights('A', 'W', ['AB', 'BC', 'BD', 'CS', 'CX', 'DR', 'DE', 'RY', 'RP', 'EM', 'EW']))
    const [value, setValue] = React.useState<Dayjs | null>(
        dayjs('27.04.2023', 'DD.MM.YYYY'),
    );

    const options = ["Tokyo", "Lisbon", "Berlin", "Palma de Mallorca", "Barcelona"]

    const handleChange = (newValue: Dayjs | null) => {
        setValue(newValue);
    };

    const [fromValue, setFromValue] = useState('Lisbon');
    const [toValue, setToValue] = useState('Berlin');
    const [filteredFlights, setFilteredFlights] = useState<Array<FlightType[]>>([])
    const [openedMdl, setOpenedMdl] = useState(-1)
    const closeMdlClb = () => {
        setOpenedMdl(-1)
    }
    //console.log(openedMdl)
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
    let [dptTimeFilterVl, setDptTimeFilterVl] = useState("00-00")
    let [arlTimeFilterVl, setArlTimeFilterVl] = useState("00-00")
    let [isDptFlOpened, setIsDptFlOpened] = useState(false)
    let [gblFilter, setGblFilter] = useState<gblFilterType>({
        arlTimeRge: [0, 100],
        dptTimeRge: [0, 100],
        trCnt: [],
        woTrs: false,
        woNgtTrs: false,
        woArpCge: false,
        arlDate: [],
        trDrnTimeRge: [0, 100]
    })

    const dptClkHnd = () => {
      setIsDptFlOpened(s=>!s)
    }
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

        setFilteredFlights( filterFls(bgePrEqCondProvedFls, gblFilter, airports))
    }
    const h2 = (e: ChangeEvent<HTMLInputElement>, opt: number) => {
        const checked = e.target.checked
        setGblFilter(s => ({...s, trCnt: !checked ? [...s.trCnt, opt] : s.trCnt.filter(el => el !== opt)}))
    }
        
    const StyledPaper = styled(Paper)(({ theme }: { theme: any }) => ({
        backgroundColor: theme.palette.common.white,
    }));
    const h3 = (e:ChangeEvent<HTMLInputElement>, nv:Array<number>) => {
        //setFilteredFlights(filterFlByMaxTransferDurationTime(filteredFlights, nv))
        setGblFilter(s=>({...s, trDrnTimeRge: nv.map(el=>Math.floor(el*0.43))}))
    }
    const dptTimeSldHnd = (e:any, nv:any) => {
        setFiltersAndFilterFlsByDptAndArlTimes(e, nv, "dptSld")
    }
    const arlTimeSldHnd = (e:any, nv:any) => {
        setFiltersAndFilterFlsByDptAndArlTimes(e, nv, "arlSld")
    }
    const setFiltersAndFilterFlsByDptAndArlTimes = (e:any, nv:any, sld: "dptSld" | "arlSld") => {
        const [min, max] = nv.map((v:number)=>Math.floor(v / 4.16))
        const minStr = min.toString()
        const maxStr = max.toString()
        const minToSet = minStr.length < 2 ? "0" + minStr : minStr
        const maxToSet = maxStr.length < 2 ? "0" + maxStr : maxStr
      if (sld === "dptSld"){
          setDptTimeFilterVl(`${minToSet}-${maxToSet}`)
          //setFilteredFlights(filterByDptTime(filteredFlights, min, max))
          setGblFilter(s=>({...s, dptTimeRge: [min, max].map(el=>Number(el))}))
      } else {
          setArlTimeFilterVl(`${minToSet}-${maxToSet}`)
          //setFilteredFlights(filterByArlTime(filteredFlights, min, max))
          setGblFilter(s=>({...s, arlTimeRge: [min, max].map(el=>Number(el))}))
      }
    }
    const transferVisaRequiredAirportsNames = getTransferVisaRequiredAirports(airports).map(f=>f.name)

    const longTransferFls = filteredFlights.filter(fl => !filterFlByMaxTransferDurationTime(filteredFlights, 240).includes(fl));
    const ckbWoTrsHnd = (e: ChangeEvent<HTMLInputElement>) => {
        setGblFilterVle(e, "woTrs")
    }
    const ckbWoNgtTrsHnd = (e: ChangeEvent<HTMLInputElement>) => {
        setGblFilterVle(e, "woNgtTrs")
    }
    const ckbWoArpCgeHnd = (e: ChangeEvent<HTMLInputElement>) => {
        setGblFilterVle(e, "woArpCge")
    }
    type optType = "woTrs" | "woNgtTrs" | "woArpCge"
    const setGblFilterVle = (e: ChangeEvent<HTMLInputElement>, opt: optType) => {
        const checked = e.target.checked
        switch (opt) {
            case "woTrs": {
                setGblFilter(s=>({...s, woTrs: checked}))
                break;
            }
            case "woNgtTrs": {
                setGblFilter(s=>({...s, woNgtTrs: checked}))
                break;
            }
            case "woArpCge": {
                setGblFilter(s=>({...s, woArpCge: checked}))
                break;
            }
        }
    }
    /*useEffect(()=>{
        filteredFlights.length !== 0 && h1()
    }, [gblFilter])*/
    //console.log(filteredFlights[0])
    //filteredFlights.length !== 0 && console.log(getFlPathInfo(filteredFlights[0], airports))
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
                            let iant="outlined"
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
                            let iant="outlined"
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
                            <SliderM marks={[
                                {
                                    value: 16.6,
                                    label: '4',
                                },
                                {
                                    value: 33.3,
                                    label: '8',
                                },
                                {
                                    value: 50,
                                    label: '12',
                                },
                            ]} h3={h3}/>
                            <div>If comfort is more important</div>
                            <div>
                                <div className={s.comfort_opt_row}><span>Without transfers</span><Checkbox value={gblFilter.woTrs} onChange={ckbWoTrsHnd} className={s.comfort_opt_checkbox}/></div>
                                <div className={s.comfort_opt_row}><span>Without airport change</span><Checkbox value={gblFilter.woArpCge} onChange={ckbWoArpCgeHnd} className={s.comfort_opt_checkbox}/></div>
                                <div className={s.comfort_opt_row}><span>Without night transfers</span><Checkbox value={gblFilter.woNgtTrs} onChange={ckbWoNgtTrsHnd} className={s.comfort_opt_checkbox}/></div>
                            </div>
                        </div>
                        <div className={s.dpt_time_ops_ins} onClick={dptClkHnd}>
                            Department from {`${fromValue}`}
                        </div>
                        {
                            isDptFlOpened &&
                        <div>
                            <div className={s.act_and_time_range_row}><span>Department</span><span>{dptTimeFilterVl}</span></div>
                            <SliderM marks={[]} h3={dptTimeSldHnd} />
                            <div className={s.act_and_time_range_row}><span>Arrival</span><span>{arlTimeFilterVl}</span></div>
                            <SliderM marks={[]} h3={arlTimeSldHnd} />
                        </div>
                        }
                        <div>Arrival date</div>
                        <div>
                            {
                                getUnqDateCheapestFls(filteredFlights).map(cf=>{
                                    const dateStr: string = cf[cf.length-1].arrival_date.slice(0, 10)
                                    const [day, month, year] = dateStr.split('-').map(el=>Number(el))

                                    const date = new Date(year, month-1, day)
                                    let monthName = date.toLocaleString('default', { month: 'long' });
                                    let dayOfWeek = date.toLocaleString('default', { weekday: 'short' });
                                    const ckbHnd = (e:ChangeEvent<HTMLInputElement>) => {
                                        const checked = e.target.checked
                                        setGblFilter(s=>({...s, arlDate: checked ?
                                                [...s.arlDate, dateStr] :
                                                s.arlDate.filter(d=>d !== dateStr)
                                        }))
                                    }
                                    return <div className={s.arl_date_fl_opt_row}>
                                        <span><span>{`${<Checkbox onChange={ckbHnd}/>}   ${date.getDate()} ${monthName}`}</span><span>{`, ${dayOfWeek}`}</span></span>
                                        <span>{`${getFlPrice(cf)} ₽`}</span>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className={s.main}>
                    {filteredFlights.map((f, index)=>{
                            const price = f.map(ef=>ef.price).reduce((accum, currentV) => accum + currentV)
                            const baggage_price = f.map(ef=>ef.baggage_price).reduce((accum, currentV) => accum + currentV)
                            //const airlines = f.map(ef=>ef.airline)
                        let airlines: Array<string> = []
                        for (let i = 0; i < f.length; i++) {
                            airlines.push(...f[i].airline.split(',').map(a=>a.trim()))
                        }
                        let flight_time = []
                        let tranfer_time = []
                        for (let i = 0; i < f.length; i++) {
                            flight_time.push(...f[i].flight_time)
                            tranfer_time.push(...f[i].transfer_time)
                        }

                        const visaRequiredAps = proveTransferVisaRequiredAirportsAvailability(f, transferVisaRequiredAirportsNames)
                        //const [open, setOpen] = React.useState(false);
                        /*const clkHnd = () => {
                          setOpen(true)
                        }
                        const setOpenClb = (v: boolean) => {
                          setOpen(v)
                        }*/
                        const open = index === openedMdl
                        const setOpenedMdlHnd = () => {
                            if (openedMdl !== index) setOpenedMdl(index)
                        }




                        return <div className={s.lbl_wrapper}  key={index}>
                            {/*<ScrollDialog open={open} flight={f} closeMdlClb={closeMdlClb} airports={airports}/>*/}
                            <BasicModal open={open} flight={f} closeMdlClb={closeMdlClb} airports={airports}/>
                            {f === cheapestFl && <div className={s.cheapest_lbl}>The cheapest</div>}
                            {f === fastestFl && cheapestFl !== fastestFl && <div className={s.fastest_lbl}>The fastest</div>}
                            <div className={s.easyFlightItem} onClick={setOpenedMdlHnd}>

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
                                        <div className={s.badges_row}>
                                            {visaRequiredAps && <BadgeIcon />}
                                            {longTransferFls.includes(f) && <HourglassTopIcon />}
                                        </div>
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

export type FlightType = {
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
const getUnqDateCheapestFls = (flights: Array<FlightType[]>) => {
    let cheapestFls = []
    let date:Array<string> = []
    for (let i = 0; i < flights.length; i++) {
        const currCfDptDate = flights[i][flights[i].length-1].departure_date.slice(0, 10)
        if(date.includes(currCfDptDate)) date.push(currCfDptDate)
    }
    for (let i = 0; i < date.length; i++) {
        cheapestFls.push(getCheapestFl(filterFlightsByArlDate(date[i], flights)))
    }
    return cheapestFls
}
const filterFlightsByArlDate = (date:any, flights:Array<FlightType>[]) => {
    const filteredFlights = flights.filter(cf=>cf[cf.length-1].arrival_date.slice(0, 10) === date)
    return filteredFlights
}
const filterFlHvtTrn = (flights: Array<FlightType[]>) => {
    return flights.filter(cf=>cf.length < 2 && cf[0].transfer_time.length < 2 && cf[0].transfer_time[0] === 0)
}
const proveEqOfFltBgePrCond = (flights: Array<FlightType[]>) => {
    const filteredFlights = flights.filter(f=>{
        let areEqual = true
        const compFlBgePrs = f.map(f=>f.baggage_price)
        return !(compFlBgePrs.includes(0) && compFlBgePrs.some((num) => num !== 0))
    })
    return filteredFlights
}
export const getAirlineLbl = (name: string) => {
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
const filterFlByMaxTransferDurationTime = (flights: Array<FlightType[]>, max: number) => {
    //
    flights.filter(cf=>{
        console.log(flights.filter(cf=>max > cf.map(ef=>ef.transfer_time
                .reduce((max, currV)=>currV > max ? currV : max)
            )
                .reduce((max, currV)=>currV > max ? currV : max)
        ))

        return max > cf.map(ef=>ef.transfer_time
                .reduce((max, currV)=>currV > max ? currV : max)
            )
                .reduce((max, currV)=>currV > max ? currV : max)
        }
    )
    //
    return flights.filter(cf=>max > cf.map(ef=>ef.transfer_time
        .reduce((max, currV)=>currV > max ? currV : max)
        )
        .reduce((max, currV)=>currV > max ? currV : max)
    )
        .filter(cf=>cf.length === 1 ? true : getTransferTimeBetweenEasyFls(cf)
            .reduce((max, currV)=>currV > max ? currV : max) < max)
    /*.reduce((max, currV)=>currV > max ? currV : max)*/
}
const filterFlByMinTransferDurationTime = (flights: Array<FlightType[]>, min: number) => {
    return flights.filter(cf=>min <= cf.map(ef=>ef.transfer_time
            .reduce((min, currV)=>currV < min ? currV : min)
        )
            .reduce((min, currV)=>currV < min ? currV : min)
    )
        .filter(cf=>cf.length === 1 ? true : getTransferTimeBetweenEasyFls(cf)
            .reduce((min, currV)=>currV < min ? currV : min) <= min)

}
const filterFlsByTrTimeDtn = (flights: Array<FlightType[]>, min:number, max:number): Array<FlightType[]> => {
  let filteredFls = filterFlByMaxTransferDurationTime(flights, max)
    filteredFls = filterFlByMinTransferDurationTime(filteredFls, min)
    const flsWoTrs = filterFlHvtTrn(flights)
    filteredFls.push(...flsWoTrs)
    return filteredFls

}

const getTransferTimeBetweenEasyFls = (flight: FlightType[]) => {
  const efDateArr = flight.map(ef=>[ef.arrival_date, ef.departure_date])

    let interEasyFlTransferTimeArr: Array<number> = []
    const cfL = efDateArr.length
    for (let i = 0; i < cfL; i+=2) {
        const firstFl = efDateArr[i]
        const secondFl = efDateArr[i+1]
        interEasyFlTransferTimeArr.push(solveDate(firstFl[1], secondFl[0]))
    }

    return interEasyFlTransferTimeArr
}
type solveDateArgType = [
    first: string,
    second: string
]

const solveDate = (...args: solveDateArgType) => {
    const convertedToMinutes = args.map(a=>{
        const [day, month, year, hours, minutes] = a.split(/-|\s|:/).map(el=>Number(el));
        const date = new Date(year, month-1, day, hours, minutes)
        return Math.floor(date.getTime() / 60000);
    })
    return convertedToMinutes[1] - convertedToMinutes[0]
}
const getTransferVisaRequiredAirports = (airports: Array<airportType>) => {
  return airports.filter(a=>a.visaInAirportIsRequired)
}
const proveTransferVisaRequiredAirportsAvailability = (flight: FlightType[], transferVisaRequiredAirportsNames: Array<string>) => {
    const flVisaRequiredAps = []
    const flLength = flight.length
    for (let i = 0; i < flLength; i++) {
        flVisaRequiredAps.push(...flight[i].airport_chain.filter(a=>transferVisaRequiredAirportsNames.includes(a)))
    }

    return flVisaRequiredAps.length === 0 ? false : flVisaRequiredAps
}
/*const filterFlsByTransferTime = () => {

}*/
function addMinutesToTime(time:string, minutes:number) {
    let parts = time.split(":");
    let hours = parseInt(parts[0]);
    let mins = parseInt(parts[1]);

    // Добавить минуты и вычислить остаток
    mins += minutes;
    hours += Math.floor(mins / 60);
    mins = mins % 60;

    // Преобразовать обратно в формат "00:00"
    let strHours = hours < 10 ? "0" + hours : hours;
    let strMins = mins < 10 ? "0" + mins : mins;

    return strHours + ":" + strMins;
}
function convertMinutesToHours(minutes:number) {
    let hours = Math.floor(minutes / 60); // Получить количество часов
    let remainderMinutes = minutes % 60; // Получить оставшиеся минуты

    // Форматировать строку с количеством часов и оставшимися минутами
    let result = hours.toString() + " h ";
    if (remainderMinutes > 0) {
        result += remainderMinutes.toString() + " m";
    }

    return result;
}
type transferObjectType = {
    arrivalTime: string
    departureTime: string
    duration: string
}
const getTransferTimes = (flight: FlightType[]) => {
    flight.map(ef => {
        const timeGroups:Array<number[]> = []
        for (let i = 0; i < ef.flight_time.length - 1; i++) {
            timeGroups.push([ef.flight_time[i], ef.transfer_time[i]])
        }

        const transferRangeTimes:Array<transferObjectType> = []
        for (let i = 0; i < timeGroups.length; i++) {
            let minutesToArrival = 0
            let minutesToDeparture = 0

            for (let j = 0; j < i; j++) {
                minutesToArrival += ef.flight_time[j] + j !== 0 ? ef.transfer_time[j-1] : 0
                minutesToDeparture += ef.flight_time[j] +  ef.transfer_time[j]
            }
            transferRangeTimes.push({
                arrivalTime: addMinutesToTime(ef.departure_date, minutesToArrival),
                departureTime: addMinutesToTime(ef.departure_date, minutesToDeparture),
                duration: convertMinutesToHours(minutesToDeparture - minutesToArrival)
        })
        }
        return transferRangeTimes
    })
}
export type flTimeObjType = {
    type: string
    dptDate: string
    arlDate: string
    dptAirportId: number
    arlAirportId: number
    duration: string
}
export type trTimeObjType = {
    type: string
    arlDate: string
    dptDate: string
    airportId: string
    duration: string
}

const getNewDate = (date: string, minutesToAdd: number) => {
    const [day, month, year, hours, minutes] = date.split(/-|\s|:/).map(el=>Number(el))
    const milliseconds = minutesToAdd * 60000
    const cnvDate = new Date(year, month, day, hours, minutes)
    const scdDate:Date = new Date(cnvDate.getTime() + milliseconds)
    return `${scdDate.getDate()}-${scdDate.getMonth() < 10 ? "0" : ""}${scdDate.getMonth()}-${scdDate.getFullYear()} ${scdDate.getHours()}:${scdDate.getMinutes()}`

}
export const getFlPathInfo = (flight: FlightType[], airports: Array<airportType>) => {
    let flRangesInfos = []

    let efsRangesInfos = flight.map(ef=>{

        const L = ef.flight_time.length
        let times: Array<number> = []
        const flTimeObjects:Array<flTimeObjType | trTimeObjType> = []


        for (let i = 0; i < L; i++) {
            times.push(ef.flight_time[i])
            if(ef.transfer_time[i]) times.push(ef.transfer_time[i])
        }


        // @ts-ignore
        let currAirportId = airports.find(a=>a.name === ef.airport_chain[0]).id
        let currDate = ef.departure_date
        const timesL:number = times.length

        for (let i = 0; i < timesL; i++) {

            const flTimeObj: any = {}

            if(i % 2 === 0){
                flTimeObj.type = "fl"
                flTimeObj.dptDate = currDate
                flTimeObj.arlAirportId = currAirportId
                // @ts-ignore
                if (i !== timesL-1) currAirportId = airports.find(a=>a.name === ef.airport_chain[i+1]).id
                currDate = getNewDate(currDate, times[i])
                flTimeObj.arlDate = currDate
                flTimeObj.dptAirportId = currAirportId
                flTimeObj.duration = convertMinutesToHours(solveDate(flTimeObj.dptDate, flTimeObj.arlDate))
            } else {
                flTimeObj.type = "tr"
                flTimeObj.arlDate = currDate
                flTimeObj.airportId = currAirportId
                currDate = getNewDate(currDate, times[i])
                flTimeObj.dptDate = currDate
                flTimeObj.duration = convertMinutesToHours(solveDate(flTimeObj.arlDate, flTimeObj.dptDate))
            }

            flTimeObjects.push(flTimeObj)
        }

        return flTimeObjects
    })

    if(flight.length > 1) {
        const trTimeBtwEasyFl = getTransferTimeBetweenEasyFls(flight)
        let trTimeBtwEasyFlObjs: Array<trTimeObjType> = []
        for (let i = 0; i < flight.length - 1; i++) {
            const ef = flight[i]
            const trObjInfo: trTimeObjType = {
                type: "tr",
                airportId: flight[i].airport_chain[flight[i].airport_chain.length],
                arlDate: flight[i].arrival_date,
                dptDate: flight[i + 1].departure_date,
                duration: convertMinutesToHours(trTimeBtwEasyFl[i])
            }
            trTimeBtwEasyFlObjs.push(trObjInfo)
        }
        for (let i = 0; i < efsRangesInfos.length; i++) {
            flRangesInfos.push(...efsRangesInfos[i], trTimeBtwEasyFlObjs[i])
        }
        return flRangesInfos
    }
    let efsRangesInfosInOneArr: Array<flTimeObjType | trTimeObjType> = []
    for (let i = 0; i < efsRangesInfos.length; i++) {
        efsRangesInfosInOneArr.push(...efsRangesInfos[i])
    }
    return efsRangesInfosInOneArr
    //return flRangesInfos
}

const getDateHours = (date: string) => {
  return Number(date.slice(11, 13))
}

const checkFlNightTr = (flight: FlightType[], airports: Array<airportType>) => {
  const flPathInfo = getFlPathInfo(flight, airports)
    const trsInfos = flPathInfo.filter(i=>i.type === "tr")
    let hours: Array<number> = []
    trsInfos.map(i=>{
        let date = i.arlDate
        while (solveDate(date, i.dptDate) > 0){
            const h = getDateHours(date)
            if(!hours.includes(h)) hours.push(h)
            date = getNewDate(date, 60)
        }
        return hours.find(h=>h > 0 && h < 6) !== undefined
    })
    return hours.find(h=>h > 6) !== undefined
}
const filterFlsHvtNgtTr = (flights: Array<FlightType[]>, airports: Array<airportType>) => {
  return flights.filter(cf=>!checkFlNightTr(cf, airports))
}
const checkVisaRequired = (flight: FlightType[], airports: Array<airportType>) => {
    let required = false

    for (let i = 0; i < flight.length; i++) {
        /*flight[i].airport_chain.map(a=>{
            airports.find(ap=>ap.name === a).
        })*/
        for (let j = 0; j < flight[i].airport_chain.length; j++) {
            // @ts-ignore
            if(airports.find(a=>a.name === flight[i].airport_chain[j]).visaInAirportIsRequired){
                return true
            }
        }
    }
    return false
}
type timesType = [
    min: number,
    max: number
]
const filterByArlTime = (flights: Array<FlightType[]>, ...times: timesType) => {
    if (times[0] === 0 && times[1] === 100) return flights
    return flights.filter(cf=>{
        const dptHours = Number(cf[0].arrival_date.slice(11, 13))
        return dptHours > times[0] && dptHours < times[1]
    })
}
const filterByDptTime = (flights: Array<FlightType[]>, ...times: timesType) => {
    if (times[0] === 0 && times[1] === 100) return flights
    return flights.filter(cf=>{
        const dptHours = Number(cf[cf.length-1].departure_date.slice(11, 13))
        return dptHours > times[0] && dptHours < times[1]
    })
}
const checkAirportChangeFl = (flight: FlightType[]) => {
    let commonAirportChain: Array<string> = []
    for (let i = 0; i < flight.length; i++) {
        for (let j = 0; j < flight[i].airport_chain.length; j++) {
            commonAirportChain.push(flight[i].airport_chain[j])
        }
    }
    for (let i = 0; i < commonAirportChain.length; i++) {
        if(commonAirportChain.filter(a=>a === commonAirportChain[i]).length > 1) return true
    }
    return false
}
const filterFlsWithoutArpCge = (flights: Array<FlightType[]>) => {
    return flights.filter(cf=>!checkAirportChangeFl(cf))
}

const findNextFlights = (flights:Array<any>, flight:any) => {
    const nextFs = flights.filter((f:any)=>f[0] ===flight[1])
    return nextFs
}
const filterFsByFrom = (flights:Array<any>, from:string) => {
    const filteredFs = flights.filter((f:any)=>f[0] === from)
    return filteredFs
}
const filterFlsByTrCnt = (flights: Array<FlightType[]>, cts: Array<number>) => {
    if (cts.length === 0){
        return flights
    }
    let filteredFls: Array<FlightType[]> = []
    for (let i = 0; i < cts.length; i++) {
        filteredFls.push(...filterByTransferCount(flights, cts[i]))
    }
    return filteredFls
}
const filterFls = (flights: Array<FlightType[]>, gblFilter: gblFilterType, airports: Array<airportType>) => {
    let filteredFls = filterFlsByTrCnt(flights, gblFilter.trCnt)
    filteredFls = filterByDptTime(filteredFls, gblFilter.dptTimeRge[0], gblFilter.dptTimeRge[1])
    filteredFls = filterByArlTime(filteredFls, gblFilter.arlTimeRge[0], gblFilter.arlTimeRge[1])
    filteredFls = filterFlsByTrTimeDtn(filteredFls, gblFilter.trDrnTimeRge[0] * getLongestTransferInH(flights), gblFilter.trDrnTimeRge[1] * getLongestTransferInH(flights))
    if (gblFilter.woTrs) filteredFls = filterFlHvtTrn(filteredFls)
    if (gblFilter.woNgtTrs) filteredFls = filterFlsHvtNgtTr(filteredFls, airports)
    if (gblFilter.woArpCge) filteredFls = filterFlsWithoutArpCge(filteredFls)

    return filteredFls

}



export default Flights;