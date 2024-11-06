import './reserve.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Reserve = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { B_ID } = location.state || {}; // Retrieve B_ID from state

    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('authToken');
        
        if (!isAuthenticated) {
            navigate('/signin');
        }
    }, [navigate]);

    const handleReservation = async (event) => {
        event.preventDefault();
        
        const S_ID = localStorage.getItem('S_ID'); // Retrieve S_ID from localStorage

        const reservationData = {
            S_ID,
            B_ID, // Use B_ID from the state
            date: `${date}`,
            time: `${time}`
        };

        try {
            const response = await axios.post('http://localhost:3000/reserves', reservationData, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 200) {
                setSuccessMessage('Reservation successfully added.');
                setErrorMessage('');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Failed to make reservation. Please try again.');
            setSuccessMessage('');
        }
    };

    return (
        <div>
            <form className="reservation-form" onSubmit={handleReservation}>
                <h2>Boat Reservation</h2>

                <div className="form-group">
                    <label htmlFor="reservation-date">Select Date:</label>
                    <input
                        type="date"
                        id="reservation-date"
                        name="reservation-date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="reservation-time">Select Time:</label>
                    <input
                        type="time"
                        id="reservation-time"
                        name="reservation-time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="submit-btn">Book Reservation</button>

                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </form>
        </div>
    );
};

export default Reserve;
