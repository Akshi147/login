import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');
    const [showPassword] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            const response = await axios.post("https://login-seven-pink.vercel.app/api/v1/user/", {
                username,
                firstName,
                lastName,
                password
            });
            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
        } catch (error) {
            if (error.response) {
                if (error.response.status === 411) {
                    setError("Email already taken.");
                } else if(error.response.status === 410) {
                    setError("Please fill all required fields correctly");
                }
            } else {
                setError("An error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign up"} />
                    <SubHeading label={"Enter your information to create an account"} />
                    <InputBox required onChange={e => {
                        setFirstName(e.target.value);
                    }} placeholder="Enter first name" label={"First Name"} />
                    <InputBox onChange={(e) => {
                        setLastName(e.target.value);
                    }} placeholder="Enter last name" label={"Last Name"} />
                    <InputBox required onChange={e => {
                        setUsername(e.target.value);
                    }} placeholder="Enter email" label={"Email"} />
                    <InputBox required onChange={(e) => {
                        setPassword(e.target.value);
                    }} placeholder="Password of min. 6 characters" label={"Password"} type={showPassword ? "text" : "password"}/>
                    {error && <div className="text-red-500 pt-2">{error}</div>}
                    <div className="pt-4">
                        <Button onClick={handleSignup} label={"Sign up"} />
                    </div>
                    <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/"} />
                </div>
            </div>
        </div>
    );
};
