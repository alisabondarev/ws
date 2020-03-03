import moment from 'moment';
import MapView from "./pages/MapView";
import Events from './pages/Events';
import Stats from "./pages/Stats";

export const menuItems = [    
    {
        title: "Events - Chart View",
        link: "/events",
        component: Events,
        active: true
    },
    {
        title: "Stats - Table View",
        link: "/stats",
        component: Stats
    },
    {
        title: "Map View",
        link: "/map",
        component: MapView,
        
    }    
];

export const startDate = moment('2017-01-01').toDate();

export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

export const arrSum = arr => arr.reduce((a,b) => a + b, 0)