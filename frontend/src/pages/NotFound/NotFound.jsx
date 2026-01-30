import "./NotFound.css";
import { useNavigate } from "react-router-dom";
import { AiOutlineExclamationCircle } from "react-icons/ai";

function NotFound() {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="not-found-page">
            <div className="not-found-content">
                <AiOutlineExclamationCircle className="not-found-img"/>
                <h2 className="not-found-text">Opps, something went wrong!</h2>
                <button 
                    className="go-home-button"
                    onClick={handleGoHome}
                >
                    Go Home
                </button>

            </div>
        </div>
    )

}

export default NotFound;