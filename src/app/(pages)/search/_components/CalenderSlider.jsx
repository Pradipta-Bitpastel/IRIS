
"use client";

import React, { useEffect, eseState } from 'react';
import $ from 'jquery'
import 'flatpickr/dist/themes/light.css';
import 'jquery-ui/themes/base/slider.css';
import 'jquery-ui/ui/widgets/slider';

const CalenderSlider = ({ getdateRange }) => {
    useEffect(() => {
        // Initiate Slider
        if (typeof window !== 'undefined') {
            $('#slider-range').slider({
                range: true,
                min: 1377734400000,
                max: 1693267200000,
                step: 86400000,
                values: [1377734400000, 1693267200000]
            });

            // Move the range wrapper into the generated divs
            $('.ui-slider-range').append($('.range-wrapper'));
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            console.log(new Date($('#slider-range').slider("values", 0)).getDate() + '-' + monthNames[new Date($('#slider-range').slider("values", 0)).getMonth()] + '-' + new Date($('#slider-range').slider("values", 0)).getFullYear());
            // Apply initial values to the range container
            $('.range').html('<span class="range-value">' + new Date($('#slider-range').slider("values", 0)).getDate() + '-' + monthNames[new Date($('#slider-range').slider("values", 0)).getMonth()] + '-' + new Date($('#slider-range').slider("values", 0)).getFullYear() + '</span><span class="range-divider"></span><span class="range-value">' + new Date($('#slider-range').slider("values", 1)).getDate() + '-' + monthNames[new Date($('#slider-range').slider("values", 1)).getMonth()] + '-' + new Date($('#slider-range').slider("values", 1)).getFullYear() + '</span>');

            // Show the gears on press of the handles
            $('.ui-slider-handle, .ui-slider-range').on('mousedown', function () {
                $('.gear-large').addClass('active');
                // flatpickr('.ui-slider-handle', {
                //     // Configuration options for the calendar
                //     dateFormat: 'Y-m-d', // Customize the date format as needed
                //     onChange: function (selectedDates, dateStr, instance) {
                //         selectedDate = selectedDates[0];
                //         console.log('Selected Date:', selectedDate);
                //     },
                //     });
            });

            // Hide the gears when the mouse is released
            // Done on document just incase the user hovers off of the handle
            $(document).on('mouseup', function () {
                if ($('.gear-large').hasClass('active')) {
                    $('.gear-large').removeClass('active');
                }
            });

            // Rotate the gears
            var gearOneAngle = 0,
                gearTwoAngle = 0,
                rangeWidth = $('.ui-slider-range').css('width');

            $('.gear-one').css('transform', 'rotate(' + gearOneAngle + 'deg)');
            $('.gear-two').css('transform', 'rotate(' + gearTwoAngle + 'deg)');

            $('#slider-range').slider({
                slide: function (event, ui) {

                    // Update the range container values upon sliding
                    //    console.log(selectedDate);
                    //    if(selectedDate==undefined){
                    $('.range').html('<span class="range-value">' + new Date(ui.values[0]).getDate() + '-' + monthNames[new Date(ui.values[0]).getMonth()] + '-' + new Date(ui.values[0]).getFullYear() + '</span><span class="range-divider"></span><span class="range-value">' + new Date(ui.values[1]).getDate() + '-' + monthNames[new Date(ui.values[1]).getMonth()] + '-' + new Date(ui.values[1]).getFullYear() + '</span>');
                    //    }
                    //    else{
                    //     $('.range').html('<span class="range-value">' + selectedDate.getDate() + '-' + monthNames[selectedDate.getMonth()]  + '-' + selectedDate.getFullYear() + '</span><span class="range-divider"></span><span class="range-value">' + selectedDate.getDate() + '-' + monthNames[selectedDate.getMonth()]  + '-' + selectedDate.getFullYear() + '</span>');
                    //    }

                    // Get old value
                    var previousVal = parseInt($(this).data('value'));

                    // Save new value
                    $(this).data({
                        'value': parseInt(ui.value)
                    });

                    // Figure out which handle is being used
                    console.log(ui.values, "valuess 122")
                    if (ui.values[0] == ui.value) {


                        // Left handle
                        if (previousVal > parseInt(ui.value)) {
                            // value decreased
                            gearOneAngle -= 1;
                            $('.gear-one').css('transform', 'rotate(' + gearOneAngle + 'deg)');
                        } else {
                            // value increased
                            gearOneAngle += 1;
                            $('.gear-one').css('transform', 'rotate(' + gearOneAngle + 'deg)');
                        }

                    } else {

                        // Right handle
                        if (previousVal > parseInt(ui.value)) {
                            // value decreased
                            gearOneAngle -= 1;
                            $('.gear-two').css('transform', 'rotate(' + gearOneAngle + 'deg)');
                        } else {
                            // value increased
                            gearOneAngle += 1;
                            $('.gear-two').css('transform', 'rotate(' + gearOneAngle + 'deg)');
                        }

                    }

                    if (ui.values[1] === 1693267200000) {
                        if (!$('.range-alert').hasClass('active')) {
                            $('.range-alert').addClass('active');
                        }
                    } else {
                        if ($('.range-alert').hasClass('active')) {
                            $('.range-alert').removeClass('active');
                        }
                    }
                },
                stop: function (event, ui) {
                    // Callback for when the user releases the handle
                    console.log('Slider values on release:', ui.values);
                    getdateRange(ui.values)

                    // Perform any other actions you need with the values
                },
            });

            // Prevent the range container from moving the slider
            $('.range, .range-alert').on('mousedown', function (event) {
                // console.log(ui.values,"valueee 122227888")
                event.stopPropagation();
            });
            // let selectedDate; 
            // const openCalendarButton = document.querySelectorAll('.ui-slider-range');

            //     // Initialize the calendar when the button is clicked
            //     openCalendarButton[0].addEventListener('click', function () {
            //         flatpickr('.ui-slider-handle', {
            //         // Configuration options for the calendar
            //         dateFormat: 'Y-m-d', // Customize the date format as needed

            //         onChange: function (selectedDates, dateStr, instance) {
            //             selectedDate = selectedDates[0];
            //             console.log('Selected Date:', selectedDate);
            //         },
            //         });

            //     });
        }


    }, [])
    return (
        <>
            <div className="wrapper wrapper-parent">
                <div className="wrapper-container">

                    <div className="slider-wrapper">
                        <div id="slider-range"></div>

                        <div className="range-wrapper">
                            <div className="range"></div>
                            <div className="range-alert">+</div>

                            <div className="gear-wrapper">
                                <div className="gear-large gear-one">
                                    <div className="gear-tooth"></div>
                                    <div className="gear-tooth"></div>
                                    <div className="gear-tooth"></div>
                                    <div className="gear-tooth"></div>
                                </div>
                                <div className="gear-large gear-two">
                                    <div className="gear-tooth"></div>
                                    <div className="gear-tooth"></div>
                                    <div className="gear-tooth"></div>
                                    <div className="gear-tooth"></div>
                                </div>
                            </div>

                        </div>

                        {/* <div className="marker marker-0">2013</div>
        <div className="marker marker-10">2014</div>
        <div className="marker marker-20">2015</div>
        <div className="marker marker-30">2016</div>
        <div className="marker marker-40">2017</div>
        <div className="marker marker-50">2018</div>
        <div className="marker marker-60">2019</div>
        <div className="marker marker-70">2020</div>
        <div className="marker marker-80">2021</div>
        <div className="marker marker-90">2022</div>
        <div className="marker marker-100">2023</div> */}
                    </div>

                </div>
            </div>

        </>
    )
}

export default CalenderSlider