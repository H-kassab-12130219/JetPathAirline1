import React, { createContext } from "react";

const AuthContext = createContext({

  // UI Windows
  LoginWindow: false,
  setLoginWindow: () => {},
  LogoutWindow: false,
  setLogoutWindow: () => {},
  RegisterWindow: false,
  setRegisterWindow: () => {},
  ProfileWindow: false,
  setProfileWindow: () => {},

  // User
  UserInfo: {
    id: null,
    name: "",
    email: "",
    flightsBooked: 0,
    flightsDone: 0,
    flightsCanceled: 0,
    totalSpendings: 0,
    tierLevel: "",
    jetPoints: 0,
  },
  setUserInfo: () => {},

  // Flights data
  Flights: [],
  setFlights: () => {},
  Flight: null,
  setFlight: () => {},
  FlightId: null,
  setFlightId: () => {},

  // Search/filter state
  BookClick: false,
  setBookClick: () => {},

  // Weather
  Weather: {
    location: null,
    current: null,
  },
  setWeather: () => {},

  WeatherForecast: null,
  setWeatherForecast: () => {},

  // Locations
  Locations: [],
  setLocations: () => {},

  // Functions
  fetchFlightById: () => {},
  fetchAllFlights: () => {},
  fetchUserInfo: () => {},
});

export default AuthContext;
