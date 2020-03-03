import React from 'react';
import { Segment, Header, Loader } from 'semantic-ui-react';
import serverAPI from '../../api/server.api';
import { Chart } from "react-google-charts";
import moment from 'moment';


export default class EventsHourly extends React.Component
{
    state = {
        loading: true,
        data: []
    };

    async componentDidMount()
    {
        this.loadData();
    }   

    async componentDidUpdate(prevProps) {

        if (prevProps.startDate !== this.props.startDate) {
        
            this.loadData();
        }
    }

    loadData = async  () => {

        const date = moment(this.props.startDate).format("YYYY-MM-DD");

        this.setState({loading: true});

        const result = await serverAPI.getEventsHourly({date});

        if (Array.isArray(result)) {

            let data = [["Hour", "Events"]];

            result.forEach(r => 
            data.push([ "" + r.hour, +r.events ])
            );

            this.setState({loading: false, data});
        }

    }

    render() {

        const { loading, data } = this.state;

        return (
           <Segment>
               <Header as="h4">Events - Hourly</Header>
               <Loader active={loading} content="Loading..." />
               {
                   !loading &&
                   <Chart
                        width={'500px'}
                        height={'300px'}
                        chartType="Bar"
                        loader={<div>Loading Chart</div>}
                        data={data}
                        options={{
                            // Material design options
                            chart: {
                                title: 'Hourly Events',
                            },
                        }}
                    />
               }
           </Segment>
        );
    }    
}