import { useState } from 'react';
import './Signinc.css';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

const SignIn = () => {
    const [user, setUser] = useState({
        email:'',
        password:''
    });
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const handleSignin = async(event) =>{
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/signin', user, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 200) {
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('S_ID', response.data.S_ID);

                const B_ID = localStorage.getItem('B_ID');
                if (B_ID) {
                    navigate('/reserve');
                } else {
                    navigate('/')
                }
                // Handle successful sign-in, e.g., save token, redirect, etc.
            }
        } catch (error) {
            
                if (error.response && error.response.status === 401) {
                    setErrorMessage('Invalid email or password');
                } else {
                    setErrorMessage('An error occurred. Please try again.');
                }

        }
    };

    return(
        <div className='contain'>
            <form onSubmit={handleSignin}>
                <label htmlFor="title">Email</label><br />
                <input type="text" id="title" name="email"  value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })}
                /><br /><br />

                <label htmlFor="author">Password</label><br />
                <input type="password" id="author" name="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })}
 /><br /><br />
                
                <input type="submit" value="Submit" />
            </form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
       
    )


}

export default SignIn;