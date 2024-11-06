import './Signup.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        birthDate: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    // Handle changes to form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();  // Prevent page reload
        // Send POST request to server
        axios.post('http://localhost:3000/sailors', formData)
            .then((response) => {
                if(!formData){
                    navigate('/signup')
                }else{navigate('/signin')}
            })
            .catch((error) => {
                console.error('Error sending data:', error);
            });
    };

    return (
        <div className='contain'>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name</label><br />
                <input
                    type="text"
                    id="name"
                    name="S_name"
                    value={formData.S_name}
                    onChange={handleChange}
                /><br /><br />

                <label htmlFor="birthDate">Birth Date</label><br />
                <input
                    type="date"
                    id="birthDate"
                    name="B_date"
                    value={formData.B_date}
                    onChange={handleChange}
                /><br /><br />

                <label htmlFor="email">Email</label><br />
                <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                /><br /><br />

                <label htmlFor="password">Password</label><br />
                <input
                    type="text"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                /><br /><br />

                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

export default Signup;
