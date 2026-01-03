import React, { useMemo } from "react";
import ProfilePhoto from "./ProfilePhoto";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Contexts/AuthContext";
import { toast } from "react-hot-toast";
import { calculateTierStats, formatJoinDate } from "../utils/loyalty";

const ProfilePreview = () => {
  const {
    UserInfo,
    setEditProfileClick,
    EditProfileClick,
    fetchUpdateFullUserById,
    userFlights,
    fetchUpdateProfile,
    fetchRemoveFlightByFlightId,
  } = useContext(AuthContext);

  // Fallback split if backend still uses username
  const FullName =
    UserInfo && UserInfo.username ? UserInfo.username.split(" ") : ["", ""];

  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [email, setEmail] = useState("");

  // New fields
  const [patronymic, setPatronymic] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [workingSince, setWorkingSince] = useState("");
  const [position, setPosition] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [flightToCancel, setFlightToCancel] = useState(null);
  
  // Password change fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const navigate = useNavigate();
  if (!localStorage.getItem("isLoggedIn")) {
    navigate("/");
  }

  useEffect(() => {
    if (UserInfo) {
      const firstName =
        UserInfo.firstName || (UserInfo.username ? FullName[0] : "");
      const lastName =
        UserInfo.lastName || (UserInfo.username ? FullName[1] : "");

      setFirst(firstName || "");
      setSecond(lastName || "");
      setEmail(UserInfo.email || "");

      setPatronymic(UserInfo.patronymic || "");
      // type="date" expects YYYY-MM-DD
      setBirthday(
        UserInfo.birthday ? String(UserInfo.birthday).substring(0, 10) : ""
      );
      setGender(UserInfo.gender || "");
      setEmploymentStatus(UserInfo.employmentStatus || "");
      setWorkingSince(
        UserInfo.workingSince
          ? String(UserInfo.workingSince).substring(0, 10)
          : ""
      );
      setPosition(UserInfo.position || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserInfo]);

  const handleFirstChange = (e) => setFirst(e.target.value);
  const handleSecondChange = (e) => setSecond(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);

  const handlePatronymicChange = (e) => setPatronymic(e.target.value);
  const handleBirthdayChange = (e) => setBirthday(e.target.value);
  const handleGenderChange = (e) => setGender(e.target.value);
  const handleEmploymentStatusChange = (e) =>
    setEmploymentStatus(e.target.value);
  const handleWorkingSinceChange = (e) => setWorkingSince(e.target.value);
  const handlePositionChange = (e) => setPosition(e.target.value);

  const jetPoints = Number(UserInfo?.jetPoints) || 0;
  const tierLevel = UserInfo?.tierLevel || "Silver";
  const loyaltyJoinDateLabel = formatJoinDate(UserInfo?.loyaltyJoinDate);
  const tierStats = calculateTierStats(tierLevel, jetPoints);
  const numberFormatter = new Intl.NumberFormat();
  const pointsNeededCopy = tierStats.nextTier
    ? `${numberFormatter.format(
        tierStats.pointsToNextTier
      )} pts to reach ${tierStats.nextTier}`
    : "You are enjoying the highest tier";

  const formatDate = (value) => {
    if (!value) return "—";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "—";
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

  const activeFlights = useMemo(
  () => (Array.isArray(userFlights)
    ? userFlights.filter((flight) => flight.status !== "completed")
    : []),
  [userFlights]
);

const archivedFlights = useMemo(
  () => (Array.isArray(userFlights)
    ? userFlights.filter((flight) => flight.status === "completed")
    : []),
  [userFlights]
);


  function CreateToast(Message) {
    toast((t) => {
      return <span className="">{Message}</span>;
    });
    return null;
  }

  const formatDateDisplay = (value) => {
    if (!value) return "";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toLocaleDateString();
  };

  return (
    <section className="w-full min-h-screen flex flex-col p-3">
      <div className="flex flex-col justify-center items-center gap-10">
        {/* TOP PROFILE CARD (READ-ONLY) */}
        <div className="bg-custom-dashboard rounded-2xl w-[1250px] h-auto flex flex-col gap-x-20 p-3">
          <div className="flex justify-between items-center pb-10">
            <p className="text-xl text-white">
              {UserInfo?.isAdmin ? "Admin Profile :" : "Passenger Profile :"}
            </p>
            {UserInfo?.isAdmin && (
              <button
                onClick={() => navigate("/admin")}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition flex items-center gap-2"
              >
                <span>←</span> Back to Admin Panel
              </button>
            )}
          </div>

          {/* BASIC INFO ROW */}
          <div className="flex justify-start items-center gap-x-20">
            <div className="flex flex-col">
              <ProfilePhoto />
            </div>

            <div className="flex flex-col text-white">
              <label className="pl-1">First Name</label>
              <input
                type="text"
                className="bg-custom-input pl-2 cursor-default rounded-lg w-64 h-10 text-Custom-Nav"
                value={UserInfo?.firstName || FullName[0] || ""}
                readOnly
              />
            </div>

            <div className="flex flex-col text-white">
              <label className="pl-1">Last Name</label>
              <input
                type="text"
                className="bg-custom-input pl-2 cursor-default rounded-lg w-64 h-10 text-Custom-Nav"
                value={UserInfo?.lastName || FullName[1] || ""}
                readOnly
              />
            </div>

            <div className="flex flex-col text-white">
              <label className="pl-1">Email</label>
              <input
                type="email"
                className="bg-custom-input pl-2 cursor-default rounded-lg w-64 h-10 text-Custom-Nav"
                value={UserInfo?.email || ""}
                readOnly
              />
            </div>
          </div>

          {/* NEW FIELDS ROW 1: Patronymic / Birthday / Gender */}
          <div className="flex justify-start items-center gap-x-20 mt-6">
            <div className="w-20"></div>
            <div className="flex flex-col text-white">
              <label className="pl-1">Patronymic</label>
              <input
                type="text"
                className="bg-custom-input pl-2 cursor-default rounded-lg w-64 h-10 text-Custom-Nav"
                value={UserInfo?.patronymic || ""}
                readOnly
              />
            </div>

            <div className="flex flex-col text-white">
              <label className="pl-1">Birthday</label>
              <input
                type="text"
                className="bg-custom-input pl-2 cursor-default rounded-lg w-64 h-10 text-Custom-Nav"
                value={formatDateDisplay(UserInfo?.birthday)}
                readOnly
              />
            </div>

            <div className="flex flex-col text-white">
              <label className="pl-1">Gender</label>
              <input
                type="text"
                className="bg-custom-input pl-2 cursor-default rounded-lg w-64 h-10 text-Custom-Nav"
                value={UserInfo?.gender || ""}
                readOnly
              />
            </div>
          </div>

          {/* NEW FIELDS ROW 2: Status / Working Since / Position */}
          <div className="flex justify-start items-center gap-x-20 mt-6">
            <div className="w-20"></div>
            <div className="flex flex-col text-white">
              <label className="pl-1">Status</label>
              <input
                type="text"
                className="bg-custom-input pl-2 cursor-default rounded-lg w-64 h-10 text-Custom-Nav"
                value={UserInfo?.employmentStatus || ""}
                readOnly
              />
            </div>

            <div className="flex flex-col text-white">
              <label className="pl-1">Working Since</label>
              <input
                type="text"
                className="bg-custom-input pl-2 cursor-default rounded-lg w-64 h-10 text-Custom-Nav"
                value={formatDateDisplay(UserInfo?.workingSince)}
                readOnly
              />
            </div>

            <div className="flex flex-col text-white">
              <label className="pl-1">Position</label>
              <input
                type="text"
                className="bg-custom-input pl-2 cursor-default rounded-lg w-64 h-10 text-Custom-Nav"
                value={UserInfo?.position || ""}
                readOnly
              />
            </div>
          </div>

          <div>
            <button
              onClick={() => setEditProfileClick(true)}
              className="ml-[1095px] w-32 h-10 mt-6 rounded-md hover:bg-custom-input hover:text-white transition-all delay-100 ease-in-out bg-white text-custom-input z-20"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* EDIT PROFILE AREA (NOW WITH NEW FIELDS) */}
        {EditProfileClick && (
          <div className="bg-custom-dashboard rounded-2xl w-[1250px] h-auto flex flex-col gap-6 p-7">
            <h2 className="text-2xl font-bold text-white mb-2">Edit Profile</h2>
            
            {/* Personal Information Section */}
            <div className="border-b border-slate-700 pb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-white flex flex-col">
                  <label className="pl-1 mb-1 text-sm">First Name</label>
                  <input
                    type="text"
                    className="bg-custom-input pl-2 rounded-lg w-full h-10 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    value={first}
                    onChange={handleFirstChange}
                  />
                </div>

                <div className="text-white flex flex-col">
                  <label className="pl-1 mb-1 text-sm">Last Name</label>
                  <input
                    type="text"
                    className="bg-custom-input pl-2 rounded-lg w-full h-10 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    value={second}
                    onChange={handleSecondChange}
                  />
                </div>

                <div className="text-white flex flex-col">
                  <label className="pl-1 mb-1 text-sm">Patronymic</label>
                  <input
                    type="text"
                    className="bg-custom-input pl-2 rounded-lg w-full h-10 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    value={patronymic}
                    onChange={handlePatronymicChange}
                  />
                </div>

                <div className="text-white flex flex-col">
                  <label className="pl-1 mb-1 text-sm">Email</label>
                  <input
                    type="email"
                    className="bg-custom-input pl-2 rounded-lg w-full h-10 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>

                <div className="text-white flex flex-col">
                  <label className="pl-1 mb-1 text-sm">Birthday</label>
                  <input
                    type="date"
                    className="bg-custom-input pl-2 rounded-lg w-full h-10 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    value={birthday}
                    onChange={handleBirthdayChange}
                  />
                </div>

                <div className="text-white flex flex-col">
                  <label className="pl-1 mb-1 text-sm">Gender</label>
                  <select
                    className="bg-custom-input pl-2 rounded-lg w-full h-10 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    value={gender}
                    onChange={handleGenderChange}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Employment Information Section */}
            <div className="border-b border-slate-700 pb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Employment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-white flex flex-col">
                  <label className="pl-1 mb-1 text-sm">Employment Status</label>
                  <select
                    className="bg-custom-input pl-2 rounded-lg w-full h-10 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    value={employmentStatus}
                    onChange={handleEmploymentStatusChange}
                  >
                    <option value="">Select</option>
                    <option value="working">Working</option>
                    <option value="not_working">Not working</option>
                    <option value="student">Student</option>
                    <option value="retired">Retired</option>
                  </select>
                </div>

                <div className="text-white flex flex-col">
                  <label className="pl-1 mb-1 text-sm">Working Since</label>
                  <input
                    type="date"
                    className="bg-custom-input pl-2 rounded-lg w-full h-10 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    value={workingSince}
                    onChange={handleWorkingSinceChange}
                  />
                </div>

                <div className="text-white flex flex-col">
                  <label className="pl-1 mb-1 text-sm">Position</label>
                  <input
                    type="text"
                    className="bg-custom-input pl-2 rounded-lg w-full h-10 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    value={position}
                    onChange={handlePositionChange}
                  />
                </div>
              </div>
            </div>

            {/* Password Change Section */}
            <div className="border-b border-slate-700 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Change Password</h3>
                <button
                  onClick={() => {
                    setShowPasswordSection(!showPasswordSection);
                    if (showPasswordSection) {
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }
                  }}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  {showPasswordSection ? "Cancel" : "Change Password"}
                </button>
              </div>
              
              {showPasswordSection && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-white flex flex-col">
                    <label className="pl-1 mb-1 text-sm">Current Password</label>
                    <input
                      type="password"
                      className="bg-custom-input pl-2 rounded-lg w-full h-10 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                  </div>

                  <div className="text-white flex flex-col">
                    <label className="pl-1 mb-1 text-sm">New Password</label>
                    <input
                      type="password"
                      className="bg-custom-input pl-2 rounded-lg w-full h-10 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="text-white flex flex-col">
                    <label className="pl-1 mb-1 text-sm">Confirm New Password</label>
                    <input
                      type="password"
                      className="bg-custom-input pl-2 rounded-lg w-full h-10 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={() => {
                  setEditProfileClick(false);
                  setShowPasswordSection(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="w-32 h-10 bg-slate-700 rounded-lg text-white hover:bg-slate-600 transition-all delay-100 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  // Validate password if password section is open
                  if (showPasswordSection) {
                    if (!currentPassword || !newPassword || !confirmPassword) {
                      CreateToast("Please fill in all password fields");
                      return;
                    }
                    if (newPassword !== confirmPassword) {
                      CreateToast("New passwords do not match");
                      return;
                    }
                    if (newPassword.length < 6) {
                      CreateToast("New password must be at least 6 characters");
                      return;
                    }
                  }

                  // Update profile with optional password
                  await fetchUpdateFullUserById(
                    first,
                    second,
                    email,
                    patronymic,
                    birthday,
                    gender,
                    employmentStatus,
                    workingSince,
                    position,
                    showPasswordSection ? currentPassword : null,
                    showPasswordSection ? newPassword : null
                  );
                  setEditProfileClick(false);
                  setShowPasswordSection(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setTimeout(() => {
                    navigate(0);
                  }, 1500);
                }}
                className="w-32 h-10 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-all delay-100 ease-in-out"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* LOYALTY SECTION */}
        {!UserInfo?.isAdmin && (
          <div className="w-[1250px] h-auto flex flex-col gap-6 p-6 rounded-2xl bg-custom-dashboard text-white">
            <p className="text-xl">Loyalty status</p>
            <div className="grid w-full gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2 rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
                <p className="text-sm uppercase tracking-[0.4em] text-Custom-Nav">
                  JetPoints balance
                </p>
                <p className="text-4xl font-semibold">
                  {numberFormatter.format(jetPoints)}
                </p>
                <p className="text-sm text-Custom-Nav">
                  {tierStats.tierRangeLabel} • {tierLevel} Tier
                </p>
              </div>
              <div className="flex flex-col gap-4 rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
                <div className="flex justify-between text-sm">
                  <span>Next tier</span>
                  <span>{tierStats.nextTier || "Max tier unlocked"}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-red-700"
                    style={{ width: `${tierStats.progressPercent}%` }}
                  />
                </div>
                <p className="text-sm text-Custom-Nav">{pointsNeededCopy}</p>
                <p className="text-sm text-Custom-Nav">
                  {loyaltyJoinDateLabel
                    ? `Member since ${loyaltyJoinDateLabel}`
                    : "Join the loyalty program to start earning JetPoints"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE ITINERARY */}
        {!UserInfo?.isAdmin && (
          <div className="w-[1250px] h-auto flex flex-col gap-5 p-6 rounded-2xl bg-custom-dashboard text-white">
            {activeFlights.length !== 0 ? (
              <>
                <div className="flex flex-col gap-1">
                  <p className="text-xl">Active itinerary</p>
                  <p className="text-sm text-Custom-Nav">
                    Flights move to your archive automatically once their
                    arrival time passes.
                  </p>
                </div>
                {activeFlights.map((item) => {
                  const flight = item.flight || {};
                  const isRoundTrip = (flight.roundTrip || "")
                    .toLowerCase()
                    .includes("round");
                  const scheduleRows = [
                    {
                      label: "Outbound",
                      depart: `${formatDate(
                        flight.departureDateTime
                      )} · ${formatTime(
                        flight.departureDateTime
                      )} — ${
                        flight.departureLocation || "Beirut"
                      }`,
                      arrive: `${formatDate(
                        flight.arrivalDateTime
                      )} · ${formatTime(
                        flight.arrivalDateTime
                      )} — ${
                        flight.arrivalLocation || "Unknown"
                      }`,
                    },
                  ];
                  if (isRoundTrip) {
                    const returnDepart = flight.returnDepartureDateTime;
                    const returnArrive = flight.returnArrivalDateTime;
                    scheduleRows.push({
                      label: "Return",
                      depart: returnDepart
                        ? `${formatDate(returnDepart)} · ${formatTime(
                            returnDepart
                          )} — ${flight.arrivalLocation || "Unknown"}`
                        : "Return slot confirmed in Manage Booking",
                      arrive: returnArrive
                        ? `${formatDate(returnArrive)} · ${formatTime(
                            returnArrive
                          )} — ${
                            flight.departureLocation || "Beirut"
                          }`
                        : "We’ll send the exact time 48h before departure",
                    });
                  }

                  return (
                    <div
                      className="w-full rounded-2xl bg-slate-900/70 border border-slate-800 p-5 flex flex-col gap-4"
                      key={item.flightId || item.id}
                    >
                      <div className="flex flex-wrap justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.4em] text-Custom-Nav">
                            Route
                          </p>
                          <p className="text-2xl font-semibold">
                            {flight.departureLocation || "Beirut"} ➜{" "}
                            {flight.arrivalLocation || "Unknown"}
                          </p>
                        </div>
                        <div className="text-sm text-right text-Custom-Nav">
                          <p>{flight.flightType || "Economy"}</p>
                          <p>{isRoundTrip ? "Round trip" : "One way"}</p>
                          <p>Tickets: {item.tickets || 0}</p>
                        </div>
                      </div>

                      <div className="overflow-x-auto rounded-xl border border-slate-800">
                        <table className="min-w-full text-sm">
                          <thead className="bg-black/30 text-slate-300 text-xs uppercase tracking-[0.2em]">
                            <tr>
                              <th className="px-4 py-3 text-left">Segment</th>
                              <th className="px-4 py-3 text-left">Departs</th>
                              <th className="px-4 py-3 text-left">Arrives</th>
                            </tr>
                          </thead>
                          <tbody>
                            {scheduleRows.map((row) => (
                              <tr
                                key={row.label}
                                className="border-t border-slate-800"
                              >
                                <td className="px-4 py-3 font-semibold">
                                  {row.label}
                                </td>
                                <td className="px-4 py-3 text-slate-100">
                                  {row.depart}
                                </td>
                                <td className="px-4 py-3 text-slate-100">
                                  {row.arrive}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="text-sm text-Custom-Nav">
                          <p>${item.price || 0}</p>
                          <p>Booking ID: {item.flightId}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() => {
                              setFlightToCancel({
                                flightId: item.flightId,
                                price: item.price,
                                tickets: item.tickets,
                                departureLocation: flight.departureLocation || "Beirut",
                                arrivalLocation: flight.arrivalLocation || "Unknown"
                              });
                              setShowCancelConfirm(true);
                            }}
                            className="w-40 h-10 rounded-xl border border-white/20 hover:bg-white hover:text-custom-body transition-all delay-100 ease-in-out"
                          >
                            Cancel flight
                          </button>
                          <p className="text-xs text-Custom-Nav">
                            This trip will archive itself automatically after
                            landing.
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 ">
                <p className="text-center text-white text-xl font-medium">
                  You haven't booked any flights yet...
                </p>
                <a
                  className="rounded-lg text-Custom-Nav cursor-pointer underline text-sm hover:text-custom-body transition-all delay-100 ease-in-out"
                  onClick={() => {
                    navigate("/dashboard");
                  }}
                >
                  Book Now
                </a>
              </div>
            )}
          </div>
        )}

        {/* FLIGHT ARCHIVE */}
        {!UserInfo?.isAdmin && (
          <div className="w-[1250px] h-auto flex flex-col gap-5 p-6 rounded-2xl bg-custom-dashboard text-white">
            <div className="flex flex-col gap-1">
              <p className="text-xl">Flight archive</p>
              <p className="text-sm text-Custom-Nav">
                Completed flights stay here for 6 months for expense tracking
                and loyalty audits.
              </p>
            </div>
            {archivedFlights.length > 0 ? (
              archivedFlights.map((item) => {
                const flight = item.flight || {};
                const isRoundTrip = (flight.roundTrip || "")
                  .toLowerCase()
                  .includes("round");
                const scheduleRows = [
                  {
                    label: "Outbound",
                    depart: `${formatDate(
                      flight.departureDateTime
                    )} · ${formatTime(
                      flight.departureDateTime
                    )} — ${
                      flight.departureLocation || "Beirut"
                    }`,
                    arrive: `${formatDate(
                      flight.arrivalDateTime
                    )} · ${formatTime(
                      flight.arrivalDateTime
                    )} — ${
                      flight.arrivalLocation || "Unknown"
                    }`,
                  },
                ];
                if (isRoundTrip) {
                  const returnDepart = flight.returnDepartureDateTime;
                  const returnArrive = flight.returnArrivalDateTime;
                  scheduleRows.push({
                    label: "Return",
                    depart: returnDepart
                      ? `${formatDate(returnDepart)} · ${formatTime(
                          returnDepart
                        )} — ${flight.arrivalLocation || "Unknown"}`
                      : "Refer to ticket (return managed offline)",
                    arrive: returnArrive
                      ? `${formatDate(returnArrive)} · ${formatTime(
                          returnArrive
                        )} — ${
                          flight.departureLocation || "Beirut"
                        }`
                      : "Contact support for full timeline",
                  });
                }

                return (
                  <div
                    className="w-full rounded-2xl bg-slate-900/70 border border-slate-800 p-5 flex flex-col gap-4"
                    key={`archive-${item.flightId || item.id}`}
                  >
                    <div className="flex flex-wrap justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.4em] text-Custom-Nav">
                          Route
                        </p>
                        <p className="text-2xl font-semibold">
                          {flight.departureLocation || "Beirut"} ➜{" "}
                          {flight.arrivalLocation || "Unknown"}
                        </p>
                      </div>
                      <div className="text-sm text-right text-Custom-Nav">
                        <p>{flight.flightType || "Economy"}</p>
                        <p>{isRoundTrip ? "Round trip" : "One way"}</p>
                        <p>
                          Completed:{" "}
                          {item.completedAt
                            ? new Date(
                                item.completedAt
                              ).toLocaleDateString()
                            : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-800">
                      <table className="min-w-full text-sm">
                        <thead className="bg-black/30 text-slate-300 text-xs uppercase tracking-[0.2em]">
                          <tr>
                            <th className="px-4 py-3 text-left">Segment</th>
                            <th className="px-4 py-3 text-left">Departed</th>
                            <th className="px-4 py-3 text-left">Arrived</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scheduleRows.map((row) => (
                            <tr
                              key={row.label}
                              className="border-t border-slate-800"
                            >
                              <td className="px-4 py-3 font-semibold">
                                {row.label}
                              </td>
                              <td className="px-4 py-3 text-slate-100">
                                {row.depart}
                              </td>
                              <td className="px-4 py-3 text-slate-100">
                                {row.arrive}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex flex-wrap justify-between text-sm text-Custom-Nav">
                      <span>
                        JetPoints earned:{" "}
                        {(item.pointsEarned || 0).toLocaleString()}
                      </span>
                      <span>Booking ID: {item.flightId}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-300 text-sm">
                Once you finish a trip, it automatically appears here with the
                final details.
              </p>
            )}
          </div>
        )}

        {/* Cancel Flight Confirmation Modal */}
        {showCancelConfirm && flightToCancel && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70">
            <div className="bg-custom-dashboard rounded-2xl p-8 w-full max-w-md mx-4 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">Cancel Flight?</h2>
              <div className="mb-6 p-4 bg-slate-800/50 rounded-lg">
                <p className="text-slate-300 text-sm mb-2">Flight Details</p>
                <p className="text-white font-semibold">
                  {flightToCancel.departureLocation} → {flightToCancel.arrivalLocation}
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Booking ID: {flightToCancel.flightId}
                </p>
                <p className="text-white text-lg font-semibold mt-3">
                  Total Paid: ${Number(flightToCancel.price || 0).toFixed(2)}
                </p>
              </div>
              <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
                <p className="text-yellow-200 text-sm font-semibold mb-2">⚠️ Refund Policy</p>
                <p className="text-yellow-100 text-sm">
                  You will receive a <span className="font-bold">10% refund</span> of the total price.
                </p>
                <p className="text-yellow-200 text-lg font-bold mt-2">
                  Refund Amount: ${(Number(flightToCancel.price || 0) * 0.1).toFixed(2)}
                </p>
                <p className="text-yellow-100 text-xs mt-2 opacity-80">
                  The remaining 90% is non-refundable as per our cancellation policy.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowCancelConfirm(false);
                    setFlightToCancel(null);
                  }}
                  className="flex-1 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition"
                >
                  Keep Booking
                </button>
                <button
                  onClick={async () => {
                    await fetchRemoveFlightByFlightId(
                      flightToCancel.flightId,
                      flightToCancel.price,
                      flightToCancel.tickets,
                      1
                    );
                    setShowCancelConfirm(false);
                    setFlightToCancel(null);
                    navigate(0);
                  }}
                  className="flex-1 py-3 rounded-lg bg-red-800 hover:bg-red-700 text-white transition"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfilePreview;
