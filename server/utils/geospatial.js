const NodeGeocoder = require('node-geocoder');
const { calculateDistance } = require('./helpers');

// Initialize geocoder
const geocoder = NodeGeocoder({
  provider: 'openstreetmap',
  // For production, you might want to use a different provider:
  // provider: 'google',
  // apiKey: process.env.GOOGLE_MAPS_API_KEY,
  httpAdapter: 'https',
  formatter: null
});

// Geocode address to coordinates
const geocodeAddress = async (address) => {
  try {
    const results = await geocoder.geocode(address);
    
    if (results && results.length > 0) {
      return {
        lat: results[0].latitude,
        lng: results[0].longitude,
        formattedAddress: results[0].formattedAddress
      };
    }
    
    throw new Error('Address not found');
  } catch (error) {
    throw new Error(`Geocoding failed: ${error.message}`);
  }
};

// Reverse geocode coordinates to address
const reverseGeocode = async (lat, lng) => {
  try {
    const results = await geocoder.reverse({ lat, lon: lng });
    
    if (results && results.length > 0) {
      return {
        address: results[0].formattedAddress,
        city: results[0].city || results[0].administrativeLevels?.level2long,
        country: results[0].country,
        zipcode: results[0].zipcode
      };
    }
    
    throw new Error('Location not found');
  } catch (error) {
    throw new Error(`Reverse geocoding failed: ${error.message}`);
  }
};

// Calculate delivery fee based on distance
const calculateDeliveryFee = (origin, destination, baseFee = 50, ratePerKm = 10) => {
  try {
    const distance = calculateDistance(
      origin.lat,
      origin.lng,
      destination.lat,
      destination.lng
    );
    
    // Minimum fee is baseFee, additional charge per km
    const fee = baseFee + (distance * ratePerKm);
    
    return Math.round(fee); // Round to nearest whole number
  } catch (error) {
    console.error('Delivery fee calculation error:', error);
    return baseFee; // Return base fee if calculation fails
  }
};

// Find nearby locations within radius
const findNearbyLocations = async (centerLat, centerLng, locations, maxDistanceKm = 50) => {
  try {
    const nearbyLocations = locations.filter(location => {
      if (!location.coordinates || !location.coordinates.lat || !location.coordinates.lng) {
        return false;
      }
      
      const distance = calculateDistance(
        centerLat,
        centerLng,
        location.coordinates.lat,
        location.coordinates.lng
      );
      
      return distance <= maxDistanceKm;
    });
    
    // Sort by distance
    nearbyLocations.sort((a, b) => {
      const distA = calculateDistance(
        centerLat,
        centerLng,
        a.coordinates.lat,
        a.coordinates.lng
      );
      
      const distB = calculateDistance(
        centerLat,
        centerLng,
        b.coordinates.lat,
        b.coordinates.lng
      );
      
      return distA - distB;
    });
    
    return nearbyLocations;
  } catch (error) {
    throw new Error(`Nearby locations search failed: ${error.message}`);
  }
};

// Calculate optimal route using Haversine formula
const calculateOptimalRoute = (points) => {
  if (points.length < 2) return points;
  
  // Simple implementation: nearest neighbor algorithm
  const unvisited = [...points];
  const route = [unvisited.shift()]; // Start with first point
  
  while (unvisited.length > 0) {
    const current = route[route.length - 1];
    let nearestIndex = 0;
    let nearestDistance = Infinity;
    
    for (let i = 0; i < unvisited.length; i++) {
      const distance = calculateDistance(
        current.coordinates.lat,
        current.coordinates.lng,
        unvisited[i].coordinates.lat,
        unvisited[i].coordinates.lng
      );
      
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }
    
    route.push(unvisited.splice(nearestIndex, 1)[0]);
  }
  
  return route;
};

// Get distance matrix between multiple points
const getDistanceMatrix = (points) => {
  const matrix = [];
  
  for (let i = 0; i < points.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < points.length; j++) {
      if (i === j) {
        matrix[i][j] = 0;
      } else {
        matrix[i][j] = calculateDistance(
          points[i].coordinates.lat,
          points[i].coordinates.lng,
          points[j].coordinates.lat,
          points[j].coordinates.lng
        );
      }
    }
  }
  
  return matrix;
};

// Validate coordinates
const isValidCoordinates = (lat, lng) => {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};

// Calculate bounding box around a point
const calculateBoundingBox = (lat, lng, radiusKm) => {
  const earthRadius = 6371; // Earth's radius in km
  
  // Convert radius from km to radians
  const radiusRad = radiusKm / earthRadius;
  
  // Calculate latitude bounds
  const minLat = lat - (radiusRad * 180 / Math.PI);
  const maxLat = lat + (radiusRad * 180 / Math.PI);
  
  // Calculate longitude bounds
  const deltaLng = Math.asin(Math.sin(radiusRad) / Math.cos(lat * Math.PI / 180));
  const minLng = lng - (deltaLng * 180 / Math.PI);
  const maxLng = lng + (deltaLng * 180 / Math.PI);
  
  return {
    minLat: Math.max(minLat, -90),
    maxLat: Math.min(maxLat, 90),
    minLng: Math.max(minLng, -180),
    maxLng: Math.min(maxLng, 180)
  };
};

module.exports = {
  geocodeAddress,
  reverseGeocode,
  calculateDeliveryFee,
  findNearbyLocations,
  calculateOptimalRoute,
  getDistanceMatrix,
  isValidCoordinates,
  calculateBoundingBox
};