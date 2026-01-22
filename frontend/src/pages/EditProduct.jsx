import { Link } from "react-router-dom";


function EditProduct() {

  return (
    <>
      <h1>Edit Product Page</h1>
      <Link className="back-to-home" to='/'>
        <button>Back To Home Page</button>
      </Link>
    </>
  );
}

export default EditProduct;
