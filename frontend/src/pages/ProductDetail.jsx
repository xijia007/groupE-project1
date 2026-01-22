import { Link } from "react-router-dom";

function ProductDetail() {

    return (
        <>
        <div className="header"></div>
            <h1>Products Detail</h1>
            <Link className="back-to-home" to='/'>
                <button>Back To Home Page</button>
            </Link>

        </>
    )
}

export default ProductDetail;