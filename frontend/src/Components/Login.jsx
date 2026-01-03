import React, { useContext } from "react";
import AuthContext from "../Contexts/AuthContext";
import Loading from "./Loading";

const Login = () => {
  const {
    LoginWindow,
    setLoginWindow,
    UserObj,
    setUserObj,
    fetchLogin,
    Error,
    setError,
    PasswordError,
    setPasswordError,
    RegisterWindow,
    setRegisterWindow,
    isLoading,
    setisLoading,
  } = useContext(AuthContext);

  const handleBackdropClick = () => {
    setError(false);
    setPasswordError(false);
    setLoginWindow(false);
  };

  const handleModalClick = (e) => {
    e.stopPropagation(); // Prevent closing when clicking inside
  };

  const handleOnChangeEmail = (event) => {
    setUserObj({ ...UserObj, email: event.target.value });
  };

  const handleOnChangePassword = (event) => {
    setUserObj({ ...UserObj, password: event.target.value });
  };

  const handleOnClickLogin = () => {
    // Basic email validation
    if (
      !UserObj?.email ||
      !UserObj.email.includes("@") ||
      !UserObj.email.includes(".")
    ) {
      setError(true);
      return;
    }

    setError(false);
    setPasswordError(false);
    fetchLogin();
  };

  if (!LoginWindow) return null;

  return (
    <section
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center px-4"
    >
      <div
        onClick={handleModalClick}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center gap-6 max-h-[90vh] overflow-y-auto"
      >
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 rounded-3xl flex items-center justify-center z-20">
            <Loading />
          </div>
        )}

        <h1 className="text-2xl md:text-3xl text-center font-medium">
          READY FOR TAKE-OFF??{" "}
          <span className="text-red-800"> LOGIN NOW! </span>
        </h1>

        {/* EMAIL */}
        <div className="flex flex-col w-full gap-1">
          <label className="pl-1 text-sm font-medium">Email</label>
          <input
            className="border rounded-md shadow-black/10 shadow-sm h-9 px-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-red-800/70"
            type="email"
            onChange={handleOnChangeEmail}
          />
          {Error && (
            <p className="text-[11px] pt-1 font-semibold text-red-800">
              Invalid email format...
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="flex flex-col w-full gap-1">
          <label className="pl-1 text-sm font-medium">Password</label>
          <input
            className="border rounded-md shadow-black/10 shadow-sm h-9 px-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-red-800/70"
            type="password"
            onChange={handleOnChangePassword}
          />
          {PasswordError && (
            <p className="text-[11px] pt-1 font-semibold text-red-800">
              Invalid Credentials
            </p>
          )}

          <p
            onClick={() => {
              setLoginWindow(false);
              setRegisterWindow(true);
            }}
            className="text-xs pt-3 cursor-pointer font-semibold text-red-800 hover:underline"
          >
            New? Click me to Register..
          </p>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleOnClickLogin}
          className="mt-2 w-32 h-10 rounded-3xl bg-red-800 transition-all duration-150 text-white hover:bg-transparent hover:border border-black hover:text-black font-medium text-sm"
        >
          Login
        </button>
      </div>
    </section>
  );
};

export default Login;
