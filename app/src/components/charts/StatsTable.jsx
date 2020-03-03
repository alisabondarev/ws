import React from 'react';
import { Loader, Table, Input } from 'semantic-ui-react';
import serverApi from '../../api/server.api';
import moment from 'moment';

const financial = (x) => {
    return Number.parseFloat(x).toFixed(2);
}

const highlightRow = (search, el) => {

    if (!search) {
        return false
    }

    let highlight = false;

    Object.keys(el).forEach(key => {
        highlight = highlight || el[key].toString().includes(search)
    });

    return highlight;
}
  
export default class StatsTable extends React.Component {

    state = {
        loading: true,
        data: []
    }

    componentDidMount = () => {
        this.loadData();
    }

    componentDidUpdate = (prevProps) => {

        if (prevProps.isDaylyView !== this.props.isDaylyView 
            || prevProps.startDate !== this.props.startDate) {
            
            this.loadData();
        }
    }

    loadData = async () => {

        const { isDaylyView, startDate } = this.props;

        if (startDate) {
            
            this.setState({loading: true});

            const date = moment(startDate).format("YYYY-MM-DD");

            let result;

            if (isDaylyView)
            {
                result = await serverApi.getStatsDaily({ date });
            }
            else {
                result = await serverApi.getStatsHourly({ date });
            }

            if (!Array.isArray(result)) {
                result = []
            }

            this.setState({loading: false, data: result});
        }
    }

    handleOnChange = (e, {name, value}) => {
        this.setState({[name]: value});
    }
 
    render() {

        const { loading, data, search } = this.state;
        const { isDaylyView } = this.props;

        return (
            <>
                <Loader active={loading}/>
                <Input name="search" icon='search' placeholder='Search...' onChange={this.handleOnChange} />
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>{isDaylyView ? "Date" : "Hour"}</Table.HeaderCell>
                            <Table.HeaderCell>Impressions</Table.HeaderCell>
                            <Table.HeaderCell>Clicks</Table.HeaderCell>
                            <Table.HeaderCell>Revenue</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {
                        data.map((el, index) => 
                            <Table.Row key={index} positive={highlightRow(search, el)}>
                                <Table.Cell>{isDaylyView ? moment(el.date).format("YYYY-MM-DD") : el.hour}</Table.Cell>
                                <Table.Cell>{el.impressions}</Table.Cell>
                                <Table.Cell>{el.clicks}</Table.Cell>
                                <Table.Cell>{financial(el.revenue)}</Table.Cell>
                            </Table.Row>
                        )
                    }
                    </Table.Body>
                </Table>
            </>
        )
    }
}