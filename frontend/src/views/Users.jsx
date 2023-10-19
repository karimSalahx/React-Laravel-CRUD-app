import { useEffect, useState } from "react"
import axiosClient from '../axios-client';
import { Link } from 'react-router-dom';
export default function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        try {
            const response = await axiosClient.get('/users');
            const data = response.data;
            console.log(data);
            setUsers(data.data);
        } catch (e) {
            console.log(e);
        }

    }

    const deleteButtonHandler = async (user) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            await axiosClient.delete(`/users/${user.id}`);
            alert('User delete successfully') ? "" : location.reload();

        }

    }
    return (
        <div >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Users</h1>
                <Link to="/users/new" className="btn-add">Add New</Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    {/* Set the columns */}
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Create Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {/* Set the rows */}
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.created_at}</td>
                                <td>
                                    <Link className="btn-edit" to={'/users/' + u.id} >Edit</Link>
                                    &nbsp;
                                    <button onClick={() => deleteButtonHandler(u)} className="btn-delete">Delete</button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
