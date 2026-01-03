const API_BASE_URL = "http://localhost:3001/api";

export const API_ENDPOINTS = {
  // AUTH
  LOGIN: `${API_BASE_URL}/Login/login`,
  REGISTER: `${API_BASE_URL}/Login/register`,
  LOGOUT: `${API_BASE_URL}/Login/logout`,
  GET_NAME: `${API_BASE_URL}/Login/get-name`,
  GET_ID: `${API_BASE_URL}/Login/get-id`,
  GET_USER_BY_ID: (id) =>
    `${API_BASE_URL}/Login/get-user-by-id/${id}`,
  UPDATE_USER: `${API_BASE_URL}/Login/update-user`,
  UPDATE_FULL_USER: `${API_BASE_URL}/Login/update-full-user`,

  // FLIGHTS
  GET_ALL_FLIGHTS: `${API_BASE_URL}/Flight/get-all-flights`,
  GET_FLIGHT_BY_ID: (id) =>
    `${API_BASE_URL}/Flight/get-flight-by-id/${id}`,

  // USER FLIGHTS
  GET_USER_FLIGHTS_BY_ID: (id) =>
    `${API_BASE_URL}/UserFlights/get-all-user-flights-by-id/${id}`,
  ADD_USER_FLIGHT: `${API_BASE_URL}/UserFlights/add-user-flight`,
  REMOVE_USER_FLIGHT: `${API_BASE_URL}/UserFlights/remove-user-flight-by-id`,

  // REVIEWS
  GET_ALL_REVIEWS: `${API_BASE_URL}/Review/get-all-reviews`,
  ADD_REVIEW: `${API_BASE_URL}/Review/add-review`,

  // LOCATIONS
  GET_ALL_LOCATIONS: `${API_BASE_URL}/Location/get-all-locations`,

  // ADMIN
  ADMIN_GET_FLIGHTS: `${API_BASE_URL}/flights`,
  ADMIN_ADD_FLIGHT: `${API_BASE_URL}/flights`,
  ADMIN_DELETE_FLIGHT: (id) =>
    `${API_BASE_URL}/flights/${id}`,
  ADMIN_GET_ALL_USERS: `${API_BASE_URL}/Admin/get-all-users`,
  ADMIN_CREATE_USER: `${API_BASE_URL}/Admin/create-user`,
  ADMIN_UPDATE_USER_ADMIN: `${API_BASE_URL}/Admin/update-user-admin`,
  ADMIN_DELETE_USER: (id) =>
    `${API_BASE_URL}/Admin/delete-user/${id}`,
  ADMIN_UPLOAD_IMAGE: `${API_BASE_URL}/Admin/upload-image`,

  // SUPPORT
  ADD_SUPPORT_MESSAGE: `${API_BASE_URL}/Support/add-message`,
  GET_ALL_SUPPORT_MESSAGES: `${API_BASE_URL}/Support/get-all-messages`,
  UPDATE_SUPPORT_MESSAGE: `${API_BASE_URL}/Support/update-message`,
  DELETE_SUPPORT_MESSAGE: (id) =>
    `${API_BASE_URL}/Support/delete-message/${id}`,
};

export default API_BASE_URL;
