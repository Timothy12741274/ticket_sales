export const a = 1
/*
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import s from './ScrollDialog.module.css'
import {
    FlightType,
    flTimeObjType,
    getAirlineLbl,
    getFlPathInfo,
    trTimeObjType
} from "../../pages/flights/Flights/Flights";
import {airportType} from "../../types/airport";
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';

type PropsType = {
    open: boolean
    closeMdlClb: ()=>void
    flight: FlightType[]
    airports: airportType[]
}

export default function ScrollDialog({open, closeMdlClb, flight, airports}: PropsType) {
    //const [open, setOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

    const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
        /!*setOpen(true);*!/
        setScroll(scrollType);
    };

    const handleClose = () => {
        /!*setOpen(false);*!/
        closeMdlClb()
    };

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
   /!* const fn = (arr: Array<flTimeObjType | trTimeObjType>) => {
        for (let i = 0; i < arr.length; i++) {

            if (i % 2 === 0){

            }

        }
    }*!/
    const flightCopy: FlightType[] = Array.from(flight, obj => Object.assign({}, obj));
    const from = airports.find(a=>a.name === flight[0].airport_chain[0])
    const arpChainL = flight[flight.length-1].airport_chain.length
    const flightL = flight.length
    const to = airports.find(a=>a.name === flight[flightL-1].airport_chain[arpChainL-1])
    const {airline: airlinesStr} = flightCopy.shift()!
    let airlines = airlinesStr.split(',').map(a=>a.trim())
    return (
        <div className={s.cmp_wrp}>
            {/!*<Button onClick={handleClickOpen('paper')}>scroll=paper</Button>*!/}
            <Button className={s.open_btn} onClick={handleClickOpen('body')}>scroll=body</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                {/!*<DialogTitle id="scroll-dialog-title">Subscribe</DialogTitle>*!/}
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    {/!*<Button onClick={handleClose}>Subscribe</Button>*!/}
                </DialogActions>
                <DialogContent dividers={scroll === 'paper'} >
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        {/!*{[...new Array(50)]
                            .map(
                                () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
                            )
                            .join('\n')}*!/}
                        <div>
                            <div>
                                <span>{}</span>
                            </div>
                            <div className={s.path_info_block}>
                                {
                                    flightInfo.map((i:any, index) =>{
                                        const duration = i.duration
                                        if (index % 2 === 0){
                                            const airline = airlines.shift()
                                            const {abbreviation: arlArpAbbreviation, city: arlCity, name: arlArpName} = airports.find(a=>a.id === i.arlAirportId)!
                                            const {abbreviation: dptArpAbbreviation, city: dptCity, name: dptArpName} = airports.find(a=>a.id === i.dptAirportId)!
                                            const arlWeekDay = getWeekDaySrtName(i.arlDate)
                                            const dptWeekDay = getWeekDaySrtName(i.dptDate)
                                            const dptDay = i.dptDate.slice(0,2)
                                            const arlDay = i.arlDate.slice(0,2)
                                            const arlTime = i.arlDate.slice(11, 16)
                                            const dptTime = i.dptDate.slice(11, 16)
                                            return <div>
                                                {/!* <div>
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
                                                </div>*!/}
                                                <div className={s.fl_info}>
                                                    <div className={s.col_1}>
                                                        <img src={getAirlineLbl(airline)}/>
                                                        <div className={s.path_ill}>
                                                            <div className={s.circle_1}></div>
                                                            <div className={s.line}></div>
                                                            <div className={s.circle_2}></div>
                                                        </div>
                                                    </div>
                                                    <div className={s.col_2}>
                                                    <div className={s.block_1}>
                                                        <div>
                                                            <span>{airline}</span>
                                                            <span>{duration}</span>
                                                        </div>
                                                        <button>Show more</button>
                                                    </div>
                                                    <div className={s.block_2}>
                                                        <div className={s.row}>
                                                            <div className={s.item}>
                                                                <span>{dptTime}</span>
                                                                <span>{`${dptDay} ${getMonthSrtName(i.dptDate)}, ${dptWeekDay}`}</span>
                                                            </div>
                                                            <div className={s.item}>
                                                                <span>{dptCity}</span>
                                                                <span>{`${dptArpName}, ${dptArpAbbreviation}`}</span>
                                                            </div>
                                                        </div>
                                                        <div className={s.row}>
                                                            <div className={s.item}>
                                                                <span>{arlTime}</span>
                                                                <span>{`${arlDay} ${getMonthSrtName(i.arlDate)}, ${arlWeekDay}`}</span>
                                                            </div>
                                                            <div className={s.item}>
                                                                <span>{arlCity}</span>
                                                                <span>{`${arlArpName}, ${arlArpAbbreviation}`}</span>
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

                    </DialogContentText>
                </DialogContent>

            </Dialog>
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
}*/
