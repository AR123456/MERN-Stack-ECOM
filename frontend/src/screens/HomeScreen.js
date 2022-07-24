import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";
import { listProducts } from "../actions/productActions";
// need to pass in match for the search logic
const HomeScreen = ({ match }) => {
  // check for keyword using match - not getting an id here, getting keyword
  // may be nothing or may be a keyword - whatever it is passing
  // into list products
  const keyword = match.params.keyword;

  //get query params for page number or use number 1
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  // get page and pages to use in pagination
  const { loading, error, products, page, pages } = productList;

  useEffect(() => {
    // passing in keyword - need to account for this in list products actions
    // in productActions.js
    dispatch(listProducts(keyword, pageNumber));
    // add keyword and page number
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      <Meta />
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light">
          Go Back
        </Link>
      )}
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {/* Done add message product not found if it is not sec 87 q&A */}
          {products.length === 0 && (
            <div>No products found with that keyword</div>
          )}
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          {/* pass in pages , keyword if there is on or empty string if no keyword */}

          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
