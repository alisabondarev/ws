import React from 'react';
import L from "leaflet";
import { Marker, Popup, Map, TileLayer, FeatureGroup } from 'react-leaflet';
import serverApi from '../../api/server.api';
import MarkerClusterGroup from '../map-components/MarkerClusterGroup';
import "./MapView.css";
import { startDate, months, arrSum } from '../config';
import { Loader, Button, Segment } from 'semantic-ui-react';
import moment from 'moment';
import HeatmapLayer from "react-leaflet-heatmap-layer";

const createClusterCustomIcon = function (cluster) {
    return L.divIcon({
      html: `<span >${cluster.getChildCount()}</span>`,
      className: 'marker-cluster-custom',
      iconSize: L.point(40, 40, true),
    });
  }

const parameters = ["impressions", "clicks", "revenue"];
  
export default class MapView extends React.Component
{
    state = {
        poi: [],
        startDate: startDate,
        loading: true,
        selectedMonth: 1,
        poiStats: [],
        statsIntensity: [],
        parameter: "impressions"
    }

    async componentDidMount()
    {
        const { startDate } = this.state;

        const response = await serverApi.getPoi();

        const poiStats = await serverApi.getPoiMonthlyStats({date: moment(startDate).format("YYYY-MM-DD")});

        this.prepareMonthlyStats({poi: response, poiStats});

        this.setState({loading: false, poi: response, poiStats});
    }

    handleMonthView = (monthId) => {

        this.prepareMonthlyStats({monthId});

        this.setState({selectedMonth: monthId});
    }

    handleUpdateParameter = (parameter) => {
        
        this.prepareMonthlyStats({parameter});

        this.setState({parameter});
    }

    prepareMonthlyStats = ({poi, poiStats, monthId, parameter}) => {

        poi = poi || this.state.poi;
        poiStats = poiStats || this.state.poiStats;
        monthId = monthId || this.state.selectedMonth;
        parameter = parameter || this.state.parameter

        const poiMap = {};
            poi.forEach(poi => poiMap[poi.poi_id] = poi);

        poiStats.forEach(stats => {
            if (stats.month === monthId) {
                poiMap[stats.poi_id] = Object.assign(poiMap[stats.poi_id], stats);
            }
        });

        console.log("poiStats", monthId, poiMap);

        let statsIntensity = Object.values(poiMap);

        const sumParameter = arrSum(statsIntensity.map(s => Number(s[parameter])));

        statsIntensity.forEach(s => s[parameter] = + s[parameter] / sumParameter);

        statsIntensity = statsIntensity.map(s => [s.lat, s.lon, s[parameter]]);
        
        console.log("statsIntensity", sumParameter, statsIntensity);

        this.setState({ statsIntensity });
    }

    render() {

        const { poi, loading, selectedMonth, parameter, statsIntensity } = this.state;
        const position = [43.655682, -79.384047];
        const style = { height: "80vh" };
        
        return (
            <>
                <Loader active={loading} />
                <Segment basic>
                    <Button.Group >
                        { months.map((m, index) => 
                            <Button basic={index + 1 !== selectedMonth} color="blue" name="month"  
                                content={m} key={index} onClick={() => this.handleMonthView(index + 1)} />)}
                    </Button.Group>
                </Segment>
                <Segment basic>
                    <Button.Group >
                        { parameters.map((m, index) => 
                            <Button basic={m !== parameter} color="green" name="month"  
                                content={m} key={index} onClick={() => this.handleUpdateParameter(m)} />)}
                    </Button.Group>
                </Segment>
                <Map center={position} zoom={13} style={style} maxZoom={30} >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />    
                        <FeatureGroup>
                            <MarkerClusterGroup maxClusterRadius={40} showCoverageOnHover={false} zoomToBoundsOnClick={false}
                                            spiderfyOnMaxZoom={false} iconCreateFunction={createClusterCustomIcon} >
                                {
                                    poi.map(p =>
                                        <Marker key={p.name} position={[p.lat, p.lon]}>
                                            <Popup>{p.name}</Popup>
                                        </Marker>
                                    )                            
                                }
                            </MarkerClusterGroup>
                        </FeatureGroup>
                        <FeatureGroup>
                            <HeatmapLayer
                                fitBoundsOnLoad
                                fitBoundsOnUpdate={false}
                                radius={50}
                                minOpacity={0.5}
                                points={statsIntensity}
                                latitudeExtractor={m => m[0]}                            
                                longitudeExtractor={m => m[1]}
                                intensityExtractor={m => m[2]} 
                            />
                        </FeatureGroup>
                    </Map>
            </>
        )
    }
}