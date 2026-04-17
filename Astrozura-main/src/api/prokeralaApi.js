import api from './axios';

export const getDailyHoroscope = async (sign, day = 'today') => {
  try {
    const response = await api.get(`/prokerala/horoscope/${sign}`, {
      params: { day }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching daily horoscope:", error);
    throw error;
  }
};

export const generateKundli = async (datetime, coordinates, ayanamsa = 1, options = {}) => {
  try {
    const response = await api.post(`/prokerala/kundli`, {
      datetime,
      coordinates,
      ayanamsa,
      ...options
    });
    return response.data;
  } catch (error) {
    console.error("Error generating kundli:", error);
    throw error;
  }
};

export const searchLocation = async (query) => {
  try {
    const response = await api.get(`/prokerala/location/search`, {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error("Error searching location:", error);
    throw error;
  }
};

export const getMarriageMatching = async (girl_coordinates, girl_dob, boy_coordinates, boy_dob) => {
  try {
    const response = await api.post(`/prokerala/matching`, {
      girl_coordinates,
      girl_dob,
      boy_coordinates,
      boy_dob
    });
    return response.data;
  } catch (error) {
    console.error("Error generating marriage matching:", error);
    throw error;
  }
};

export const getPanchang = async (datetime, coordinates, ayanamsa = 1) => {
  try {
    const response = await api.post(`/prokerala/panchang`, {
      datetime,
      coordinates,
      ayanamsa
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching panchang:", error);
    throw error;
  }
};

export const downloadFreeKundliPdf = async (payload) => {
  try {
    const response = await api.post('/prokerala/kundli/free-pdf', payload, {
      responseType: 'blob'
    });
    return response;
  } catch (error) {
    console.error("Error downloading free kundli PDF:", error);
    throw error;
  }
};

export const getDivisionalCharts = async (datetime, coordinates, chartType, chartStyle = 'north-indian') => {
  try {
    const response = await api.post('/prokerala/divisional-charts', { datetime, coordinates, chart_type: chartType, chart_style: chartStyle });
    return response.data;
  } catch (error) {
    console.error("Error fetching divisional charts:", error);
    throw error;
  }
};

export const getPredictions = async (datetime, coordinates, type) => {
  try {
    const response = await api.post('/prokerala/predictions', { datetime, coordinates, type });
    return response.data;
  } catch (error) {
    console.error("Error fetching predictions:", error);
    throw error;
  }
};

export const getNumerologyReport = async (datetime, name) => {
  try {
    const response = await api.post('/prokerala/numerology', { datetime, name });
    return response.data;
  } catch (error) {
    console.error("Error fetching numerology report:", error);
    throw error;
  }
};

export const getSadesatiReport = async (datetime, coordinates) => {
  try {
    const response = await api.post('/prokerala/sadesati', { datetime, coordinates });
    return response.data;
  } catch (error) {
    console.error("Error fetching sadesati report:", error);
    throw error;
  }
};

export const getLalKitabReport = async (datetime, coordinates) => {
  try {
    const response = await api.post('/prokerala/lal-kitab', { datetime, coordinates });
    return response.data;
  } catch (error) {
    console.error("Error fetching lal kitab report:", error);
    throw error;
  }
};
