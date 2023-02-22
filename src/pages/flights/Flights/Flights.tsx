import React, {useState} from 'react';
import DatePicker from "../../../components/DatePicker/DatePicker";
import dayjs, {Dayjs} from "dayjs";
import {Field, Form, Formik} from "formik";
import axios from "axios";
import {Autocomplete, Button, TextField} from "@mui/material";
import s from './Flights.module.css'

const Flights = () => {
    //console.log(fn3('A', 'W', ['AB', 'BC', 'BD', 'CS', 'CX', 'DR', 'DE', 'RY', 'RP', 'EM', 'EW']))
    const [value, setValue] = React.useState<Dayjs | null>(
        dayjs(),
    );

    const options = ["Tokyo", "Lisbon"]

    const handleChange = (newValue: Dayjs | null) => {
        setValue(newValue);
    };

    const [fromValue, setFromValue] = useState('');
    const [toValue, setToValue] = useState('');

    const handleBlur = (event:any) => {
        let i = 0
        while (true){
            if(!event.target.value[i]){
                break;
            }
            const suitableOptions = options.filter((opt:any)=>opt[i].toLowerCase() === event.target.value[i].toLowerCase())
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
        while (true){
            if(!event.target.value[i]){
                break;
            }
            const suitableOptions = options.filter((opt:any)=>opt[i].toLowerCase() === event.target.value[i].toLowerCase())
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
    const h1 = () => {
        axios.post('http://localhost:5000/api/flight', {fromValue, toValue,
            // @ts-ignore
          value: `${value?.get('date')}/${value?.get('month') < 10 ? "0" : ""}${value?.get('month')}/${value?.get('year')}`})
    }
    return (
        <div>
            <div className={s.wrapper}>
                {/*<input value={from} onChange={(e)=>setFrom(e.target.value)} placeholder={"From"}/>
                <input value={to} onChange={(e)=>setTo(e.target.value)} placeholder={"To"}/>*/}
                <Autocomplete
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
                <DatePicker className={s.picker} value={value} handleChange={handleChange}/>
                    </span>
                <Button className={s.btn} size={"large"} onClick={h1}>Find</Button>
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
const fn3 = (from:any, to:any, flights:Array<any>) => {
    let arr = flights.filter((f:any)=>f[0] === from)
  let fArr:Array<any> = arr

    const allComposedFlights = []
    for (let i = 2; i < 5; i++) {
        fArr = fn4(fArr, flights, i)
        allComposedFlights.push(...fArr)
    }
    //const finishArr = fn4(fArr, flights, 3)
    return allComposedFlights


}
const fn4:any = (fArr:Array<any>, flights: Array<any>, flightCount:number) => {
    for (let i = 0; i < flightCount-1; i++) {

        const newCf = fArr.map((cf: any) => {
            const Arr = flights.filter((f: any) => f[0] === cf[cf.length - 1])
            if (Arr.length === 0) return null
            const NewCfs = Arr.map((f: any) => cf + '-' + f)
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
const findNextFlights = (flights:Array<any>, flight:any) => {
    const nextFs = flights.filter((f:any)=>f[0] ===flight[1])
    return nextFs
}
const mapAll = (all:Array<any>) => {
  all.map((el:any)=>{

  })
}
const filterFsByFrom = (flights:Array<any>, from:string) => {
    const filteredFs = flights.filter((f:any)=>f[0] === from)
    return filteredFs
}
/*const fn = (from:any, to:any, flights:Array<any>) => {
    let fArr:Array<any> = []
    const arr = flights.filter((f:any)=>f[0] === from)
    for (let i = 0; i < arr.length; i++) {
        const fl1 = arr[i];
        const arr2 = flights.filter((f:any)=>f[0] === fl1[1])
        for (let j = 0; j < arr2.length; j++) {
            const fl2 = arr2[j];
            const arr3 = flights.filter((f:any)=>f[0] === fl2[1])
            for (let k = 0; k < arr3.length; k++) {
                const fl3 = arr3[k];
                const arr4 = flights.filter((f:any)=>f[0] === fl3[1])
                for (let l = 0; l < arr4.length; l++) {
                    const fl4 = arr4[l];
                    fArr.push([fl1, fl2, fl3, fl4])
                }
            }
        }
    }
    return fArr
}*/

export default Flights;