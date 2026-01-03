import React from "react";
import { FaMobileAlt } from "react-icons/fa";
import { IoIosWifi } from "react-icons/io";
import { IoFastFood } from "react-icons/io5";

const JetPathInfo = () => {
  return (
    <section className="w-full h-[500px] flex gap-10 justify-center items-center bg-custom-body">
      <div className="flex flex-col mt-6 gap-3">
        <FaMobileAlt className="text-4xl text-white" />
        <h1 className="text-3xl font-extralight text-white">
          The <span className=" text-red-800"> JetPath </span>App
        </h1>
        <p className="text-sm font-extralight text-white">
          "Explore the world with The JetPath App – your personal <br /> journey
          planner for booking and managing trips <br /> on the go. Compatible
          with iPad, iPhone, <br /> Apple Watch, and Android phone, it's <br />{" "}
          your ultimate travel companion
        </p>
        <button className="w-32 h-9 rounded-3xl bg-transperant border border-white text-white font-light text-sm">
          Learn more
        </button>
      </div>
      <div className="flex flex-col gap-3">
        <IoIosWifi className="text-4xl text-white" />
        <h1 className="text-3xl  font-extralight text-white">
          Free <span className="text-red-800"> Wi-Fi</span> in the Sky
        </h1>
        <p className="text-sm font-extralight text-white">
          Now it's free to email, post or tweet from your seat <br /> on all of
          our A330 and most of our Boeing??? aircraft. <br /> Enjoy 10MB of data
          for free, or buy 500MB for <br /> just *USD 1.
        </p>
        <button className="w-32 h-9 rounded-3xl bg-transperant border border-white text-white font-light text-sm">
          Learn more
        </button>
      </div>
      <div className="flex flex-col gap-3">
        <IoFastFood className="text-4xl text-white" />
        <h1 className="text-3xl  font-extralight text-white">
          Tastiest <span className="text-red-800"> food</span>
        </h1>
        <p className="text-sm font-extralight text-white">
          Enjoy fast food perks on your flight! Satisfy your cravings
          <br />
          with delicious snacks and meals while soaring through <br /> the
          skies. Elevate your travel experience <br /> with our tasty in-flight
          options!
        </p>
        <button className="w-32 h-9 rounded-3xl bg-transperant border border-white text-white font-light text-sm">
          Learn more
        </button>
      </div>
    </section>
  );
};

export default JetPathInfo;

