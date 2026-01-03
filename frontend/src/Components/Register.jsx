import React, { useContext } from "react";
import AuthContext from "../Contexts/AuthContext";

const Register = () => {
  const {
    RUserObj,
    setRUserObj,
    PasswordInvalid,
    setPasswordInvalid,
    Error,
    setError,
    setPasswordError,
    LastN,
    setLastN,
    FirstN,
    setFirstN,
    RegisterWindow,
    setRegisterWindow,
    fetchRegister,
    setLoginWindow,
  } = useContext(AuthContext);

  const handleBackdropClick = () => {
    setError(false);
    setPasswordInvalid(false);
    setFirstN(false);
    setLastN(false);
    setPasswordError(false);
    setRegisterWindow(false);
  };

  const handleModalClick = (e) => {
    e.stopPropagation(); // prevent closing when clicking inside
  };

  // --------- HANDLERS FOR ALL FIELDS ---------
  const handleOnChangeEmail = (event) => {
    setRUserObj({ ...RUserObj, email: event.target.value });
  };

  const handleOnChangePassword = (event) => {
    setRUserObj({ ...RUserObj, password: event.target.value });
  };

  const handleOnChangeFirstN = (event) => {
    setRUserObj({ ...RUserObj, firstName: event.target.value });
  };

  const handleOnChangeLastN = (event) => {
    setRUserObj({ ...RUserObj, lastName: event.target.value });
  };

  const handleOnChangePatronymic = (event) => {
    setRUserObj({ ...RUserObj, patronymic: event.target.value });
  };

  const handleOnChangeBirthday = (event) => {
    setRUserObj({ ...RUserObj, birthday: event.target.value }); // yyyy-mm-dd
  };

  const handleOnChangeGender = (event) => {
    setRUserObj({ ...RUserObj, gender: event.target.value });
  };

  const handleOnChangeEmploymentStatus = (event) => {
    setRUserObj({ ...RUserObj, employmentStatus: event.target.value });
  };

  const handleOnChangeWorkingSince = (event) => {
    setRUserObj({ ...RUserObj, workingSince: event.target.value }); // yyyy-mm-dd
  };

  const handleOnChangePosition = (event) => {
    setRUserObj({ ...RUserObj, position: event.target.value });
  };

  // --------- VALIDATION + SUBMIT ---------
  const handleOnClickRegister = () => {
    const charactersToCheckRegex = /[@.\-]/;

    // Reset errors before validation
    setFirstN(false);
    setLastN(false);
    setError(false);
    setPasswordInvalid(false);
    setPasswordError(false);

    // Name validation
    if (RUserObj?.firstName && charactersToCheckRegex.test(RUserObj.firstName)) {
      setFirstN(true);
      return;
    }

    if (RUserObj?.lastName && charactersToCheckRegex.test(RUserObj.lastName)) {
      setLastN(true);
      return;
    }

    // Patronymic validation (optional field, but if provided, validate it)
    if (RUserObj?.patronymic && charactersToCheckRegex.test(RUserObj.patronymic)) {
      setFirstN(true);
      return;
    }

    // Email validation
    if (
      !RUserObj?.email ||
      !RUserObj.email.includes("@") ||
      !RUserObj.email.includes(".")
    ) {
      setError(true);
      return;
    }

    // Password validation
    if (!RUserObj?.password || RUserObj.password.length < 8) {
      setPasswordInvalid(true);
      return;
    }

    // If all validations pass, call backend
    fetchRegister();
  };

  if (!RegisterWindow) return null;

  return (
    <section
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center px-4"
    >
      <div
        onClick={handleModalClick}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
      >
        {/* HEADER */}
        <h1 className="text-2xl md:text-3xl text-center font-medium">
          Hassle-free travel!
          <span className="text-red-800"> Sign up </span>today.
        </h1>

        {/* GRID OF FIELDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* First Name */}
          <div className="flex flex-col">
            <label className="pl-1 text-sm font-medium">First Name</label>
            <input
              className="border rounded-md shadow-black/10 shadow-sm h-9 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-800/70"
              type="text"
              onChange={handleOnChangeFirstN}
            />
            {FirstN && (
              <p className="text-[11px] pt-1 font-semibold text-red-800">
                Names cannot contain special characters.
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="flex flex-col">
            <label className="pl-1 text-sm font-medium">Last Name</label>
            <input
              className="border rounded-md shadow-black/10 shadow-sm h-9 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-800/70"
              type="text"
              onChange={handleOnChangeLastN}
            />
            {LastN && (
              <p className="text-[11px] pt-1 font-semibold text-red-800">
                Names cannot contain special characters.
              </p>
            )}
          </div>

          {/* Patronymic */}
          <div className="flex flex-col">
            <label className="pl-1 text-sm font-medium">Patronymic</label>
            <input
              className="border rounded-md shadow-black/10 shadow-sm h-9 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-800/70"
              type="text"
              onChange={handleOnChangePatronymic}
            />
          </div>

          {/* Birthday */}
          <div className="flex flex-col">
            <label className="pl-1 text-sm font-medium">Birthday</label>
            <input
              className="border rounded-md shadow-black/10 shadow-sm h-9 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-800/70"
              type="date"
              onChange={handleOnChangeBirthday}
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col">
            <label className="pl-1 text-sm font-medium">Gender</label>
            <select
              className="border rounded-md shadow-black/10 shadow-sm h-9 px-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-800/70"
              onChange={handleOnChangeGender}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label className="pl-1 text-sm font-medium">Status</label>
            <select
              className="border rounded-md shadow-black/10 shadow-sm h-9 px-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-800/70"
              onChange={handleOnChangeEmploymentStatus}
            >
              <option value="">Select</option>
              <option value="working">Working</option>
              <option value="not_working">Not working</option>
              <option value="student">Student</option>
              <option value="retired">Retired</option>
            </select>
          </div>

          {/* Working Since */}
          <div className="flex flex-col">
            <label className="pl-1 text-sm font-medium">Working Since</label>
            <input
              className="border rounded-md shadow-black/10 shadow-sm h-9 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-800/70"
              type="date"
              onChange={handleOnChangeWorkingSince}
            />
          </div>

          {/* Position */}
          <div className="flex flex-col">
            <label className="pl-1 text-sm font-medium">Position</label>
            <input
              className="border rounded-md shadow-black/10 shadow-sm h-9 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-800/70"
              type="text"
              placeholder="CEO, employee..."
              onChange={handleOnChangePosition}
            />
          </div>

          {/* Email - make it span full width on md */}
          <div className="flex flex-col md:col-span-2 lg:col-span-3">
            <label className="pl-1 text-sm font-medium">Email</label>
            <input
              className="border rounded-md shadow-black/10 shadow-sm h-9 px-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-red-800/70"
              type="email"
              onChange={handleOnChangeEmail}
            />
            {Error && (
              <p className="text-[11px] pt-1 font-semibold text-red-800">
                Invalid email format.
              </p>
            )}
          </div>

          {/* Password - also full width */}
          <div className="flex flex-col md:col-span-2 lg:col-span-3">
            <label className="pl-1 text-sm font-medium">Password</label>
            <input
              className="border rounded-md shadow-black/10 shadow-sm h-9 px-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-red-800/70"
              type="password"
              onChange={handleOnChangePassword}
            />
            {PasswordInvalid && (
              <p className="text-[11px] pt-1 font-semibold text-red-800">
                Your password should be at least 8 characters.
              </p>
            )}
          </div>
        </div>

        {/* FOOTER: LOGIN LINK + BUTTON */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2">
          <p
            onClick={() => {
              setRegisterWindow(false);
              setLoginWindow(true);
            }}
            className="text-xs cursor-pointer font-semibold text-red-800 hover:underline"
          >
            Already a member? Log in now...
          </p>

          <button
            onClick={handleOnClickRegister}
            className="w-32 h-10 rounded-3xl bg-red-800 transition-all duration-150 text-white hover:bg-transparent hover:border border-black hover:text-black font-medium text-sm"
          >
            Register
          </button>
        </div>
      </div>
    </section>
  );
};

export default Register;
