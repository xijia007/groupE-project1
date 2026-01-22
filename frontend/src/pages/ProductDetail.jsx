import { Link } from "react-router-dom";

function ProductDetail() {

    return (
        <>
            <h1>Product Detail Page</h1>
            <Link className="back-to-home" to='/'>
                <button>Back To Home Page</button>
            </Link>

        </>
    )
}

export default ProductDetail;