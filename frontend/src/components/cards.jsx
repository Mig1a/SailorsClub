import React from 'react'

import './Cards.css'
import { useNavigate } from 'react-router-dom';



const Card = (props) =>  {
    const navigate = useNavigate();
    const handleReserve = () => {
        navigate('/reserve', { state: { B_ID: props.B_ID } });
    };

  return (
    <div className='Element'>
        <div className="Card">
          <img src={props.B_Image} alt={props.B_Name} className="card-image" />
          <h2 className="title">{props.B_Name}</h2>
          <h3 className="author">{props.B_Type}</h3>
          
          <button  className="betButton" onClick={handleReserve}>Reserve </button>
        </div>

    </div>
      
  );
};

export default Card;