import { useNavigate } from 'react-router-dom';
import './SignOut.css'; // Assuming you have a separate CSS file for this component

const SignOut = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    navigate('/signin');
  };

  return (
    <button className="betButton" onClick={handleSignOut}>
      Sign Out
    </button>
  );
};

export default SignOut;
