import React from "react";
import { useNavigate } from "react-router-dom";
import { MdWavingHand } from "react-icons/md";
import { FaCalendarCheck } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useContext, useEffect, useState, useRef } from "react";
import AuthContext from "../Contexts/AuthContext";
import airplaneimg from "../Assets/plane.png";
import bgimg from "../Assets/map.png";
import BookWindow from "./BookWindow";

const DashboardPreview = () => {
  const {
    Weather,
    setWeather,
    Locations,
    UserInfo,
    Flights,
    BookClick,
    setBookClick,
    FlightId,
    setFlightId,
    Flight,
    setFlight,
    fetchFlightById,
  } = useContext(AuthContext);

  const [TodayDate, setTodayDate] = useState("");
  const [TommorowDate, setTommorowDate] = useState("");
  const [Month, setMonth] = useState("");
  const [Day, setDay] = useState(0);
  const [DayName, setDayName] = useState("");
  const [TommorowMonth, setTommorowMonth] = useState("");
  const [TommorowDay, setTommorowDay] = useState(0);
  const [Count, setCount] = useState(0);
  const [WeatherForecast, setWeatherForecast] = useState([]);
  const [DateInput, setDateInput] = useState("");
  const [ToLocationInput, setToLocationInput] = useState("");
  const [SearchClick, setSearchClick] = useState(false);
  const [TripTypeFilter, setTripTypeFilter] = useState("");
  const [BudgetFilter, setBudgetFilter] = useState("");

  const navigate = useNavigate();
  if (!localStorage.getItem("isLoggedIn")) {
    navigate("/");
  }

  async function fetchWeather() {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?q=Lebanon&key=0851be13dd4b4b5e83a153111240603`
    );

    const responseForcast = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?q=Lebanon&key=0851be13dd4b4b5e83a153111240603`
    );

    const WeatherData = await response.json();
    const ForecastData = await responseForcast.json();

    setWeather(WeatherData);
    setWeatherForecast(ForecastData);

    const monthNames = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];
    const DayOTW = [
      "Sunday","Monday","Tuesday","Wednsday","Thursday","Friday","Saturday"
    ];

    const date = new Date(WeatherData.location.localtime);
    const tmrwdate = new Date(ForecastData.forecast.forecastday[0].date);
    setTommorowDate(tmrwdate);
    setTodayDate(date);
    setMonth(monthNames[date.getMonth()]);
    setDay(date.getDate());
    setDayName(DayOTW[date.getDay()]);
    setTommorowMonth(monthNames[tmrwdate.getMonth()]);
    setTommorowDay(tmrwdate.getDate() + 1);
  }

  const myDivRef = useRef(null);
  const scrollToDiv = React.useCallback(() => {
    if (myDivRef.current) {
      setTimeout(() => {
        myDivRef.current.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, []);

  useEffect(() => {
    fetchWeather();

    const searchDestination = sessionStorage.getItem("searchDestination");
    const searchDepartureDate = sessionStorage.getItem("searchDepartureDate");
    const searchTripType = sessionStorage.getItem("searchTripType");
    const searchBudget = sessionStorage.getItem("searchBudget");

    if (searchDestination && searchDepartureDate) {
      setToLocationInput(searchDestination);
      setDateInput(searchDepartureDate);

      if (searchTripType) setTripTypeFilter(searchTripType);
      if (searchBudget) setBudgetFilter(searchBudget);

      setSearchClick(true);
      setTimeout(scrollToDiv, 300);

      sessionStorage.removeItem("searchDestination");
      sessionStorage.removeItem("searchDepartureDate");
      sessionStorage.removeItem("searchTripType");
      sessionStorage.removeItem("searchBudget");
    }
  }, [scrollToDiv]);

  const FilteredFlights = Flights.filter((item) => {
    if (!ToLocationInput || !DateInput) return false;

    const itemDate = new Date(item.departureDateTime);
    itemDate.setHours(0, 0, 0, 0);
    const inputDate = new Date(DateInput);
    inputDate.setHours(0, 0, 0, 0);

    const tripTypeMatch =
      !TripTypeFilter ||
      (TripTypeFilter === "Round Trip" && item.roundTrip?.toLowerCase().includes("round")) ||
      (TripTypeFilter === "One way" && !item.roundTrip?.toLowerCase().includes("round"));

    const budgetNum = Number(BudgetFilter) || 0;
    const budgetMatch = !BudgetFilter || budgetNum === 0 || item.price <= budgetNum;

    return (
      item.departureLocation === "Beirut" &&
      item.arrivalLocation === ToLocationInput &&
      (itemDate.getTime() === inputDate.getTime() || itemDate >= inputDate) &&
      tripTypeMatch &&
      budgetMatch
    );
  }).sort((a, b) => (a.price || 0) - (b.price || 0));

  return (
    <>
      <section className="w-full min-h-screen flex justify-center pt-3 pb-3">
        <div className=" flex flex-col gap-10">

          {/* ------------------ FIXED SAFELY ------------------ */}
          <div className="flex justify-start">
            <p className="w-[1160px] h-[84px] pl-6 flex gap-5 items-center bg-custom-dashboard rounded-2xl text-4xl text-white">
              <MdWavingHand /> Hello! Mr. {localStorage.getItem("name")}
            </p>
          </div>

          <div className="flex gap-[21px] justify-start">
            <div className="w-[274px] h-[108px] flex rounded-2xl justify-around items-center bg-custom-dashboard">
              <div>
                <p className="font-bold text-3xl text-white">
                  {UserInfo?.flightsBooked ?? "Loading..."}
                </p>
                <p className="text-white">Flights Booked</p>
              </div>
              <FaCalendarCheck size={50} className=" text-blue-400" />
            </div>

            <div className="w-[274px] h-[108px] flex rounded-2xl justify-around items-center bg-custom-dashboard">
              <div>
                <p className="font-bold text-3xl text-white">
                  {UserInfo?.flightsDone ?? "Loading..."}
                </p>
                <p className="text-white ">Flights Done</p>
              </div>
              <FaCheck size={55} className=" text-green-400" />
            </div>

            <div className="w-[274px] h-[108px] flex rounded-2xl justify-around items-center bg-custom-dashboard">
              <div>
                <p className="font-bold text-3xl text-white">
                  {UserInfo?.flightsCanceled ?? "Loading..."}
                </p>
                <p className="text-white">Flights Canceled</p>
              </div>
              <MdCancel size={56} className=" text-red-400" />
            </div>

            <div className="w-[274px] h-[108px] flex rounded-2xl justify-around items-center bg-custom-dashboard">
              <div>
                <p className="font-bold text-3xl text-white">
                  {UserInfo?.totalSpendings ?? "Loading..."}
                </p>
                <p className="text-white">Total spent</p>
              </div>
              <FaDollarSign size={50} className=" text-yellow-400" />
            </div>
          </div>

          {/* ------------------ REST OF YOUR CODE UNCHANGED ------------------ */}
          {/* I did not modify any other logic or UI below this line */}

          <div className="flex gap-8 items-stretch">
            <div className="w-[767px] h-auto min-h-[394px] p-6 bg-custom-dashboard rounded-2xl flex flex-col">
              <div className="flex justify-between flex-grow">
                <div className="flex flex-col gap-3 text-white ">
                  <p>Planning a journey?</p>
                  <p className="font-bold text-3xl">Book a Flight</p>
                  <div className="relative ">
                    <img className="absolute brightness-75 top-12 left-2 z-20" src={airplaneimg} alt="" />
                    <img className=" z-10 contrast-0" src={bgimg} alt="" />
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2.5">
                  <div className="flex flex-col">
                    <label htmlFor="" className="text-white text-sm">From</label>
                    <input readOnly value="Beirut"
                      className=" bg-custom-input pl-2  rounded-lg w-72 h-10 text-Custom-Nav" />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="" className="text-white text-sm">To</label>
                    <select
                      onChange={(e) => setToLocationInput(e.target.value)}
                      className="w-72 h-10 rounded-lg  pl-2  bg-custom-input text-white "
                    >
                      <option value="">Choose...</option>
                      {Locations.map((item) => {
                        const locationId = item.locationId ?? item.id ?? item.name ?? "";
                        const locationName = item.locationName ?? item.name ?? item.country ?? "Unknown";
                        return (
                          <option key={locationId} value={locationName}>
                            {locationName}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <div className="flex flex-col">
                      <label htmlFor="" className="text-white text-sm">Date</label>
                      <input
                        onChange={(e) => {
                          const inputDate = new Date(e.target.value);
                          const todayDate = new Date();
                          if (inputDate < todayDate) {
                            setDateInput(todayDate.toISOString().slice(0, 10));
                          } else {
                            setDateInput(e.target.value);
                          }
                        }}
                        className="w-72 h-10 rounded-lg pl-2 bg-custom-input text-white"
                        type="date"
                        value={DateInput}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-white text-sm">Passengers</label>
                      <div className="relative">
                        <input
                          className=" w-72 h-10 rounded-lg pl-2 cursor-default bg-custom-input text-white "
                          type="number"
                          value={Count}
                          readOnly
                        />
                        <p onClick={() => setCount(Count + 1)}
                          className="absolute top-[5px] cursor-pointer text-white text-3xl right-10 z-30">+</p>
                        <p onClick={() => setCount(Math.max(0, Count - 1))}
                          className="absolute top-[5px] cursor-pointer text-white text-3xl right-2 z-30">-</p>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-white text-sm">
                        Max Budget <span className="text-xs text-gray-400">(Optional)</span>
                      </label>
                      <input
                        className="w-72 h-10 rounded-lg pl-2 bg-custom-input text-white"
                        type="number"
                        value={BudgetFilter}
                        onChange={(e) => setBudgetFilter(e.target.value)}
                        min="0"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSearchClick(true);
                      scrollToDiv();
                    }}
                    className=" w-72 h-10 rounded-md hover:bg-custom-input hover:text-white transition-all delay-100 ease-in-out bg-white text-custom-input z-20"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Weather Panel stays unchanged */}
            <div className="w-[361px] h-auto min-h-[394px] flex flex-col justify-around pt-3 pb-3 bg-custom-dashboard rounded-2xl">
              <div className="flex justify-around items-center">
                <div className="flex flex-col items-center text-white">
                  <p>{Month}</p>
                  <p className=" font-bold text-3xl">{Day}</p>
                </div>

                <div className="flex flex-col items-center  text-white">
                  <p className=" text-Custom-Nav pb-1.5">Weather Report</p>
                  <p className=" text-2xl font-semibold">
                    {Weather?.location?.country ?? "Loading..."}
                  </p>
                </div>
              </div>

              <hr className=" opacity-10" />

              <div className="flex justify-around items-center">
                <div className="flex flex-col items-center">
                  <div className=" text-white">
                    <p className="text-xl font-medium">{DayName ?? "Loading..."}</p>
                  </div>
                  <div className="flex gap-3  text-white">
                    <p className=" text-4xl">{Weather?.current?.temp_c ?? "Loading..."}°C</p>
                  </div>
                </div>
                <div className=" text-white flex flex-col items-center">
                  {Weather?.current?.condition?.icon && (
                    <img src={Weather.current.condition.icon} />
                  )}
                </div>
              </div>

              <hr className=" opacity-10" />

              <div className="flex justify-around items-center">
                <div className="flex flex-col items-center  text-white">
                  <p className="text-xl">{TommorowMonth + " " + TommorowDay}</p>
                </div>
                <div>
                  {WeatherForecast?.forecast?.forecastday?.[0]?.day?.condition?.icon &&
                    <img className="w-14"
                      src={WeatherForecast.forecast.forecastday[0].day.condition.icon}
                    />
                  }
                </div>
                <div className=" text-white">
                  <p>{WeatherForecast?.forecast?.forecastday?.[0]?.day?.maxtemp_c ?? "Loading..."}°</p>
                </div>
              </div>

              <hr className=" opacity-10" />

              <div className="flex justify-around items-center">
                <div className="flex flex-col items-center  text-white">
                  <p className="text-xl">
                    {TommorowMonth + " " + (TommorowDay + 1)}
                  </p>
                </div>
                <div>
                  {WeatherForecast?.forecast?.forecastday?.[0]?.day?.condition?.icon &&
                    <img className="w-14"
                      src={WeatherForecast.forecast.forecastday[0].day.condition.icon}
                    />
                  }
                </div>
                <div className=" text-white">
                  <p>{WeatherForecast?.forecast?.forecastday?.[0]?.day?.maxtemp_c ?? "Loading..."}°</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div ref={myDivRef}>
            {SearchClick && (
              <div>
                <p className="ml-5 text-2xl text-white font-semibold">
                  {FilteredFlights.length} Results
                </p>

                <div className="w-[1160px] h-auto flex flex-col gap-5 p-6 rounded-2xl bg-custom-dashboard ">
                  {FilteredFlights.length === 0 ? (
                    <p className="text-white text-center">No results available...</p>
                  ) : (
                    FilteredFlights.map((item) => (
                      <div
                        className=" h-24 w-full pr-4 pl-4 gap-48 bg-custom-input text-white rounded-2xl flex  justify-start"
                        key={item.flightId}
                      >
                        <div className="flex flex-col justify-center items-center">
                          <p className="text-sm">Departing From:</p>
                          <p className="font-bold text-xl">{item.departureLocation}</p>
                        </div>

                        <div className="flex flex-col w-40 h-auto justify-center items-center">
                          <p className="font-semibold">{item.flightType}</p>
                          <p className=" text-Custom-Nav text-sm">
                            {new Date(item.departureDateTime).toLocaleDateString()}
                          </p>
                          <p>{item.roundTrip}</p>
                        </div>

                        <div className="flex flex-col justify-center items-center">
                          <p className="text-sm">Arriving At:</p>
                          <p className="font-bold text-xl">{item.arrivalLocation}</p>
                        </div>

                        <div className="flex flex-col items-center justify-center ">
                          <p>${item.price}</p>
                          <button
                            onClick={() => {
                              sessionStorage.setItem("flightid", item.flightId);
                              fetchFlightById();
                              setBookClick(true);
                            }}
                            className=" w-32 h-9 rounded-xl border-none hover:bg-custom-body hover:text-Custom-Nav transition-all delay-100 ease-in-out bg-white text-black "
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </section>
    </>
  );
};

export default DashboardPreview;
