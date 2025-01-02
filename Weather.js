import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsSearch } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa'; // Icon for quotes
import { WiThermometer, WiHumidity, WiStrongWind, WiDayFog } from 'react-icons/wi'; // Import weather icons

const WeatherApp = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [quote, setQuote] = useState('');

    const fetchWeatherData = async () => {
        if (!city.trim()) return;

        setLoading(true);
        try {
            // Fetch weather data
            const weatherResponse = await axios.get('http://localhost:5000/api/weather', {
                params: { city },
            });
            setWeather(weatherResponse.data);

            // Fetch background image
            const imageResponse = await axios.get('http://localhost:5000/api/background', {
                params: { city },
            });
            setBackgroundImage(imageResponse.data.url);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRandomQuote = async () => {
        try {
            const response = await axios.get('https://quotes15.p.rapidapi.com/quotes/random/?language_code=en', {
                headers: {
                    'x-rapidapi-host': 'quotes15.p.rapidapi.com',
                    'x-rapidapi-key': '07ab971dc4msh4bad6264e6c1299p111dacjsne9c6a250a3d5',
                },
            });
            setQuote(response.data.content);
        } catch (error) {
            console.error('Error fetching quote:', error);
        }
    };

    useEffect(() => {
        fetchRandomQuote();
    }, []);

    return (
        <motion.div
            className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                backgroundImage: `url(${backgroundImage || 'default-image-url'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
            transition={{ duration: 1.5 }}
        >
            <motion.div
                className="bg-white bg-opacity-80 rounded-3xl shadow-lg p-8 w-full max-w-fit" // Changed max-width to fit content
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.h1
                    className="text-4xl font-bold text-center text-gray-800 mb-4"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    Weather App
                </motion.h1>
                <motion.div
                    className="flex items-center border border-gray-300 rounded-lg overflow-hidden mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <input
                        type="text"
                        placeholder="Enter city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-2 focus:outline-none"
                    />
                    <button
                        onClick={fetchWeatherData}
                        className="bg-blue-500 p-2 flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                    >
                        <BsSearch size={20} />
                    </button>
                </motion.div>
                {loading && <p className="text-blue-500 text-center">Fetching data...</p>}
                {weather && (
                    <motion.div
                        className="mt-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white p-8 rounded-lg shadow-md"> {/* Increased padding */}
                            <motion.h2
                                className="text-3xl font-bold text-center"
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {weather.name}
                            </motion.h2>
                            <p className="text-center text-lg mt-2">
                                {new Date().toLocaleString()}
                            </p>
                            <div className="flex justify-center items-center mt-4">
                                <motion.div
                                    initial={{ scale: 0.8, rotate: -10 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <p className="text-lg ml-2 capitalize">
                                        {weather.weather[0].description}
                                    </p>
                                </motion.div>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <p className="text-lg flex items-center">
                                    <WiThermometer size={24} className="mr-2" />
                                    Temp: <span className="font-bold">{weather.main.temp}°C</span>
                                </p>
                                <p className="text-lg flex items-center">
                                    <WiHumidity size={24} className="mr-2" />
                                    Humidity: <span className="font-bold">{weather.main.humidity}%</span>
                                </p>
                                <p className="text-lg flex items-center">
                                    <WiStrongWind size={24} className="mr-2" />
                                    Wind: <span className="font-bold">{weather.wind.speed} m/s</span>
                                </p>
                                <p className="text-lg flex items-center">
                                    <WiDayFog size={24} className="mr-2" />
                                    Visibility: <span className="font-bold">{weather.visibility / 1000} km</span>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.div>

            {/* Random Quote Section */}
            <motion.div
                className="mt-8 p-4 bg-gray-800 text-white rounded-lg shadow-md flex items-center gap-4 max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <FaQuoteLeft size={30} />
                <p className="italic">{quote || 'Loading a random quote...'}</p>
            </motion.div>
        </motion.div>
    );
};

export default WeatherApp;
