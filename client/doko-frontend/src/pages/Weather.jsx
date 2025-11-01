import React from 'react'
import WeatherForecast from '../components/common/WeatherForecast';
const Weather = () => {
    return (
        <div className="flex grid-cols-1 lg:grid-cols-2 gap-6 m-10 justify-center">
            <WeatherForecast showAgriculturalInsights={true} />

        </div>
    )
}

export default Weather;