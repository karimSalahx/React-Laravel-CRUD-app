import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [errors, setErrors] = useState(null);
    const { setUser, setToken } = useStateContext();
    const onSubmit = async (ev) => {
        ev.preventDefault();
        try {
            setErrors(null);
            const email = emailRef.current.value;
            const password = passwordRef.current.value;
            const payload = {
                email,
                password,
            };
            const response = await axiosClient.post('/login', payload);
            const data = response.data;
            setUser(data.user);
            setToken(data.token);
        } catch (error) {
            const response = error.response;
            if (response && response.status === 422) { // Unprocessable Content
                console.log(response.data.errors);
                if (response.data.errors) {
                    setErrors(response.data.errors);
                } else {
                    setErrors({ message: [response.data.message] });
                }

                // name.first
            }
        }


    }
    return (

        <form onSubmit={onSubmit} method="POST">
            <h1 className="title">Login into your account</h1>
            <h5>
                {
                    errors &&
                    <div className="alert">
                        {Object.keys(errors).map(key => <p key={key}>{errors[key][0]}</p>)}
                    </div>
                }
            </h5>
            <input type="email" placeholder="Email" ref={emailRef} />
            <input type="password" placeholder="Password" ref={passwordRef} />
            <button className="btn btn-block">Login</button>
            <p className="message">Not Registered? <Link to='/signup'>Create an account</Link></p>
        </form>


    )
}
