require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 5000;

// Check for required environment variables
if (!process.env.OPENWEATHER_API_KEY) {
    console.error('Error: OPENWEATHER_API_KEY is not defined in the environment variables.');
    process.exit(1);
}

if (!process.env.UNSPLASH_API_KEY) {
    console.error('Error: UNSPLASH_API_KEY is not defined in the environment variables.');
    process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(compression());

// Base route
app.get('/', (req, res) => {
    res.send('Welcome to the Weather App API');
});

// Weather API route
app.get('/api/weather', async (req, res) => {
    const { city } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!city) {
        return res.status(400).json({ error: 'City parameter is required' });
    }

    try {
        const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: { q: city, units: 'metric', appid: apiKey },
        });
        res.json(weatherResponse.data);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.status(404).json({ error: 'City not found. Please enter a valid city name.' });
        } else {
            console.error('Error fetching weather data:', error.message);
            res.status(500).json({ error: 'Unable to fetch weather data. Please try again later.' });
        }
    }
});

// Unsplash API route
app.get('/api/background', async (req, res) => {
    const { city } = req.query;
    const unsplashKey = process.env.UNSPLASH_API_KEY;

    if (!city) {
        return res.status(400).json({ error: 'City parameter is required' });
    }

    try {
        const response = await axios.get('https://api.unsplash.com/photos/random', {
            params: { query: city, client_id: unsplashKey },
        });
        res.json({ url: response.data.urls.regular });
    } catch (error) {
        console.error('Error fetching background image:', error.message);
        res.status(500).json({ error: 'Unable to fetch background image. Please try again later.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
