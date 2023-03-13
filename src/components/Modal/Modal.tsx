import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {
    FlightType,
    flTimeObjType,
    getAirlineLbl,
    getFlPathInfo,
    trTimeObjType,
} from "../../pages/flights/Flights/Flights";
import {airportType} from "../../types/airport";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import s from './Modal.module.css'
import LuggageIcon from '@mui/icons-material/Luggage';
import NoLuggageIcon from '@mui/icons-material/NoLuggage';
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '56%',
    transform: 'translate(-50%, -50%)',
    width: 1100,
    bgcolor: '#eff1f4',
    borderRadius: '12px',
    boxShadow: 24,
    p: 4,
};
type PropsType = {
    open: boolean
    closeMdlClb: ()=>void
    flight: FlightType[]
    airports: airportType[]
}
export default function BasicModal({open, closeMdlClb, flight, airports}: PropsType) {
    //const [open, setOpen] = React.useState(false);
    //const handleOpen = () => setOpen(true);
    //const handleClose = () => setOpen(false);

    const descriptionElementRef = React.useRef<HTMLElement>(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);
    const flightInfo: ReturnType<typeof getFlPathInfo> = getFlPathInfo(flight, airports)
    const flightCopy: FlightType[] = Array.from(flight, obj => Object.assign({}, obj));
    const from = airports.find(a=>a.name === flight[0].airport_chain[0])!.city
    const arpChainL = flight[flight.length-1].airport_chain.length
    const flightL = flight.length
    const to = airports.find(a=>a.name === flight[flightL-1].airport_chain[arpChainL-1])!.city
    const {airline: airlinesStr} = flightCopy.shift()!
    let airlines = airlinesStr.split(',').map(a=>a.trim())
    const baggagePrice = checkBaggageIncluded(flight)
    return (
        <div>
            {/*<Button onClick={handleOpen}>Open modal</Button>*/}
            <Modal
                open={open}
                onClose={closeMdlClb}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <span onClick={closeMdlClb} className={s.close_item}><CloseIcon fontSize={"medium"} color={"primary"}/></span>
                    <div className={s.bge_info_wrp}>
                    {

                        baggagePrice === true ?
                        <div>
                        <LuggageIcon/>
                        <span>Baggage included</span>
                    </div>
                            :
                            <div className={s.baggage_info}>
                                <NoLuggageIcon />
                                <span>Baggage isn't included</span>
                            </div>

                    }
                        </div>
                    <div className={s.from_to_drn_block}>
                        <span className={s.from_to}>{`${from} - ${to}`}</span>
                        <span className={s.drn}>{sumDrn(flightInfo)}</span>
                    </div>
                    <div className={s.path_info_block}>
                        <div className={s.wrap_infos}>
                        {
                            flightInfo.map((i:any, index) =>{
                                const duration = i.duration
                                if (index % 2 === 0){
                                    const airline = airlines.shift()!
                                    const {abbreviation: arlArpAbbreviation, city: arlCity, name: arlArpName} = airports.find(a=>a.id === i.arlAirportId)!
                                    const {abbreviation: dptArpAbbreviation, city: dptCity, name: dptArpName} = airports.find(a=>a.id === i.dptAirportId)!
                                    const arlWeekDay = getWeekDaySrtName(i.arlDate)
                                    const dptWeekDay = getWeekDaySrtName(i.dptDate)
                                    const dptDay = i.dptDate.slice(0,2)
                                    const arlDay = i.arlDate.slice(0,2)
                                    const arlTime = i.arlDate.slice(11, 16)
                                    const dptTime = i.dptDate.slice(11, 16)
                                    return <div>
                                        {/* <div>
                                                    <span>
                                                    <img src={getAirlineLbl(airline)}/>
                                                    <span>
                                                        <span>{airline}</span>
                                                        <span>{duration}</span>
                                                    </span>
                                                    </span>
                                                    <button>Show more</button>
                                                </div>
                                                <div>
                                                    <div>

                                                    </div>
                                                </div>*/}
                                        <div className={s.fl_info}>
                                            <div className={s.col_1}>
                                                <img src={getAirlineLbl(airline)} className={s.img}/>
                                                <div className={s.path_ill}>
                                                    <div className={s.circle_1}></div>
                                                    <div className={s.line}></div>
                                                    <div className={s.circle_2}></div>
                                                </div>
                                            </div>
                                            <div className={s.col_2}>
                                                <div className={s.block_1}>
                                                    <div className={s.airline_and_drn}>
                                                        <span>{airline}</span>
                                                        <span className={s.colored}>{duration}</span>
                                                    </div>
                                                    <button>Show more</button>
                                                </div>
                                                <div className={s.block_2}>
                                                    <div className={s.row}>
                                                        <div className={s.item}>
                                                            <span className={s.time}>{dptTime}</span>
                                                            <span className={s.row_2}>{`${dptDay} ${getMonthSrtName(i.dptDate)}, ${dptWeekDay}`}</span>
                                                        </div>
                                                        <div className={s.item}>
                                                            <span className={s.city}>{dptCity}</span>
                                                            <span className={s.row_2}>{`${dptArpName}, ${dptArpAbbreviation}`}</span>
                                                        </div>
                                                    </div>
                                                    <div className={s.row}>
                                                        <div className={s.item}>
                                                            <span className={s.time}>{arlTime}</span>
                                                            <span className={s.row_2}>{`${arlDay} ${getMonthSrtName(i.arlDate)}, ${arlWeekDay}`}</span>
                                                        </div>
                                                        <div className={s.item}>
                                                            <span className={s.city}>{arlCity}</span>
                                                            <span className={s.row_2}>{`${arlArpName}, ${arlArpAbbreviation}`}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                } else {
                                    const {city} = airports.find(a=>a.id === i.airportId)!
                                    return <div className={s.tr}>
                                        <DirectionsWalkIcon/>
                                        <div className={s.item}>
                                            <span className={s.tr_in}>Transfer in {` ${city}`}</span>
                                            <span className={s.tr_drn}>{duration}</span>
                                        </div>
                                    </div>
                                }
                            })
                        }
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
const getWeekDaySrtName = (dateStr: string) => {

    const [day, month, year] = dateStr.slice(0, 10).split('-').map(el=>Number(el))
    const date = new Date(year, month-1, day)
    return date.toLocaleDateString('en-US', {weekday: "short"})
}
const getMonthSrtName = (dateStr: string) => {
    const [day, month, year] = dateStr.slice(0, 10).split('-').map(el=>Number(el))
    const date = new Date(year, month-1, day)
    return date.toLocaleDateString('en-US', {month: "short"})
}
const sumDrn = (infos: Array<flTimeObjType | trTimeObjType>) => {
    let drn = 0
    for (let i = 0; i < infos.length; i++) {
        const [hours, , minutes] = infos[i].duration.split(' ')
        drn += Number(hours) * 60 + Number(minutes)
    }

    const hours = Math.floor(drn / 60);
    const remainingMinutes = drn % 60;

    return `${hours} h ${remainingMinutes} m`
}
const checkBaggageIncluded = (flight: FlightType[]) => {
    const price = flight.map(ef=>ef.baggage_price).reduce((max, currV)=>currV + max)
  return price === 0 ? true : price
}
