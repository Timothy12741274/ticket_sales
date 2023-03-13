import React, {useState} from 'react';
import {Field, Form, Formik} from "formik";
import axios from "axios";

const UpdateFlights = () => {

    return (
        <div>
            <Formik initialValues={{field: "", value: "", id: ""}} onSubmit={(values, formikHelpers)=>{
                const body:any= {}
                body[values.field] = values.value
                axios.put('http://localhost:5000/api/flights/' + values.id, body)

            }}>
                <Form>
                    <Field name={"field"} placeholder={"Field name"}/>
                    <Field name={"value"} placeholder={"Field value"}/>
                    <Field name={"id"} placeholder={"Flight id"}/>
                    <button type={"submit"}>Update field</button>
                </Form>
            </Formik>
        </div>
    );
};


export default UpdateFlights;