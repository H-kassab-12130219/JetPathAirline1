import React, { useState } from "react";
import { API_ENDPOINTS } from "../config/api";
import { toast } from "react-hot-toast";

const ContactUs = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !message.trim()) {
      toast.error("Please fill in both email and message fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const userId = localStorage.getItem("id") || null;
      const response = await fetch(API_ENDPOINTS.ADD_SUPPORT_MESSAGE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          phone: phone.trim() || null,
          message: message.trim(),
          userId: userId ? parseInt(userId) : null,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        toast.error(data.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full h-96 flex  items-start justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-[500px] h-auto">
        <p className="text-3xl text-center text-white">
          Contact
          <span className="text-red-800"> Us</span> <br />
          <span className="text-sm text-center text-white">
            {" "}
            If you're encountering any problem please let us know
          </span>
        </p>

        <div className="flex flex-col gap-0.5 ">
          <label className=" text-white" htmlFor="email">
            Contact Email
          </label>
          <input
            id="email"
            className=" bg-custom-input pl-2 rounded-lg w-64 h-10 text-Custom-Nav"
            type="email"
            placeholder="example123@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-0.5 ">
          <label className=" text-white" htmlFor="phone">
            Phone Number <span className="text-sm text-slate-400">(Optional)</span>
          </label>
          <input
            id="phone"
            className=" bg-custom-input pl-2 rounded-lg w-64 h-10 text-Custom-Nav"
            type="tel"
            placeholder="+961 12345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="flex flex-col  w-full h-auto gap-0.5">
          <label className=" text-white" htmlFor="message">
            Message
          </label>

          <textarea
            id="message"
            placeholder="Type your message here..."
            className=" bg-custom-input pt-2 pl-2 rounded-lg  text-Custom-Nav"
            cols="30"
            rows="10"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="flex">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-32 h-10 rounded-lg bg-custom-input hover:bg-red-800 transition-all delay-100 ease-in-out text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ContactUs;
