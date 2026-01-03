import React from "react";
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Contexts/AuthContext";
import { API_ENDPOINTS } from "../config/api";
import "../Styles/Bookwindow.css";
const BookWindow = () => {
  const {
    BookClick,
    setBookClick,
    Flight,
    CreateToast,
    fetchUpdateProfile,
  } =
    useContext(AuthContext);

  const formatDate = (value) => {
    if (!value) return "TBD";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "TBD";
    return parsed.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (value) => {
    if (!value) return "";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  async function fetchAddUserFlight(ticketnb, uid, fid) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINTS.ADD_USER_FLIGHT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tickets: ticketnb,
          uid: uid,
          fid: fid,
        }),
      });

      const FlightData = await response.json();
      console.log(FlightData.data);

      if (response.ok && FlightData?.data) {
        return FlightData.data;
      }
      return null;
    } catch (error) {
      console.error("Error booking flight:", error);
      return null;
    }
  }

  const [Count, setCount] = useState(0);
  const [Count2, setCount2] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (BookClick) {
      setTimeout(() => {
        refDiv.current.scrollIntoView({ behavior: "smooth" });
      }, 200);
      document.body.classList.add("disable-scroll");
    } else {
      document.body.classList.remove("disable-scroll");
    }
  }, [BookClick]);

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Fake payment validation - just check if fields are filled
    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardName) {
      CreateToast("Please fill in all payment details");
      return;
    }
    // Simulate payment processing
    setShowPayment(false);
    handleOnCLickBook();
  };

  const handleOnCLickBook = async () => {
    try {
      if (Count <= 0) {
        CreateToast("Please select at least one ticket before booking.");
        return;
      }

      const result = await fetchAddUserFlight(
        Count,
        localStorage.getItem("id"),
        sessionStorage.getItem("flightid")
      );
      console.log(result);
      if (result) {
        const ticketsToBook = Count;
        const priceToAdd = Number(Flight.price) * ticketsToBook;
        setCount(0);
        setCount2(0);
        setPaymentData({
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          cardName: ''
        });
        await fetchUpdateProfile(
          ticketsToBook,
          0,
          0,
          priceToAdd
        );
        setBookClick(false);
        const earnedPoints = Number(result.pointsEarned || 0);
        if (earnedPoints > 0) {
          const totalPoints = Number(result.totalJetPoints || 0);
          CreateToast(
            `Flight booked! You earned ${earnedPoints.toLocaleString()} JetPoints. Balance: ${totalPoints.toLocaleString()}`
          );
        } else {
          CreateToast("You successfully booked a flight");
        }
      } else {
        setBookClick(false);
        CreateToast("There was an error. Please try again later.");
      }
    } catch (error) {}
  };

  const refDiv = useRef(null);

  const totalPrice = Count > 0 ? Number(Flight.price) * Count : 0;

  return (
    <>
      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70">
          <div className="bg-custom-dashboard rounded-2xl p-8 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold text-white mb-6">Payment Details</h2>
            <div className="mb-4 p-4 bg-slate-800/50 rounded-lg">
              <p className="text-slate-300 text-sm mb-2">Flight Summary</p>
              <p className="text-white font-semibold">{Flight.departureLocation} → {Flight.arrivalLocation}</p>
              <p className="text-slate-400 text-sm mt-1">{Count} ticket(s) × ${Flight.price}</p>
              <p className="text-white text-xl font-bold mt-2">Total: ${totalPrice.toFixed(2)}</p>
            </div>
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-white text-sm mb-2">Cardholder Name</label>
                <input
                  type="text"
                  value={paymentData.cardName}
                  onChange={(e) => setPaymentData({...paymentData, cardName: e.target.value})}
                  className="w-full p-3 bg-custom-input rounded-lg text-white"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-white text-sm mb-2">Card Number</label>
                <input
                  type="text"
                  value={paymentData.cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                    setPaymentData({...paymentData, cardNumber: formatted.slice(0, 19)});
                  }}
                  className="w-full p-3 bg-custom-input rounded-lg text-white"
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm mb-2">Expiry Date</label>
                  <input
                    type="text"
                    value={paymentData.expiryDate}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                      }
                      setPaymentData({...paymentData, expiryDate: value.slice(0, 5)});
                    }}
                    className="w-full p-3 bg-custom-input rounded-lg text-white"
                    placeholder="MM/YY"
                    maxLength="5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-sm mb-2">CVV</label>
                  <input
                    type="text"
                    value={paymentData.cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                      setPaymentData({...paymentData, cvv: value});
                    }}
                    className="w-full p-3 bg-custom-input rounded-lg text-white"
                    placeholder="123"
                    maxLength="3"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPayment(false)}
                  className="flex-1 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg bg-red-800 hover:bg-red-700 text-white transition"
                >
                  Pay ${totalPrice.toFixed(2)}
                </button>
              </div>
              <p className="text-xs text-slate-400 text-center mt-4">
                This is a demo payment. No real charges will be made.
              </p>
            </form>
          </div>
        </div>
      )}

      {BookClick && (
        <section className="inset-0 z-[1000] fixed flex flex-col justify-center items-center bg-black/50 ">
          <div className=" w-[1300px]  h-76 rounded-2xl bg-custom-dashboard">
            <div className="w-full h-full flex flex-col items-start justify-center p-6 rounded-2xl gap-6 bg-custom-dashboard ">
              <div className=" w-full pr-4 pl-4 gap-6 bg-custom-input text-white rounded-2xl flex flex-col lg:flex-row lg:items-center pt-6 pb-6 justify-between">
                <div className="flex flex-col justify-center items-center">
                  <p className="text-sm">Departing From:</p>
                  <p className="font-bold text-xl">
                    {Flight.departureLocation}
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <p className="text-xs uppercase tracking-[0.3em] text-Custom-Nav">
                    Airline
                  </p>
                  <p className="text-lg font-semibold">
                    {Flight.airlineName || ""}
                  </p>
                  {Flight.co2ReductionPercent ? (
                    <p className="text-xs text-emerald-300 mt-1">
                      Emits {Flight.co2ReductionPercent}% less CO₂
                    </p>
                  ) : (
                    <p className="text-xs text-Custom-Nav mt-1">Standard CO₂ output</p>
                  )}
                </div>
                <div className="flex flex-col w-48 h-auto justify-center items-center text-center">
                  <p className="font-semibold">{Flight.flightType}</p>
                  <p className=" text-Custom-Nav text-sm">
                    {formatDate(Flight.departureDateTime)}
                  </p>
                  <p className="text-xs text-Custom-Nav">{formatTime(Flight.departureDateTime)}</p>
                  <p>{Flight.roundTrip}</p>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <p className="text-sm">Arriving At:</p>
                  <p className="font-bold text-xl">{Flight.arrivalLocation}</p>
                  <p className="text-sm">{Flight.continent}</p>
                </div>
                {Flight.roundTrip?.toLowerCase().includes("round") && (
                  <div className="flex flex-col justify-center items-center text-center w-60 bg-black/20 rounded-xl p-3 border border-white/10">
                    <p className="text-xs uppercase tracking-[0.3em] text-Custom-Nav">
                      Return flight
                    </p>
                    <p className="text-sm mt-1">
                      {Flight.arrivalLocation || "Destination"} ➜{" "}
                      {Flight.departureLocation || "Origin"}
                    </p>
                    <p className="font-semibold">
                      {formatDate(Flight.returnDepartureDateTime)}
                    </p>
                    <p className="text-xs text-Custom-Nav">
                      {formatTime(Flight.returnDepartureDateTime)}
                    </p>
                  </div>
                )}
                <div className="flex flex-col items-center justify-center ">
                  <p>Price</p>
                  <p>${Flight.price}</p>
                </div>
              </div>
              <div></div>
              <div className="flex gap-7 items-start justify-center">
                <div className=" gap-5 flex ">
                  <div className="flex flex-col gap-1 relative">
                    <label
                      htmlFor=""
                      className="text-white text-base font-semibold"
                    >
                      Tickets
                    </label>
                    <input
                      className=" w-40 h-10  z-50 rounded-lg pl-2 cursor-default bg-custom-input text-white "
                      type="number"
                      value={Count}
                      readOnly
                    />
                    <p
                      onClick={() => setCount(Count + 1)}
                      className="absolute top-9 right-10 cursor-pointer text-white text-xl  z-[60]"
                    >
                      +
                    </p>
                    <p
                      onClick={() => {
                        if (Count <= 0) {
                          setCount(0);
                        } else {
                          setCount(Count - 1);
                        }
                      }}
                      className="absolute  top-9 right-4 cursor-pointer text-white text-xl  z-[60]"
                    >
                      -
                    </p>
                  </div>
                  <div className="flex flex-col justify-center relative">
                    <label
                      htmlFor=""
                      className="text-white text-base font-semibold"
                    >
                      Children (if any)
                    </label>
                    <input
                      className=" w-40 h-10  rounded-lg pl-2  bg-custom-input text-white "
                      type="number"
                      value={Count2}
                    />
                    <p
                      onClick={() => setCount2(Count2 + 1)}
                      className="absolute top-8 right-10 cursor-pointer text-white text-xl  z-30"
                    >
                      +
                    </p>
                    <p
                      onClick={() => {
                        if (Count2 <= 0) {
                          setCount2(0);
                        } else {
                          setCount2(Count2 - 1);
                        }
                      }}
                      className="absolute top-8  cursor-pointer text-white text-2xl right-4 z-30"
                    >
                      -
                    </p>
                  </div>
                </div>
              </div>
              <div className=" flex gap-5 ">
                {" "}
                <button
                  onClick={() => {
                    sessionStorage.clear("flightid");
                    setBookClick(false);
                  }}
                  className=" w-32 h-10 rounded-2xl hover:bg-custom-input hover:text-white transition-all delay-100 ease-in-out bg-white text-custom-input z-20"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (localStorage.getItem("isLoggedIn")) {
                      if (Count <= 0) {
                        CreateToast("Please select at least one ticket before booking.");
                        return;
                      }
                      setShowPayment(true);
                    } else {
                      setBookClick(false);
                      CreateToast(
                        "You need to be logged in to use this feature"
                      );
                    }
                  }}
                  className=" w-32 h-10 rounded-2xl hover:bg-custom-input hover:text-white transition-all delay-100 ease-in-out bg-white text-custom-input z-20"
                >
                  Book now
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
export default BookWindow;
