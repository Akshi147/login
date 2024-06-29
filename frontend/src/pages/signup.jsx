import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase.config";
import { toast, Toaster } from "react-hot-toast";

export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [showPassword] = useState(false);
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const navigate = useNavigate();

  const googleAuth = () => {
    window.open(
      "https://login-seven-pink.vercel.app/auth/google/callback",
      "_self"
    );
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        "https://login-seven-pink.vercel.app/auth/",
        {
          username,
          firstName,
          lastName,
          password,
        }
      );
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        if (
          error.response.status === 411 ||
          (error.response.status === 400 &&
            error.response.data.message === "Email already in use")
        ) {
          setError("Email already taken.");
        } else if (error.response.status === 410) {
          setError("Please fill all required fields correctly");
        }
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  const onCaptchaVerify = () => {
    if (!window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "invisible",
            callback: (response) => {
              handleOTPSignup();
            },
            "expired-callback": () => {
              console.log("Recaptcha expired");
            },
          },
          auth
        );
        window.recaptchaVerifier.render().catch((error) => {
          console.error("Error rendering RecaptchaVerifier:", error);
          setError("Recaptcha verification failed. Please try again.");
        });
      } catch (error) {
        console.error("Error initializing RecaptchaVerifier:", error);
        setError("Recaptcha verification failed. Please try again.");
      }
    }
  };

  const handleOTPSignup = () => {
    setLoading(true);
    setError("");
    onCaptchaVerify();
    const appVerifier = window.recaptchaVerifier;
    const formatPh = "+" + phoneNumber;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sent successfully!");
      })
      .catch((error) => {
        console.error("Error sending OTP:", error);
        setLoading(false);
        if (error.code === "auth/too-many-requests") {
          setError("Too many requests. Please try again later.");
        }
        // } else {
        //   setError('Something went wrong. Please try again.');
        // }
      });
  };

  const onOTPVerify = async () => {
    setLoading(true);
    setError("");
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        setLoading(false);
        try {
          const response = await axios.post(
            "https://login-seven-pink.vercel.app/auth/otp-verify",
            {
              phoneNumber,
              firstName,
              lastName,
            }
          );
          localStorage.setItem("token", response.data.token);
          navigate("/dashboard");
        } catch (err) {
          console.error("Error verifying OTP:", err);
          setLoading(false);
          if (err.code === "auth/code-expired") {
            setError("OTP code has expired. Please request a new OTP.");
          } else {
            setError("Invalid OTP. Please try again.");
          }
        }
      })
      .catch((err) => {
        console.error("Error verifying OTP:", err);
        setLoading(false);
        setError("Invalid OTP. Please try again.");
      });
  };

  const togglePhoneInput = () => {
    setShowPhoneInput(!showPhoneInput);
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your information to create an account"} />
          {!showPhoneInput && (
            <>
              <InputBox
                required
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                label={"First Name"}
              />
              <InputBox
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                label={"Last Name"}
              />
              <InputBox
                required
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter email"
                label={"Email"}
              />
              <InputBox
                required
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password of min. 6 characters"
                label={"Password"}
                type={showPassword ? "text" : "password"}
              />
              {error && <div className="text-red-500 pt-2">{error}</div>}
              <div className="pt-4">
                <Button onClick={handleSignup} label={"Sign up"} />
                <Button onClick={googleAuth} label={"Sign up with Google"} />
                <Button onClick={togglePhoneInput} label={"Sign up with OTP"} />
              </div>
            </>
          )}
          {showPhoneInput && (
            <div className="pt-4">
              {showOTP ? (
                <>
                  <label
                    htmlFor="otp"
                    className="text-sm font-medium text-left py-2"
                  >
                    Enter your OTP
                  </label>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    OTPLength={6}
                    otpType="number"
                    disabled={false}
                    autoFocus
                    className="opt-container"
                  />
                  {error && <div className="text-red-500 pt-2">{error}</div>}
                  <div className="pt-4">
                    <Button onClick={onOTPVerify} label={"Verify OTP"}>
                      {loading && (
                        <CgSpinner size={20} className="mt-1 animate-spin" />
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <label
                    htmlFor="phoneNumber"
                    className="text-sm font-medium text-left py-2"
                  >
                    Enter your phone number
                    <span className="text-red-500">*</span>
                  </label>
                  <PhoneInput
                    country={"in"}
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                  />
                  <InputBox
                    required
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    label={"First Name"}
                  />
                  <InputBox
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    label={"Last Name"}
                  />
                  {error && <div className="text-red-500 pt-2">{error}</div>}
                  <div className="pt-4">
                    <Button
                      onClick={handleOTPSignup}
                      label={"Send code via SMS"}
                    >
                      {loading && (
                        <CgSpinner size={20} className="mt-1 animate-spin" />
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/"}
          />
        </div>
      </div>
    </div>
  );
};
