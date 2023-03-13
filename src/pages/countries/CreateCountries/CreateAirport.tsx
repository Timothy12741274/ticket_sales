import React, {useState} from 'react';
import {Field, Form, Formik, FormikValues} from "formik";
import {Autocomplete, TextField} from "@mui/material";
import axios from "axios";

const validate = (values: FormikValues) => {
    const fieldV1 = values.visaInAirportIsRequired.trim().toLowerCase()
    const errors:any = {}
    if(fieldV1 !== 'true' && fieldV1 !== 'false'){
        errors.visaInAirportIsRequired = 'True or False'
    }
    /*if (Object.keys(errors).length > 0) {
        setError('Пожалуйста, исправьте ошибки в форме');
    } else {
        setError('')
    }*/
    return errors
}

const CreateAirport = () => {
    const options = ["True", "False"]

    return (
        <div>
            <Formik
                initialValues={{name: '', country: '', city: '', abbreviation: '' , visaInAirportIsRequired: '', utc: ''}}
                validate={validate}
                onSubmit={(values, formikHelpers)=>{
                    const formData = new FormData()
                    const nameV = values.name.trim()
                    const upperCaseNameV = (name:string) => {
                      return name.trim().split(' ')
                          .map(el=>el.trim()[0].toUpperCase() + el.trim().slice(1).toLowerCase())
                          .join(' ')
                    }
                    const upperCaseAllLetters = (word: string) => {
                      return word.split('').map(l=>l.toUpperCase()).join('')
                    }
                    formData.append('name', upperCaseNameV(nameV))
                    /*formData.append('airports', values.airports.split(',').map(el => el.trim()).join(', '))*/
                    formData.append('country', upperCaseNameV(values.country))
                    formData.append('city', upperCaseNameV(values.city))
                    formData.append('abbreviation', upperCaseAllLetters(values.abbreviation))
                    formData.append('visaInAirportIsRequired', JSON.parse(values.visaInAirportIsRequired.trim().toLowerCase()))
                    formData.append('utc', values.utc)
                    axios.post('http://localhost:5000/api/airport/add', formData)
                }}>
                <Form>
                    <Field name={"name"} placeholder={"Name"}/>
                    <Field name={"country"} placeholder={"Country"}/>
                    <Field name={"city"} placeholder={"City"}/>
                    <Field name={"visaInAirportIsRequired"} placeholder={"Is visa required in the airport"}/>
                    <Field name={"abbreviation"} placeholder={"Abbreviation"}/>
                    <Field name={"utc"} placeholder={"UTC"}/>
                    <button type={"submit"}>Create</button>
                </Form>
            </Formik>
        </div>
    );

};

export default CreateAirport;