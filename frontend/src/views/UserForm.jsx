import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import axiosClient from "../axios-client";

export default function UserForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [errors, setErrors] = useState(null);

    const [user, setUser] = useState({
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })


    useEffect(() => {
        if (id) {
            axiosClient.get(`/users/${id}`).then(({ data }) => {
                const realData = data.data;
                setUser(realData);
            }).catch(e => {
                setErrors(e);
            });
        }
    }, [id]);

    function onSubmit(ev) {
        ev.preventDefault();
        user.id ? updateUser() : addNewUser();
    }

    function updateUser() {
        axiosClient.put(`/users/${user.id}`, user).then(() => {
            navigate('/users');
        }).catch(error => {
            const response = error.response;
            if (response && response.status === 422) { // Unprocessable Content
                console.log(response.data.errors);
                setErrors(response.data.errors); // name.first
            }
        })
    }


    function addNewUser() {
        axiosClient.post('/users', user).then(() => {
            navigate('/users');
        }).catch(error => {
            console.log(error);
            const response = error.response;
            if (response && response.status === 422) { // Unprocessable Content
                console.log(response.data.errors);
                setErrors(response.data.errors); // name.first
            }
        })
    }
    return (
        <>
            {user.id && <h1>Update User: {user.name}</h1>}
            {!user.id && <h1>New User</h1>}
            <div className="card animated fadeInDown">
                {
                    errors &&
                    <div className="alert">
                        {Object.keys(errors).map(key => <p key={key}>{errors[key][0]}</p>)}
                    </div>
                }
                <form onSubmit={onSubmit} method="POST">
                    <input type="text" value={user.name} onChange={ev => setUser({ ...user, name: ev.target.value })} placeholder="Name" />
                    <input type="email" value={user.email} onChange={ev => setUser({ ...user, email: ev.target.value })} placeholder="Email" />
                    <input type="password" onChange={ev => setUser({ ...user, password: ev.target.value })} placeholder="Password" />
                    <input type="password" onChange={ev => setUser({ ...user, password_confirmation: ev.target.value })} placeholder="Password Confirmation" />
                    <button className="btn">Save</button>

                </form>
            </div>

        </>
    )
}