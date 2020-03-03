const express = require('express')
const { Pool } = require('pg');
const rateLimiter = require('./rate-limiter');
require('dotenv').config();

const app = express()
// configs come from standard PostgreSQL env vars
// https://www.postgresql.org/docs/9.6/static/libpq-envars.html
const pool = new Pool();

const queryHandler = async (req, res, next) => {  
  try {
      const r = await pool.query(req.sqlQuery, req.vars);    
      
      return res.json(r.rows || []);
  }
  catch(err) {
      console.log("query error:", err);
      next()
  }
}

const rateLimiterMiddleware = rateLimiter({maxNumOfRequests: 1, windowMs: 1000, clearingRate: 5});

app.use(rateLimiterMiddleware);

app.get('/', (req, res) => {
  res.send('Welcome to EQ Works 😎')
})

app.get('/events/hourly', (req, res, next) => {

  const { date } = req.query;

  req.vars = [date]; 

  req.sqlQuery = `
    SELECT date, hour, events
    FROM public.hourly_events
    WHERE date = $1 
    ORDER BY hour;
  `
  return next()
}, queryHandler)

app.get('/events/daily', (req, res, next) => {

  const { date } = req.query;
  req.vars = [date];

  req.sqlQuery = `
    SELECT date, SUM(events) AS events
    FROM public.hourly_events
    WHERE date >= $1
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `
  return next()
}, queryHandler)

app.get('/stats/hourly', (req, res, next) => {
  
  const { date } = req.query;
  req.vars = [date];

  req.sqlQuery = `
    SELECT date, hour, impressions, clicks, revenue
    FROM public.hourly_stats
    WHERE date = $1
    ORDER BY date, hour;
  `
  return next()
}, queryHandler)

app.get('/stats/daily', (req, res, next) => {
  
  const { date } = req.query;
  req.vars = [date];

  req.sqlQuery = `
    SELECT date,
        SUM(impressions) AS impressions,
        SUM(clicks) AS clicks,
        SUM(revenue) AS revenue
    FROM public.hourly_stats
    WHERE date >= $1
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `
  return next()
}, queryHandler)

app.get('/poi/stats/monthly', (req, res, next) => {
  
  const { date } = req.query;
  req.vars = [date];

  req.sqlQuery = `
  SELECT EXTRACT(MONTH FROM date) AS month,
    SUM(impressions) AS impressions,
    SUM(clicks) AS clicks,
    SUM(revenue) AS revenue,
    poi_id
  FROM public.hourly_stats
  WHERE date >= $1
  GROUP BY month, poi_id
  ORDER BY month, poi_id
  LIMIT 12;
  `
  return next()
}, queryHandler)

app.get('/poi', (req, res, next) => {
  req.sqlQuery = `
    SELECT *
    FROM public.poi;
  `
  return next()
}, queryHandler);


app.listen(process.env.PORT || 5555, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  } else {
    console.log(`Running on ${process.env.PORT || 5555}`)
  }
})

// last resorts
process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`)
  //process.exit(1)
})
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  //process.exit(1)
})
