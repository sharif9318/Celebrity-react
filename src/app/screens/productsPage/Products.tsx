import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Container, Stack } from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SearchIcon from "@mui/icons-material/Search";
import Badge from "@mui/material/Badge";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setProducts } from "./slice";
import { createSelector } from "reselect";
import { retrieveProducts } from "./selector";
import { Product, ProductInquiry } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product-enum";
import { serverApi } from "../../../lib/config";
import { useNavigate } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";

/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});
const productsRetriever = createSelector(retrieveProducts, (products) => ({
  products,
}));

interface ProductsProps {
  onAdd: (item: CartItem) => void;
}

export default function Products(props: ProductsProps) {
  const { onAdd } = props;
  const { setProducts } = actionDispatch(useDispatch());
  const { products } = useSelector(productsRetriever);
  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 8,
    order: "createdAt",
    productCollection: ProductCollection.BURGER,
    search: "",
  });
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();

  // ✅ FIXED: Removed setProducts from dependencies
  useEffect(() => {
    const product = new ProductService();
    product
      .getProducts(productSearch)
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, [productSearch]);

  // ✅ FIXED: Removed productSearch from dependencies and used functional setState
  useEffect(() => {
    if (searchText === "") {
      setProductSearch((prev) => ({ ...prev, search: "" }));
    }
  }, [searchText]);

  /**
    HANDLERS **/

  const searchCollectionHandler = (collection: ProductCollection) => {
    productSearch.page = 1;
    productSearch.productCollection = collection;
    setProductSearch({ ...productSearch });
  };

  const searchOrderHandler = (order: string) => {
    productSearch.page = 1;
    productSearch.order = order;
    setProductSearch({ ...productSearch });
  };

  const searchProductHandler = () => {
    productSearch.search = searchText;
    setProductSearch({ ...productSearch });
  };

  const paginationHandler = (e: ChangeEvent<any>, value: number) => {
    productSearch.page = value;
    setProductSearch({ ...productSearch });
  };

  const chooseDishHandler = (id: string) => {
    navigate(`/products/${id}`);
  };

  return (
    <div className="products">
      <Container>
        <Stack flexDirection="column" alignItems="center">
          <Stack className="avatar-big-box">
            <Stack className="top-text">
              <p>CELEBRITY MENU</p>
              <Stack className="single-search-big-box">
                <input
                  type="search"
                  className="single-search-input"
                  name="singleSearch"
                  placeholder="Type here"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      searchProductHandler();
                    }
                  }}
                />
                <Button
                  className="single-button-search"
                  variant="contained"
                  endIcon={<SearchIcon />}
                  onClick={searchProductHandler}
                >
                  Search
                </Button>
              </Stack>
            </Stack>
          </Stack>
          <Stack className="dishes-filter-section">
            <Stack className="dishes-filter-box">
              <Button
                variant="contained"
                className="order"
                color={
                  productSearch.order === "createdAt" ? "primary" : "secondary"
                }
                onClick={() => searchOrderHandler("createdAt")}
              >
                New
              </Button>
              <Button
                variant="contained"
                className="order"
                color={
                  productSearch.order === "productPrice"
                    ? "primary"
                    : "secondary"
                }
                onClick={() => searchOrderHandler("productPrice")}
              >
                Price
              </Button>
              <Button
                variant="contained"
                className="order"
                color={
                  productSearch.order === "productViews"
                    ? "primary"
                    : "secondary"
                }
                onClick={() => searchOrderHandler("productViews")}
              >
                Views
              </Button>
            </Stack>
          </Stack>
          <Stack className={"list-category-section"}>
            <Stack className={"product-category"}>
              <div className={"category-main"}>
                <Button
                  className="category-btn"
                  variant={"contained"}
                  color={
                    productSearch.productCollection === ProductCollection.DRINK
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() =>
                    searchCollectionHandler(ProductCollection.DRINK)
                  }
                >
                  DRINK
                </Button>
                <Button
                  className="category-btn"
                  variant={"contained"}
                  color={
                    productSearch.productCollection ===
                    ProductCollection.DESSERT
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() =>
                    searchCollectionHandler(ProductCollection.DESSERT)
                  }
                >
                  Dessert
                </Button>
                <Button
                  className="category-btn"
                  variant={"contained"}
                  color={
                    productSearch.productCollection === ProductCollection.FRIES
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() =>
                    searchCollectionHandler(ProductCollection.FRIES)
                  }
                >
                  FRIES
                </Button>
                <Button
                  className="category-btn"
                  variant={"contained"}
                  color={
                    productSearch.productCollection === ProductCollection.SET
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() => searchCollectionHandler(ProductCollection.SET)}
                >
                  SET
                </Button>
                <Button
                  className="category-btn"
                  variant={"contained"}
                  color={
                    productSearch.productCollection === ProductCollection.BURGER
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() =>
                    searchCollectionHandler(ProductCollection.BURGER)
                  }
                >
                  BURGER
                </Button>
              </div>
            </Stack>

            <Stack className={"product-wrapper"}>
              {products.length !== 0 ? (
                products.map((product: Product) => {
                  const imagePath = `${serverApi}/${product.productImages[0]}`;
                  const sizeVolume =
                    product.productCollection === ProductCollection.DRINK
                      ? product.productVolume + "litre"
                      : product.productSize + "size";
                  return (
                    <Stack
                      key={product._id}
                      className={"product-card"}
                      onClick={() => chooseDishHandler(product._id)}
                    >
                      <Stack
                        className={"product-img"}
                        sx={{ backgroundImage: `url(${imagePath})` }}
                      >
                        <div className={"product-sale"}>{sizeVolume}</div>
                        <Button
                          className={"shop-btn"}
                          onClick={(e) => {
                            onAdd({
                              _id: product._id,
                              quantity: 1,
                              name: product.productName,
                              price: product.productPrice,
                              image: product.productImages[0],
                            });
                            e.stopPropagation();
                          }}
                        >
                          <img
                            src={"/icons/shopping-cart.svg"}
                            style={{ display: "flex" }}
                            alt="Add to cart"
                          />
                        </Button>
                        <Button className={"view-btn"} sx={{ right: "36px" }}>
                          <Badge
                            badgeContent={product.productViews}
                            color="secondary"
                          >
                            <RemoveRedEyeIcon
                              sx={{
                                color:
                                  product.productViews === 0 ? "gray" : "white",
                              }}
                            />
                          </Badge>
                        </Button>
                      </Stack>
                      <Box className={"product-desc"}>
                        <span className={"product-title"}>
                          {product.productName}
                        </span>
                        <div className={"product-desc"}>
                          <MonetizationOnIcon />
                          {product.productPrice}
                        </div>
                      </Box>
                    </Stack>
                  );
                })
              ) : (
                <Box className="no-data">Products are not available</Box>
              )}
            </Stack>
          </Stack>
          <Stack className="pagination-section">
            <Pagination
              count={
                products.length !== 0
                  ? productSearch.page + 1
                  : productSearch.page
              }
              page={productSearch.page}
              renderItem={(item) => (
                <PaginationItem
                  components={{
                    previous: ArrowBackIcon,
                    next: ArrowForwardIcon,
                  }}
                  {...item}
                  color="secondary"
                />
              )}
              onChange={paginationHandler}
            />
          </Stack>
        </Stack>
      </Container>

      <div className={"brands-logo"}>
        <Container>
          <Stack flexDirection={"column"} alignItems={"center"}>
            <Stack className={"brands-logo-area"}>
              <Box className={"brands-title"}>Our Family Brands</Box>
              <Stack className={"brands-pics"}>
                <Box
                  component={"img"}
                  src={"/img/lotteriafamily.jpeg"}
                  sx={{ width: "238px", height: "329px" }}
                  borderRadius={"16px"}
                  boxShadow={
                    "0 4px 4px 0 rgba(161, 161, 161, 0.25) inset, 0 4px 4px 0 rgba(108, 108, 108, 0.25) inset, 0 4px 16px 0 rgba(173, 170, 170, 0.04) inset"
                  }
                ></Box>
                <Box
                  component={"img"}
                  src={"/img/167340731163be2b4f2139d.jpg"}
                  sx={{ width: "238px", height: "329px" }}
                  borderRadius={"16px"}
                  boxShadow={
                    "0 4px 4px 0 rgba(161, 161, 161, 0.25) inset, 0 4px 4px 0 rgba(108, 108, 108, 0.25) inset, 0 4px 16px 0 rgba(173, 170, 170, 0.04) inset"
                  }
                ></Box>
                <Box
                  component={"img"}
                  src={"/img/e7963491396899.5e30b8f3dd1ba.jpg"}
                  sx={{ width: "238px", height: "329px" }}
                  borderRadius={"16px"}
                  boxShadow={
                    "0 4px 4px 0 rgba(161, 161, 161, 0.25) inset, 0 4px 4px 0 rgba(108, 108, 108, 0.25) inset, 0 4px 16px 0 rgba(173, 170, 170, 0.04) inset"
                  }
                ></Box>
                <Box
                  component={"img"}
                  src={"/img/d28b845f391bd8040d6099e67bbaed9d.jpg"}
                  sx={{ width: "238px", height: "329px" }}
                  borderRadius={"16px"}
                  boxShadow={
                    "0 4px 4px 0 rgba(161, 161, 161, 0.25) inset, 0 4px 4px 0 rgba(108, 108, 108, 0.25) inset, 0 4px 16px 0 rgba(173, 170, 170, 0.04) inset"
                  }
                ></Box>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </div>
      <div className={"address"}>
        <Container>
          <Stack className={"address-area"}>
            <Box className={"title"}>Our address</Box>
            <iframe
              style={{ marginTop: "60px" }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.912075099102!2d126.97231721530988!3d37.55472207979832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca26787e6b111%3A0x1f030fba7646902f!2sSeoul%20Station!5e0!3m2!1sen!2skr!4v1690030852917!5m2!1sen!2skr"
              width="1320"
              height="500"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map"
            ></iframe>
          </Stack>
        </Container>
      </div>
    </div>
  );
}
