import React, { useState } from 'react';
import { Segment, Radio, Form } from 'semantic-ui-react';
import EventsHourly from '../charts/EventsHourly';
import EventsDaily from '../charts/EventsDaily';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { startDate as initialStartDate } from '../config';

const Events = () =>
{
    let [startDate, setStartDate] = useState(initialStartDate);
    let [isDaylyView, setIsDailyView] = useState(true);

    return (
        <Segment.Group>
            <DatePicker
                selected={startDate}
                onChange={setStartDate}
            />
            <Form>
                <Form.Group>
                    <Radio
                        style={{margin: "10px"}}
                        label='Daily View'
                        name='radioGroup'
                        checked={isDaylyView}
                        onChange={() => setIsDailyView(true)}
                    />
                    <Radio
                        style={{margin: "10px"}}
                        label='Hourly View'
                        name='radioGroup'
                        checked={!isDaylyView}
                        onChange={() => setIsDailyView(false)}
                    />
                </Form.Group>
            </Form>
            {   !isDaylyView &&
                <EventsHourly startDate={startDate} />
            }
            {   isDaylyView &&
                <EventsDaily startDate={startDate} />
            }
        </Segment.Group>
    )
}

export default Events;