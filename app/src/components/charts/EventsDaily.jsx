import React from 'react';
import { Segment, Header, Loader } from 'semantic-ui-react';
import serverAPI from '../../api/server.api';
import moment from "moment";
import { Chart } from "react-google-charts";

export default class EventsDaily extends React.Component
{
    state = {
        loading: true,
        data: [],
        axes: undefined
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

    loadData = async () => {
        const date = moment(this.props.startDate).format("YYYY-MM-DD");

        this.setState({loading: true});

        const result = await serverAPI.getEventsDaily({date});

        if (Array.isArray(result))
        {
            let data = [["Day", "Events"]];

            result.forEach(r => 
            data.push([ "" + moment(r.date).date(), +r.events ])
            );

            this.setState({loading: false, data})
        }
    }

    render() {

        const { loading, data,  } = this.state;

        return (
           <Segment>
               <Header as="h4">Events - Daily</Header>
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
                            title: 'Daily Events',
                            },
                        }}
                    />
               }
           </Segment>
        );
    }    
}
