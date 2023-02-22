import React from 'react';
import {Field, Form, Formik} from "formik";
import s from './CreateFlights.module.css'
import axios from "axios";

const CreateFlights = () => {
    return (
        <div>
            <Formik initialValues={{
                location_chain: '',
                airport_chain: '',
                price: '',
                baggage_price: '',
                airline: '',
                flight_time: '',
                transfer_time: '',
                departure_date: '',
                arrival_date: ''
            }} onSubmit={(values)=>{
                const formData = new FormData()
                const keys = Object.keys(values)
                keys.map((k:any)=>{
                    // @ts-ignore
                    formData.append(k, values[k])
                })
                // @ts-ignore
                axios.post('http://localhost:5000/api/flight/add', formData)
            }}>
                <Form className={s.form}>
                    <Field name={"location_chain"} placeholder={"location_chain"}/>
                    <Field name={"airport_chain"} placeholder={"airport_chain"}/>
                    <Field name={"price"} type={"number"} placeholder={"price"}/>
                    <Field name={"baggage_price"} type={"number"} placeholder={"baggage_price"}/>
                    <Field name={"airline"} placeholder={"airline"}/>
                    <Field name={"flight_time"} placeholder={"flight_time"}/>
                    <Field name={"transfer_time"} placeholder={"transfer_time"}/>
                    <Field name={"departure_date"} placeholder={"departure_date"}/>
                    <Field name={"arrival_date"} placeholder={"arrival_date"}/>
                    <button type={"submit"}>Add</button>
                </Form>
            </Formik>
        </div>
    );
};

export default CreateFlights;