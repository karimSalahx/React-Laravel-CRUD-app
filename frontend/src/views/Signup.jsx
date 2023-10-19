import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from '../axios-client';
import { useStateContext } from "../contexts/ContextProvider";

export default function Signup() {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmationRef = useRef();
    const [errors, setErrors] = useState(null);
    const { setUser, setToken } = useStateContext();


    const onSubmit = async (ev) => {
        ev.preventDefault();
        try {
            const payload = {
                name: nameRef.current.value,
                email: emailRef.current.value,
                password: passwordRef.current.value,
                password_confirmation: passwordConfirmationRef.current.value,
            };
            console.log(payload);

            const response = await axiosClient.post('/signup', payload)
            const { data } = response;
            setUser(data.user);
            setToken(data.token);
        } catch (error) {
            const response = error.response;
            if (response && response.status === 422) { // Unprocessable Content
                console.log(response.data.errors);
                setErrors(response.data.errors); // name.first
            }
        }

    }
    return (

        <form onSubmit={onSubmit} method="POST">
            <h1 className="title">Signup for free</h1>
            <h1>
                {
                    errors &&
                    <div className="alert">
                        {Object.keys(errors).map(key => <p key={key}>{errors[key][0]}</p>)}
                    </div>
                }
            </h1>
            <input placeholder="Full Name" ref={nameRef} />
            <input type="email" placeholder="Email" ref={emailRef} />
            <input type="password" placeholder="Password" ref={passwordRef} />
            <input type="password" placeholder="Password Confirmation" ref={passwordConfirmationRef} />
            <button className="btn btn-block">Sign up</button>
            <p className="message">Already registered? <Link to='/login'>Sign in</Link></p>
        </form>


    )
}
