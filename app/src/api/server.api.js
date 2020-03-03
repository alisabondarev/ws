class webAPI {


    createHeaders() {

        let headers = { "Content-Type": "application/json; charset=utf-8" };

		return headers;
    }
    
	async get(url) {

		let json = {};
		let headers = this.createHeaders();

		const response = await fetch(url, { headers: headers });
        
        if (response.status === 200) {
			json = await response.json();
		}

		return json;
    }
}

class serverAPI extends webAPI {

    async getEventsHourly({date})
    {
        try {
            const response = await this.get(`/events/hourly?date=${date}`);

            return response;
        }
        catch(err) {
            console.error(err);
        }

        return [];
    }

    async getEventsDaily({date})
    {
        try {
            const response = await this.get(`/events/daily?date=${date}`);

            return response;
        }
        catch(err) {
            console.error(err);
        }

        return [];
    }

    async getStatsHourly({date})
    {
        try {
            const response = await this.get(`/stats/hourly?date=${date}`);

            return response;
        }
        catch(err) {
            console.error(err);
        }

        return [];
    }

    async getStatsDaily({date})
    {        
        try {
            const response = await this.get(`/stats/daily?date=${date}`);

            return response;
        }
        catch(err) {
            console.error(err);
        }

        return [];
    }

    async getPoiMonthlyStats({date})
    {
        try {
            const response = await this.get(`/poi/stats/monthly?date=${date}`);

            return response;
        }
        catch(err) {
            console.error(err);
        }

        return [];
    }

    async getPoi()
    {
        try {
            const response = await this.get('/poi');

            return response;
        }
        catch(err) {
            console.log(err);
        }

        return [];
    }
}

export default new serverAPI();