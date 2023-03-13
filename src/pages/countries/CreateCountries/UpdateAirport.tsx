import React, {useState} from 'react';
import {Field, Form, Formik} from "formik";
import axios from "axios";

const UpdateAirport = () => {

    return (
        <div>
            <Formik initialValues={{field: "", value: "", id: ""}} onSubmit={(values, formikHelpers)=>{
                const body:any= {}
                body[values.field] = values.value
                axios.put('http://localhost:5000/api/airports/' + values.id, body)

            }}>
                <Form>
                    <Field name={"field"} placeholder={"Field name"}/>
                    <Field name={"value"} placeholder={"Field value"}/>
                    <Field name={"id"} placeholder={"Airport id"}/>
                    <button type={"submit"}>Update field</button>
                </Form>
            </Formik>
        </div>
    );
};

export default UpdateAirport;