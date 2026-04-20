import api from "./axios";

export const getDailyHoroscope = async (sign, day = "today", la = "en") => {
  try {
    const response = await api.get(`/prokerala/horoscope/${sign}`, {
      params: { day, la }
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
      ...options,
    });
    return response.data;
  } catch (error) {
    console.error("Error generating kundli:", error);
    throw error;
  }
};

export const searchLocation = async (query, language = "en") => {
  try {
    const response = await api.get(`/prokerala/location/search`, {
      params: { q: query, language }
    });
    return response.data;
  } catch (error) {
    console.error("Error searching location:", error);
    throw error;
  }
};

export const getMarriageMatching = async (
  girl_coordinates,
  girl_dob,
  boy_coordinates,
  boy_dob,
  options = {}
) => {
  try {
    const response = await api.post(`/prokerala/matching`, {
      girl_coordinates,
      girl_dob,
      boy_coordinates,
      boy_dob,
      ...options,
    });
    return response.data;
  } catch (error) {
    console.error("Error generating marriage matching:", error);
    throw error;
  }
};

export const getPanchang = async (datetime, coordinates, ayanamsa = 1, options = {}) => {
  try {
    const response = await api.post(`/prokerala/panchang`, {
      datetime,
      coordinates,
      ayanamsa,
      ...options,
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
