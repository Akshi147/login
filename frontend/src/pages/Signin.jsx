import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignin = async () => {
        try {
            const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
                username: email,
                password
            });
            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    setError("Invalid credentials. Please try again.");
                } else if (error.response.status === 404) {
                    setError("User does not exist.");
                } else {
                    setError("An error occurred. Please try again.");
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
                    <Heading label={"Sign in"} />
                    <SubHeading label={"Enter your credentials to access your account"} />
                    <InputBox placeholder="enter your email" label={"Email"} value={email} onChange={e => setEmail(e.target.value)} />
                    <InputBox placeholder="enter password" label={"Password"} value={password} onChange={e => setPassword(e.target.value)} />
                    {error && <div className="text-red-500 pt-2">{error}</div>}
                    <div className="pt-4">
                        <Button label={"Sign in"} type="submit" onClick={handleSignin} />
                    </div>
                    <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/"} />
                </div>
            </div>
        </div>
    );
};
