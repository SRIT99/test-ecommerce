// src/services/weatherService.js
const METEOSOURCE_API_KEY = '36500xe0rydo762k5hzoi1wulukzz91s5morank1';
const METEOSOURCE_BASE_URL = 'https://www.meteosource.com/api/v1/free';

export const weatherService = {
  // Get complete weather data using GPS coordinates
  async getWeatherForecast(lat, lon, sections = 'current,hourly,daily') {
    try {
      const params = new URLSearchParams({
        key: METEOSOURCE_API_KEY,
        lat: lat,
        lon: lon,
        sections: sections,
        timezone: 'auto',
        units: 'metric',
        language: 'en'
      });

      console.log('Fetching weather from:', `${METEOSOURCE_BASE_URL}/point?${params}`);

      const response = await fetch(`${METEOSOURCE_BASE_URL}/point?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Weather API error: ${errorData.detail || response.status}`);
      }

      const data = await response.json();
      console.log('Raw weather data:', data);
      return this.transformWeatherData(data);
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      return this.getMockWeatherData();
    }
  },

  // Get weather data using place_id (for mountains/precise locations)
  async getWeatherByPlaceId(placeId, sections = 'current,hourly,daily') {
    try {
      const params = new URLSearchParams({
        key: METEOSOURCE_API_KEY,
        place_id: placeId,
        sections: sections,
        timezone: 'auto',
        units: 'metric',
        language: 'en'
      });

      const response = await fetch(`${METEOSOURCE_BASE_URL}/point?${params}`);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformWeatherData(data);
    } catch (error) {
      console.error('Failed to fetch weather data by place ID:', error);
      return this.getMockWeatherData();
    }
  },

  // Search for places by name
  async searchPlaces(query) {
    try {
      const response = await fetch(
        `${METEOSOURCE_BASE_URL}/find_places?key=${METEOSOURCE_API_KEY}&text=${encodeURIComponent(query)}&language=en`
      );
      
      if (!response.ok) {
        throw new Error(`Places API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to search places:', error);
      return [];
    }
  },

  // Prefix search for autocomplete
  async searchPlacesPrefix(prefix) {
    try {
      const response = await fetch(
        `${METEOSOURCE_BASE_URL}/find_places_prefix?key=${METEOSOURCE_API_KEY}&text=${encodeURIComponent(prefix)}&language=en`
      );
      
      if (!response.ok) {
        throw new Error(`Places API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to search places prefix:', error);
      return [];
    }
  },

  // Transform API data to consistent format
  transformWeatherData(data) {
    if (!data) return null;

    return {
      location: {
        lat: data.lat,
        lon: data.lon,
        timezone: data.timezone,
        elevation: data.elevation
      },
      current: {
        temperature: data.current?.temperature,
        summary: data.current?.summary,
        icon: data.current?.icon,
        icon_num: data.current?.icon_num,
        humidity: data.current?.humidity,
        wind_speed: data.current?.wind?.speed,
        wind_angle: data.current?.wind?.angle,
        wind_dir: data.current?.wind?.dir,
        precipitation: data.current?.precipitation?.total,
        precipitation_type: data.current?.precipitation?.type,
        cloud_cover: data.current?.cloud_cover,
        feels_like: data.current?.feels_like
      },
      hourly: data.hourly?.data?.map(hour => ({
        date: hour.date,
        time: new Date(hour.date).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temperature: hour.temperature,
        icon: hour.icon,
        icon_num: hour.icon_num,
        summary: hour.summary,
        wind_speed: hour.wind?.speed,
        precipitation: hour.precipitation?.total,
        precipitation_type: hour.precipitation?.type,
        cloud_cover: hour.cloud_cover?.total
      })) || [],
      daily: data.daily?.data?.map(day => ({
        day: day.day,
        weekday: new Date(day.day).toLocaleDateString('en-US', { weekday: 'short' }),
        summary: day.summary,
        icon: day.icon,
        icon_num: day.icon_num,
        temperature_max: day.all_day?.temperature_max,
        temperature_min: day.all_day?.temperature_min,
        temperature: day.all_day?.temperature,
        wind_speed: day.all_day?.wind?.speed,
        precipitation: day.all_day?.precipitation?.total,
        precipitation_type: day.all_day?.precipitation?.type,
        morning: day.morning,
        afternoon: day.afternoon,
        evening: day.evening
      })) || [],
      units: data.units
    };
  },

  // Get agricultural-specific weather insights
  async getAgriculturalWeather(lat, lon) {
    const data = await this.getWeatherForecast(lat, lon, 'current,hourly,daily');
    
    if (!data) return null;

    // Add agricultural insights
    return {
      ...data,
      agricultural_insights: {
        planting_suitability: this.getPlantingSuitability(data),
        irrigation_recommendation: this.getIrrigationRecommendation(data),
        pest_risk_level: this.getPestRiskLevel(data),
        harvest_recommendation: this.getHarvestRecommendation(data),
        crop_health: this.getCropHealthAssessment(data),
        soil_moisture: this.getSoilMoistureEstimate(data)
      }
    };
  },

  // Agricultural analysis methods
  getPlantingSuitability(data) {
    const temp = data.current.temperature;
    const precip = data.current.precipitation;
    
    if (temp >= 18 && temp <= 30 && precip < 2) {
      return { level: 'excellent', message: 'Ideal conditions for planting' };
    } else if (temp >= 15 && temp <= 32 && precip < 5) {
      return { level: 'good', message: 'Good conditions for planting' };
    } else {
      return { level: 'poor', message: 'Consider delaying planting' };
    }
  },

  getIrrigationRecommendation(data) {
    const dailyPrecip = data.daily.slice(0, 3).reduce((sum, day) => sum + (day.precipitation || 0), 0);
    
    if (dailyPrecip < 5) return { need: 'high', message: 'Irrigation recommended' };
    if (dailyPrecip < 15) return { need: 'moderate', message: 'Light irrigation may be needed' };
    return { need: 'low', message: 'No irrigation needed' };
  },

  getPestRiskLevel(data) {
    const humidity = data.current.humidity;
    const temp = data.current.temperature;
    
    if (humidity > 75 && temp > 25) {
      return { risk: 'high', message: 'High pest risk - monitor crops closely' };
    } else if (humidity > 65 && temp > 22) {
      return { risk: 'moderate', message: 'Moderate pest risk' };
    } else {
      return { risk: 'low', message: 'Low pest risk' };
    }
  },

  getHarvestRecommendation(data) {
    const next24hPrecip = data.hourly.slice(0, 24).reduce((sum, hour) => sum + (hour.precipitation || 0), 0);
    
    if (next24hPrecip < 1) {
      return { recommendation: 'ideal', message: 'Perfect harvesting conditions' };
    } else if (next24hPrecip < 5) {
      return { recommendation: 'good', message: 'Good harvesting conditions' };
    } else {
      return { recommendation: 'delay', message: 'Consider delaying harvest due to rain' };
    }
  },

  getCropHealthAssessment(data) {
    const temp = data.current.temperature;
    const humidity = data.current.humidity;
    
    if (temp >= 20 && temp <= 28 && humidity >= 60 && humidity <= 80) {
      return { status: 'excellent', message: 'Optimal conditions for crop growth' };
    } else {
      return { status: 'good', message: 'Good conditions for crop growth' };
    }
  },

  getSoilMoistureEstimate(data) {
    const recentRain = data.daily.slice(0, 2).reduce((sum, day) => sum + (day.precipitation || 0), 0);
    
    if (recentRain > 20) return { level: 'saturated', message: 'Soil is well saturated' };
    if (recentRain > 10) return { level: 'adequate', message: 'Soil moisture is adequate' };
    if (recentRain > 5) return { level: 'moderate', message: 'Soil moisture is moderate' };
    return { level: 'dry', message: 'Soil is dry - irrigation needed' };
  },

  // Mock data for fallback
  getMockWeatherData() {
    const now = new Date();
    return {
      location: {
        lat: "27.7172",
        lon: "85.3240",
        timezone: "Asia/Kathmandu",
        elevation: 1400
      },
      current: {
        temperature: 22,
        summary: 'Partly cloudy',
        icon: 'partly_cloudy',
        icon_num: 4,
        humidity: 65,
        wind_speed: 12,
        wind_angle: 180,
        wind_dir: 'S',
        precipitation: 0,
        precipitation_type: 'none',
        cloud_cover: 45,
        feels_like: 23
      },
      hourly: Array.from({ length: 24 }, (_, i) => {
        const date = new Date(now.getTime() + i * 60 * 60 * 1000);
        return {
          date: date.toISOString(),
          time: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
          temperature: 18 + Math.random() * 10,
          icon: ['clear', 'partly_cloudy', 'cloudy', 'rain'][Math.floor(Math.random() * 4)],
          icon_num: Math.floor(Math.random() * 6) + 1,
          summary: 'Mixed conditions',
          wind_speed: 8 + Math.random() * 10,
          precipitation: Math.random() > 0.7 ? Math.random() * 3 : 0,
          precipitation_type: 'rain',
          cloud_cover: Math.floor(Math.random() * 100)
        };
      }),
      daily: Array.from({ length: 7 }, (_, i) => {
        const day = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
        return {
          day: day.toISOString().split('T')[0],
          weekday: day.toLocaleDateString('en-US', { weekday: 'short' }),
          summary: 'Mixed weather throughout the day',
          icon: ['clear', 'partly_cloudy', 'cloudy', 'rain'][Math.floor(Math.random() * 4)],
          icon_num: Math.floor(Math.random() * 6) + 1,
          temperature_max: 25 + Math.random() * 8,
          temperature_min: 15 + Math.random() * 5,
          temperature: 20 + Math.random() * 6,
          wind_speed: 10 + Math.random() * 8,
          precipitation: Math.random() > 0.5 ? Math.random() * 8 : 0,
          precipitation_type: 'rain'
        };
      }),
      units: 'metric'
    };
  }
};