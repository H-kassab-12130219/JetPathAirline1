import React from "react";
import ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import HomePage from "./src/Pages/HomePage";
import Login from "./src/Components/Login";
import Logout from "./src/Components/Logout";
import Register from "./src/Components/Register";
import "./src/Assets/index.css";
import AuthContext from "./src/Contexts/AuthContext";
import BookWindow from "./src/Components/BookWindow";
import { Toaster } from "react-hot-toast";
import Dashboard from "./src/Pages/Dashboard";
import NavBar from "./src/Components/NavBar";
import Profile from "./src/Pages/Profile";
import Destinations from "./src/Pages/Destinations";
import Asia from "./src/Pages/Asia";
import Africa from "./src/Pages/Africa";
import Europe from "./src/Pages/Europe";
import America from "./src/Pages/America";
import Help from "./src/Pages/Help";
import Loyalty from "./src/Pages/Loyalty";
import Admin from "./src/Pages/Admin";
import ProtectedAdminRoute from "./src/Components/ProtectedAdminRoute";
import { API_ENDPOINTS } from "./src/config/api";

const App = () => {
  const [Flights, setFlights] = useState([]);
  const [Locations, setLocations] = useState([]);
  const [Reviews, setReviews] = useState([]);
  const [LoginWindow, setLoginWindow] = useState(false);
  const [LogoutWindow, setLogoutWindow] = useState(false);
  const [RegisterWindow, setRegisterWindow] = useState(false);
  const [ProfileWindow, setProfileWindow] = useState(false);
  const [PasswordError, setPasswordError] = useState(false);
  const [PasswordInvalid, setPasswordInvalid] = useState(false);
  const [UserInfo, setUserInfo] = useState([]);
  const [FirstN, setFirstN] = useState(false);
  const [LastN, setLastN] = useState(false);
  const [Error, setError] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [Weather, setWeather] = useState([]);
  const [BookClick, setBookClick] = useState(false);
  const [FlightId, setFlightId] = useState("");
  const [Flight, setFlight] = useState([]);
  const [EditProfileClick, setEditProfileClick] = useState(false);
  const [userFlights, setuserFlights] = useState([]);
  const [UserObj, setUserObj] = useState({
    email: "",
    password: "",
  });
  const [RUserObj, setRUserObj] = useState({
    email: "",
    password: "",
    Firstname: "",
    Lastname: "",
  });
  async function fetchReviews() {
    try {
      const response = await fetch(API_ENDPOINTS.GET_ALL_REVIEWS);
      const ReviewsData = await response.json();
      setReviews(ReviewsData.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }

  function CreateToast(Message) {
    toast((t) => {
      return <span className="">{Message}</span>;
    });

    return null;
  }

  async function fetchUserbyId() {
    try {
      const response = await fetch(
        API_ENDPOINTS.GET_USER_BY_ID(localStorage.getItem("id")),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const userData = await response.json();
      if (userData != null) {
        setUserInfo(userData.data);
      } else {
        console.log("Error name");
      }
    } catch (error) {
      console.error("Error fetching user by id:", error);
    }
  }

  async function fetchName() {
    try {
      const response = await fetch(API_ENDPOINTS.GET_NAME, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const nameData = await response.json();
      if (nameData != null) {
        localStorage.setItem("name", nameData.data);
      } else {
        console.log("Error name");
      }
    } catch (error) {
      console.error("Error fetching name:", error);
    }
  }

  async function fetchId() {
    try {
      const response = await fetch(API_ENDPOINTS.GET_ID, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const IdData = await response.json();

      if (IdData != null) {
        localStorage.setItem("id", IdData.data);
      } else {
        console.log("Error name");
      }
    } catch (error) {
      console.error("Error fetching id:", error);
    }
  }

  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await fetch(API_ENDPOINTS.GET_ALL_LOCATIONS, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const LocationData = await response.json();
        setLocations(LocationData.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    }
    fetchReviews();
    fetchUserbyId();
    fetchAllFlightsById();
    fetchFlights();
    fetchLocations();
  }, []);

  async function fetchFlights() {
    try {
      const response = await fetch(API_ENDPOINTS.GET_ALL_FLIGHTS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const FlightData = await response.json();
      setFlights(FlightData.data);
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  }

  async function fetchRegister() {
    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: RUserObj.email.toLowerCase(),
          password: RUserObj.password,
          firstName: RUserObj.firstName,
          lastName: RUserObj.lastName,
          patronymic: RUserObj.patronymic || null,
          birthday: RUserObj.birthday || null,
          gender: RUserObj.gender || null,
          employmentStatus: RUserObj.employmentStatus || null,
          workingSince: RUserObj.workingSince || null,
          position: RUserObj.position || null,
        }),
      });
      const RegisterData = await response.json();
      if (RegisterData.data != null) {
        setPasswordError(false);
        setError(false);
        setRegisterWindow(false);
        CreateToast("You registered successfully...");
      } else {
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  async function fetchLogin() {
    setisLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: UserObj.email.toLowerCase(),
          password: UserObj.password,
        }),
      });
      const LoginData = await response.json();
      if (LoginData.data != null) {
        localStorage.setItem("token", LoginData.data);
        localStorage.setItem("isLoggedIn", true);
        await fetchName();
        await fetchId();
        // Fetch user info to check if admin
        const userResponse = await fetch(
          API_ENDPOINTS.GET_USER_BY_ID(localStorage.getItem("id")),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${LoginData.data}`,
            },
          }
        );
        const userData = await userResponse.json();
        if (userData?.data) {
          setUserInfo(userData.data);
          setPasswordError(false);
          setError(false);
          setLoginWindow(false);
          CreateToast(
            `Welcome back ${localStorage.getItem("name")} long time no see`
          );
          
          // Redirect admin to admin page
          if (userData.data.isAdmin) {
            window.location.href = '/admin';
          }
        } else {
          setPasswordError(false);
          setError(false);
          setLoginWindow(false);
          CreateToast(
            `Welcome back ${localStorage.getItem("name")} long time no see`
          );
        }
      } else {
        setPasswordError(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setisLoading(false);
    }
  }

  async function fetchUpdateFullUserById(firstname, lastname, email, patronymic, birthday, gender, employmentStatus, workingSince, position, currentPassword, newPassword) {
    try {
      const response = await fetch(API_ENDPOINTS.UPDATE_FULL_USER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: localStorage.getItem("id"),
          username: firstname + " " + lastname,
          email: email,
          firstName: firstname,
          lastName: lastname,
          patronymic: patronymic || null,
          birthday: birthday || null,
          gender: gender || null,
          employmentStatus: employmentStatus || null,
          workingSince: workingSince || null,
          position: position || null,
          currentPassword: currentPassword || null,
          newPassword: newPassword || null,
        }),
      });
      const UpdatedData = await response.json();
      console.log(UpdatedData.data);
      if (UpdatedData.data !== null) {
        if (newPassword) {
          CreateToast("Profile and password updated successfully");
        } else {
          CreateToast("You have successfully updated your profile");
        }
      } else {
        CreateToast(UpdatedData.message || "Error please try again later");
      }
    } catch (error) {
      console.log(error);
      CreateToast("Error updating profile. Please try again.");
    }
  }

  async function fetchUpdateProfile(ticketnb, fdone, fcancle, fprice) {
    try {
      const ticketDelta = Number(ticketnb) || 0;
      const doneDelta = Number(fdone) || 0;
      const cancelDelta = Number(fcancle) || 0;
      const priceDelta = Number(fprice) || 0;

      const currentFlightsBooked = UserInfo?.flightsBooked || 0;
      const currentFlightsDone = UserInfo?.flightsDone || 0;
      const currentFlightsCanceled = UserInfo?.flightsCanceled || 0;
      const currentTotalSpendings = UserInfo?.totalSpendings || 0;

      const updatedFlightsBooked = Math.max(currentFlightsBooked + ticketDelta, 0);
      const updatedFlightsDone = Math.max(currentFlightsDone + doneDelta, 0);
      const updatedFlightsCanceled = Math.max(currentFlightsCanceled + cancelDelta, 0);
      const updatedTotalSpendings = Math.max(currentTotalSpendings + priceDelta, 0);

      const response2 = await fetch(API_ENDPOINTS.UPDATE_USER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: localStorage.getItem("id"),
          flightsBookNumber: updatedFlightsBooked,
          flightsDoneNumber: updatedFlightsDone,
          flightsCanceledNumber: updatedFlightsCanceled,
          flightPrice: updatedTotalSpendings,
        }),
      });
      const updateUseResponse = await response2.json();
      if (updateUseResponse?.data) {
        setUserInfo(updateUseResponse.data);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }

  async function fetchAllFlightsById() {
    try {
      const response = await fetch(
        API_ENDPOINTS.GET_USER_FLIGHTS_BY_ID(localStorage.getItem("id")),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const FlightsData = await response.json();
      console.log(FlightsData.data);
      setuserFlights(FlightsData.data);
    } catch (error) {
      console.error("Error fetching user flights:", error);
    }
  }

  async function fetchRemoveFlightByFlightId(
    flightid,
    totalPrice,
    totalTickets,
    ticketsToCancel = 1
  ) {
    try {
      const ticketsToRemove = Math.max(Number(ticketsToCancel) || 1, 1);
      const response = await fetch(API_ENDPOINTS.REMOVE_USER_FLIGHT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: localStorage.getItem("id"),
          flightid: flightid,
          ticketsToRemove: ticketsToRemove,
        }),
      });
      const responsedata = await response.json();
      console.log(responsedata.data);
      if (responsedata?.data) {
        const pricePerTicket =
          Number(totalTickets) > 0 ? Number(totalPrice) / Number(totalTickets) : 0;
        const priceDelta = pricePerTicket * ticketsToRemove;
        // Calculate 10% refund
        const refundAmount = priceDelta * 0.1;
        // Update profile: subtract full price, then add back 10% refund
        // So net change is -90% of the price
        await fetchUpdateProfile(
          -ticketsToRemove,
          0,
          ticketsToRemove,
          -priceDelta + refundAmount
        );
        const { pointsDeducted = 0, totalJetPoints } = responsedata.data;
        const refundFormatted = refundAmount.toFixed(2);
        if (pointsDeducted > 0) {
          const totalFormatted = Number(totalJetPoints || 0).toLocaleString();
          CreateToast(
            `Flight canceled. ${pointsDeducted.toLocaleString()} JetPoints deducted. $${refundFormatted} refunded (10%). Balance: ${totalFormatted}`
          );
        } else {
          CreateToast(`Flight canceled. $${refundFormatted} refunded (10%).`);
        }
      }
    } catch (error) {
      console.error("Error removing flight:", error);
    }
  }


  async function fetchAddReview(msg, stars) {
    try {
      const response = await fetch(API_ENDPOINTS.ADD_REVIEW, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userid: localStorage.getItem("id"),
          userMessage: msg,
          stars: stars,
          username: localStorage.getItem("name"),
        }),
      });
    } catch (error) {
      console.error("Error adding review:", error);
    }
  }

  async function fetchFlightById() {
    try {
      console.log(FlightId);
      const response = await fetch(
        API_ENDPOINTS.GET_FLIGHT_BY_ID(sessionStorage.getItem("flightid")),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const FlightData = await response.json();
      setFlight(FlightData.data);
    } catch (error) {
      console.error("Error fetching flight by id:", error);
    }
  }

  return (
    <BrowserRouter>
      <AuthContext.Provider
        value={{
          Flights,
          Locations,
          Reviews,
          LoginWindow,
          setLoginWindow,
          fetchFlightById,
          UserObj,
          setUserObj,
          fetchLogin,
          LogoutWindow,
          setLogoutWindow,
          ProfileWindow,
          setProfileWindow,
          Error,
          setError,
          PasswordError,
          setPasswordError,
          RUserObj,
          setRUserObj,
          LastN,
          setLastN,
          FirstN,
          setFirstN,
          RegisterWindow,
          setRegisterWindow,
          PasswordInvalid,
          setPasswordInvalid,
          fetchRegister,
          isLoading,
          setisLoading,
          Weather,
          setWeather,
          UserInfo,
          setUserInfo,
          BookClick,
          setBookClick,
          FlightId,
          setFlightId,
          Flight,
          setFlight,
          fetchAddReview,
          CreateToast,
          fetchUpdateFullUserById,
          setEditProfileClick,
          EditProfileClick,
          userFlights,
          setuserFlights,
          fetchUpdateProfile,
          fetchRemoveFlightByFlightId,
        }}
      >
        <Toaster position="bottom-right" />
        <BookWindow />
        <Logout />
        <Register />
        <Login />
        {!UserInfo?.isAdmin && <NavBar />}
        <Routes>
          <Route index path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/asia" element={<Asia />} />
          <Route path="/destinations/africa" element={<Africa />} />
          <Route path="/destinations/europe" element={<Europe />} />
          <Route path="/destinations/america" element={<America />} />
          <Route path="/help" element={<Help />} />
          <Route path="/loyalty" element={<Loyalty />} />
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <Admin />
            </ProtectedAdminRoute>
          } />
        </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
