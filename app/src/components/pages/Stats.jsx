import React from 'react';
import { Segment, Form, Radio } from 'semantic-ui-react';
import ReactDatePicker from 'react-datepicker';
import StatsTable from '../charts/StatsTable';
import { startDate } from '../config';

export default class Stats extends React.Component {
    
    state = {
        startDate: startDate,
        isDaylyView: true
    };

    handleStartDateChange = (startDate) => {
        this.setState({startDate})
    }

    handleSetDailyViewChange = (isDaylyView) => {
        this.setState({isDaylyView});
    }

    render() {

        const { startDate, isDaylyView } = this.state;

        return (
            <>
                <Segment>
                    <ReactDatePicker
                        selected={startDate}
                        onChange={this.handleStartDateChange}
                    />
                    <Form>
                        <Form.Group>
                            <Radio
                                style={{margin: "10px"}}
                                label='Daily View'
                                name='radioGroup'
                                checked={isDaylyView}
                                onChange={() => this.handleSetDailyViewChange(true)}
                            />
                            <Radio
                                style={{margin: "10px"}}
                                label='Hourly View'
                                name='radioGroup'
                                checked={!isDaylyView}
                                onChange={() => this.handleSetDailyViewChange(false)}
                            />
                        </Form.Group>
                    </Form>
                    <StatsTable isDaylyView={isDaylyView} startDate={startDate} />
                </Segment>
            </>
        )
    }
}
