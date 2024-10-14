"use client";
import { useState } from "react";
import axios from "axios";

const HomeView = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const [message, setMessage] = useState<string>("");

  const requestVerificationCode = async () => {
    const finalNumber =
      phoneNumber?.[0] === "9" &&
      phoneNumber?.[1] === "1" &&
      phoneNumber.length === 12
        ? "+" + phoneNumber
        : "+91" + phoneNumber;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/auth/sendCode`,
        { phoneNumber: finalNumber }
      );
      if (response.status === 200) {
        setMessage("Verification code sent to " + finalNumber);
        setStep(2);
      }
    } catch (error) {
      console.log(error);
      setMessage("Failed to send verification code.");
    }
  };

  const verifyCode = async () => {
    const finalNumber =
      phoneNumber?.[0] === "9" &&
      phoneNumber?.[1] === "1" &&
      phoneNumber.length === 12
        ? "+" + phoneNumber
        : "+91" + phoneNumber;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/auth/verifyCode`,
        {
          phoneNumber: finalNumber,
          code: verificationCode,
        }
      );
      if (response.status === 200) {
        setMessage("Phone number verified successfully!");
      }
    } catch {
      setMessage("Invalid or expired verification code.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-200 p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Phone Number Verification
      </h1>
      {message && (
        <p className="mb-4 text-green-600 font-semibold">{message}</p>
      )}

      {step === 1 && (
        <div className="flex flex-col items-center bg-white p-6 rounded-md shadow-sm w-full max-w-md">
          <label
            htmlFor="phoneNumber"
            className="mb-2 text-gray-600 font-semibold"
          >
            Enter your phone number:
          </label>
          <input
            type="number"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border text-black border-gray-300 p-2 rounded-md w-full mb-4 focus:outline-none focus:ring focus:ring-blue-200"
          />
          <p className="text-sm font-semibold bg-red-300 p-2 rounded-md text-red-900 mb-4 ">
            Please note that SMS functionality is currently limited, as the
            Twilio free tier only allows messages to be sent to verified users.
            If you’d like to verify your number, kindly email it to
            anshumantalukdar02@gmail.com
          </p>
          <button
            onClick={requestVerificationCode}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md w-full"
          >
            Send Code
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <label
            htmlFor="verificationCode"
            className="mb-2 text-gray-600 font-semibold"
          >
            Enter the verification code:
          </label>
          <input
            type="text"
            id="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="border text-black border-gray-300 p-2 rounded-md w-full mb-4 focus:outline-none focus:ring focus:ring-blue-200"
          />
          <button
            onClick={verifyCode}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md w-full"
          >
            Verify
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeView;
