import React from "react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Contexts/AuthContext";
import { GoArrowSwitch } from "react-icons/go";
import { MdOutlineLocationCity } from "react-icons/md";
import { toast } from "react-hot-toast";
import { getImageUrl } from "../utils/imageHelper";

const Asia = () => {
  const { fetchFlightById, setBookClick, Flights, UserInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (UserInfo?.isAdmin) {
      toast.error("Admins can only access the Admin Panel");
      navigate("/admin");
    }
  }, [UserInfo, navigate]);

  if (UserInfo?.isAdmin) {
    return null;
  }

  const FilteredFlights = Flights.filter((item) => {
    return item.continent === "Asia";
  });
  return (
    <section>
      <div className="flex flex-col gap-10">
        <p className="text-white text-2xl text-center  pt-16 ">
          Top Flights in Asia :
        </p>
        <div className="w-full h-auto grid justify-items-center grid-cols-4 gap-y-10  ">
          {FilteredFlights.slice(0, 4).map((item) => {
            return (
              <div
                onClick={() => {
                  sessionStorage.setItem("flightid", item.flightId);
                  fetchFlightById();
                  setBookClick(true);
                }}
                className="w-72 h-72  relative rounded-3xl cursor-pointer hover:scale-105 transition-all delay-100 ease-in-out"
                key={item.id}
              >
                <p className="absolute bottom-8 left-7 z-50 cursor-pointer text-white text-sm ">
                  <span className="text-xl font-medium"> Arriving at: </span>
                  <br /> {item.arrivalLocation} ({item.continent})
                </p>
                <p className="absolute cursor-pointer top-5 left-4 z-50 flex flex-col items-center text-white text-sm ">
                  {item.roundTrip}
                  <br />

                  {item.roundTrip === "One way" ? (
                    <GoArrowSwitch size={20} />
                  ) : (
                    <MdOutlineLocationCity size={20} />
                  )}
                </p>
                <p className="absolute top-4 right-4 z-50 cursor-pointer text-white font-semibold ">
                  <span className="text-sm font-normal">From</span> USD{" "}
                  {item.price}
                </p>
                <img
                  className="absolute inset-0 w-full brightness-75 h-full object-cover rounded-3xl"
                  style={{ objectFit: "cover" }}
                  src={getImageUrl(item.imgsrc)}
                  alt=""
                />
              </div>
            );
          })}
        </div>
        <hr className=" border-white/15" />
        <p className="text-white text-2xl text-center  pt-5 ">
          All Flights in Asia :
        </p>
        <div className="w-full h-auto grid justify-items-center grid-cols-4 gap-y-10  ">
          {FilteredFlights.map((item) => {
            return (
              <div
                onClick={() => {
                  sessionStorage.setItem("flightid", item.flightId);
                  fetchFlightById();
                  setBookClick(true);
                }}
                className="w-72 h-72  relative rounded-3xl cursor-pointer hover:scale-105 transition-all delay-100 ease-in-out"
                key={item.id}
              >
                <p className="absolute bottom-8 left-7 z-50 cursor-pointer text-white text-sm ">
                  <span className="text-xl font-medium"> Arriving at: </span>
                  <br /> {item.arrivalLocation} ({item.continent})
                </p>
                <p className="absolute cursor-pointer top-5 left-4 z-50 flex flex-col items-center text-white text-sm ">
                  {item.roundTrip}
                  <br />

                  {item.roundTrip === "One way" ? (
                    <GoArrowSwitch size={20} />
                  ) : (
                    <MdOutlineLocationCity size={20} />
                  )}
                </p>
                <p className="absolute top-4 right-4 z-50 cursor-pointer text-white font-semibold ">
                  <span className="text-sm font-normal">From</span> USD{" "}
                  {item.price}
                </p>
                <img
                  className="absolute inset-0 w-full brightness-75 h-full object-cover rounded-3xl"
                  style={{ objectFit: "cover" }}
                  src={getImageUrl(item.imgsrc)}
                  alt=""
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Asia;
