import ProductList from "../assets/components/Products/productList";
import products from "../assets/data/mock_products.json";

function Home() {
    return (
        <>
            <h1>Home Page</h1>
            <ProductList products={products} />


        </>
    )
}

export default Home;