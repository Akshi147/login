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

export const Signin = () => {
  const [email, setEmail] = useState("");
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

  const handleSignin = async () => {
    try {
      const response = await axios.post("https://login-seven-pink.vercel.app/auth/signin", {
        username: email,
        password
      });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError("User does not exist.");
        } else if (error.response.status===400 && error.response.data.message === 'Email already in use'){
          setError("Email already taken in User Signin.");
        } else if (error.response.status === 400) {
          setError("Please fill the required fields correctly.");
        } else if (error.response.status === 401) {
          setError("Incorrect password.");
        } else if (error.response.status === 402) {
          setError("Error while logging in.");
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
          'recaptcha-container',
          {
            size: 'invisible',
            callback: (response) => {
              handleOTPSignin();
            },
            'expired-callback': () => {
              console.log('Recaptcha expired');
            },
          },
          auth
        );
        window.recaptchaVerifier.render().catch((error) => {
          console.error('Error rendering RecaptchaVerifier:', error);
          setError('Recaptcha verification failed. Please try again.');
        });
      } catch (error) {
        console.error('Error initializing RecaptchaVerifier:', error);
        setError('Recaptcha verification failed. Please try again.');
      }
    }
  };

  const handleOTPSignin = () => {
    setLoading(true);
    setError('');
    onCaptchaVerify();
    const appVerifier = window.recaptchaVerifier;
    const formatPh = '+' + phoneNumber;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sent successfully!");
      })
      .catch((error) => {
        console.error('Error sending OTP:', error);
        setLoading(false);
        if (error.code === 'auth/too-many-requests') {
          setError('Too many requests. Please try again later.');}
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
          const response = await axios.post("https://login-seven-pink.vercel.app/auth/otp-signin", {
            phoneNumber,
          });
          localStorage.setItem("token", response.data.token);
          navigate("/dashboard");
        } catch (error) {
          if (error.response) {
            setError(error.response.data.message || 'An error occurred. Please try again.');
          } else if(error.response.status === 404){
            setError("User does not exist.");
          } else {
            setError("An error occurred. Please try again.");
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
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          {!showPhoneInput && (
            <>
              <InputBox
                required
                placeholder="Enter your email"
                label={"Email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputBox
                required
                placeholder="Enter password"
                label={"Password"}
                value={password}
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <div className="text-red-500 pt-2">{error}</div>}
              <div className="pt-4">
                <Button label={"Sign in"} type="submit" onClick={handleSignin} />
                <Button label={"Sign in with Google"} onClick={googleAuth} />
                <Button onClick={togglePhoneInput} label={"Sign in with OTP"} />
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
                  <div className="pt-4" >
                  <Button onClick={onOTPVerify} label={"Verify OTP"}>
                    {loading && <CgSpinner size={20} className="mt-1 animate-spin" />}
                  </Button>
                  </div>
                </>
              ) : (
                <>
                  <label
                    htmlFor="phoneNumber"
                    className="text-sm font-medium text-left py-2"
                  >
                    Enter your phone number<span className="text-red-500">*</span>
                  </label>
                  <PhoneInput
                    country={"in"}
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                  />
                  {error && <div className="text-red-500 pt-2">{error}</div>}
                  <div className="pt-4">
                  <Button onClick={handleOTPSignin} label={"Send code via SMS"}>
                    {loading && <CgSpinner size={20} className="mt-1 animate-spin" />}
                  </Button>
                  </div>
                </>
              )}
            </div>
          )}
          <BottomWarning
            label={"Don't have an account?"}
            buttonText={"Sign up"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
};
