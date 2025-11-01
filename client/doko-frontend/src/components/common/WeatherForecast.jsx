// src/components/common/WeatherForecast.js
import React, { useState, useEffect } from 'react';
import { weatherService } from '../../services/weatherService';

const WeatherForecast = ({ location = null, showAgriculturalInsights = true }) => {
    const [weather, setWeather] = useState(null);
    const [agriculturalData, setAgriculturalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userLocation, setUserLocation] = useState(location);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        if (userLocation) {
            fetchWeatherData();
        } else {
            getUserLocation();
        }
    }, [userLocation]);

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude.toString(),
                        lon: position.coords.longitude.toString()
                    });
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setError('Using default location (Kathmandu)');
                    setUserLocation({ lat: "27.7172", lon: "85.3240" });
                }
            );
        } else {
            setError('Geolocation not supported. Using Kathmandu.');
            setUserLocation({ lat: "27.7172", lon: "85.3240" });
        }
    };

    const fetchWeatherData = async () => {
        try {
            setLoading(true);
            setError('');

            let data;
            if (showAgriculturalInsights) {
                data = await weatherService.getAgriculturalWeather(userLocation.lat, userLocation.lon);
                setAgriculturalData(data?.agricultural_insights);
            } else {
                data = await weatherService.getWeatherForecast(userLocation.lat, userLocation.lon);
            }

            setWeather(data);
        } catch (err) {
            console.error('Weather API failed:', err);
            setError('Using demo weather data');
            const mockData = showAgriculturalInsights ?
                await weatherService.getAgriculturalWeather("27.7172", "85.3240") :
                weatherService.getMockWeatherData();
            setWeather(mockData);
            setAgriculturalData(mockData?.agricultural_insights);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.length > 2) {
            const results = await weatherService.searchPlacesPrefix(query);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const handleLocationSelect = async (place) => {
        setUserLocation({ lat: place.lat, lon: place.lon });
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    const getWeatherIcon = (iconNum) => {
        const iconMap = {
            1: '☀️',  // Clear sky
            2: '🌤️',  // Few clouds
            3: '⛅',  // Partly cloudy
            4: '☁️',  // Cloudy
            5: '🌧️',  // Rain
            6: '❄️',  // Snow
            7: '⛈️',  // Thunderstorm
            8: '🌫️',  // Fog
        };
        return iconMap[iconNum] || '🌤️';
    };

    const getAgriculturalIcon = (level) => {
        const icons = {
            excellent: '✅',
            good: '👍',
            poor: '⚠️',
            high: '🔴',
            moderate: '🟡',
            low: '🟢',
            ideal: '⭐',
            delay: '⏳'
        };
        return icons[level] || '📊';
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                    <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-6 shadow-lg border border-blue-200">
            {/* Header with Search */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Weather Forecast</h2>
                <div className="flex items-center space-x-2">
                    {error && <span className="text-sm text-yellow-600">{error}</span>}
                    <button
                        onClick={() => setShowSearch(!showSearch)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                        📍 Change Location
                    </button>
                    <button
                        onClick={fetchWeatherData}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        🔄
                    </button>
                </div>
            </div>

            {/* Location Search */}
            {showSearch && (
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search for a location..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {searchResults.length > 0 && (
                        <div className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                            {searchResults.map((place, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleLocationSelect(place)}
                                    className="w-full px-3 py-2 text-left hover:bg-blue-50 border-b border-gray-100 last:border-0"
                                >
                                    <div className="font-medium">{place.name}</div>
                                    <div className="text-sm text-gray-600">{place.country}, {place.admin1}</div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Current Weather */}
            {weather?.current && (
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                        <div className="text-4xl">
                            {getWeatherIcon(weather.current.icon_num)}
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-gray-900">
                                {Math.round(weather.current.temperature)}°C
                            </div>
                            <div className="text-gray-600">{weather.current.summary}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                            <div className="text-gray-600">Humidity</div>
                            <div className="font-semibold">{weather.current.humidity}%</div>
                        </div>
                        <div>
                            <div className="text-gray-600">Wind</div>
                            <div className="font-semibold">{weather.current.wind_speed} km/h</div>
                        </div>
                        <div>
                            <div className="text-gray-600">Precip</div>
                            <div className="font-semibold">{weather.current.precipitation || 0}mm</div>
                        </div>
                        <div>
                            <div className="text-gray-600">Clouds</div>
                            <div className="font-semibold">{weather.current.cloud_cover}%</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Agricultural Insights */}
            {showAgriculturalInsights && agriculturalData && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">🌱 Farming Insights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center space-x-2">
                            <span>{getAgriculturalIcon(agriculturalData.planting_suitability?.level)}</span>
                            <div>
                                <div className="font-medium">Planting</div>
                                <div className="text-green-700">{agriculturalData.planting_suitability?.message}</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span>{getAgriculturalIcon(agriculturalData.irrigation_recommendation?.need)}</span>
                            <div>
                                <div className="font-medium">Irrigation</div>
                                <div className="text-green-700">{agriculturalData.irrigation_recommendation?.message}</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span>{getAgriculturalIcon(agriculturalData.pest_risk_level?.risk)}</span>
                            <div>
                                <div className="font-medium">Pest Risk</div>
                                <div className="text-green-700">{agriculturalData.pest_risk_level?.message}</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span>{getAgriculturalIcon(agriculturalData.harvest_recommendation?.recommendation)}</span>
                            <div>
                                <div className="font-medium">Harvest</div>
                                <div className="text-green-700">{agriculturalData.harvest_recommendation?.message}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hourly Forecast */}
            {weather?.hourly && weather.hourly.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">24-Hour Forecast</h3>
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {weather.hourly.slice(0, 12).map((hour, index) => (
                            <div key={index} className="flex flex-col items-center text-center min-w-16 bg-white/50 rounded-lg p-2">
                                <div className="text-xs text-gray-600">{hour.time}</div>
                                <div className="text-lg my-1">{getWeatherIcon(hour.icon_num)}</div>
                                <div className="text-sm font-semibold">{Math.round(hour.temperature)}°</div>
                                {hour.precipitation > 0 && (
                                    <div className="text-xs text-blue-600">{hour.precipitation}mm</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Daily Forecast */}
            {weather?.daily && weather.daily.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">7-Day Forecast</h3>
                    <div className="space-y-2">
                        {weather.daily.slice(0, 7).map((day, index) => (
                            <div key={index} className="flex items-center justify-between py-2 px-3 bg-white/50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm font-medium text-gray-900 w-12">{day.weekday}</span>
                                    <span className="text-xl">{getWeatherIcon(day.icon_num)}</span>
                                </div>
                                <div className="text-sm text-gray-600 text-right">
                                    <div>
                                        <span className="font-semibold text-gray-900">{Math.round(day.temperature_max)}°</span>
                                        <span className="mx-1">/</span>
                                        <span>{Math.round(day.temperature_min)}°</span>
                                    </div>
                                    {day.precipitation > 0 && (
                                        <div className="text-xs text-blue-600">{day.precipitation}mm rain</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeatherForecast;