/*
import React from 'react';
import { Slider } from 'react-jqueryui';
import $ from 'jquery';

class SliderComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 12
        };
    }

    render() {
        return (
            <Slider
                value={this.state.value}
                min={0}
                max={43}
                step={1}
                range={false}
                animate={true}
                create={() => {
                    const slider = $('.ui-slider');

                    // добавляем метки на ползунок
                    slider.find('.ui-slider-handle').eq(0).html('<span>4</span>');
                    slider.find('.ui-slider-handle').eq(1).html('<span>8</span>');
                    slider.find('.ui-slider-handle').eq(2).html('<span>12</span>');
                }}
                slide={(event, ui) => {
                    this.setState({ value: ui.value });

                    // проверяем, на каком месте находится ползунок
                    if (ui.value === 4) {
                        console.log('Значение ползунка равно 4');
                    } else if (ui.value === 8) {
                        console.log('Значение ползунка равно 8');
                    } else if (ui.value === 12) {
                        console.log('Значение ползунка равно 12');
                    }
                }}
            />
        );
    }
}

export default SliderComponent;*/
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';


const marks = [
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
];

function valuetext(value: number) {
    return `${value}`;
}

type PropsType = {
    //maxV: number
    h3:(e:any, nv:any)=>void
    marks: Array<any>
}

const SliderM = ({h3, marks}:PropsType) => {
    return (
        <Slider
            onChangeCommitted={h3}
            sx={{width:220}}
            track="inverted"
            aria-labelledby=""
            getAriaValueText={valuetext}
            defaultValue={[0, 100]}
            marks={marks}
        />
    );
}

export default SliderM