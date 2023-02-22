import React from 'react';
import {TextField} from "@mui/material";
import dayjs, { Dayjs } from 'dayjs';
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";



const DatePicker = ({value, handleChange}:any) => {

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                    renderInput={(props) => (
                        <TextField {...props} />
                    )}
                    label="Date desktop"
                    inputFormat="DD/MM/YYYY"
                    value={value}
                    onChange={handleChange}
                    /*renderInput={(params) => <TextField {...params} />}*/
                />
        </LocalizationProvider>
    );
};

export default DatePicker;