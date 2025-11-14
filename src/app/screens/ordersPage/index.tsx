import { useState, SyntheticEvent, useEffect } from "react";
import { Container, Stack, Box } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setPausedOrders, setProcessOrders, setFinishedOrders } from "./slice";

import "../../../css/order.css";
import { Order, OrderInquiry } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";
import { useNavigate } from "react-router-dom";
import { serverApi } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member-enum";

/**
 REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
  setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
});

export default function OrdersPage() {
  const { setPausedOrders, setProcessOrders, setFinishedOrders } =
    actionDispatch(useDispatch());

  const { orderBuilder, authMember } = useGlobals();
  const navigate = useNavigate();
  const [value, setValue] = useState("1");
  const [orderInquiry] = useState<OrderInquiry>({
    page: 1,
    limit: 5,
    orderStatus: OrderStatus.PAUSE,
  });

  useEffect(() => {
    const order = new OrderService();

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PAUSE })
      .then((data) => setPausedOrders(data))
      .catch((err) => console.log(err));

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PROCESS })
      .then((data) => setProcessOrders(data))
      .catch((err) => console.log(err));

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.FINISH })
      .then((data) => setFinishedOrders(data))
      .catch((err) => console.log(err));
  }, [
    orderInquiry,
    orderBuilder,
    setPausedOrders,
    setProcessOrders,
    setFinishedOrders,
  ]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authMember) {
      navigate("/");
    }
  }, [authMember, navigate]);

  /**
   HANDLERS **/

  const handleChange = (e: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // Show nothing while redirecting
  if (!authMember) return null;

  return (
    <div className="order-page">
      <Container className="order-container">
        <Stack direction="row" spacing={2}>
          {/* Left Section */}
          <Stack className="order-left" flex={1}>
            <TabContext value={value}>
              <Box className="order-nav-frame">
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="Order Tabs"
                    className="table_list"
                  >
                    <Tab label="PAUSED ORDERS" value="1" />
                    <Tab label="PROCESS ORDERS" value="2" />
                    <Tab label="FINISHED ORDERS" value="3" />
                  </Tabs>
                </Box>
              </Box>

              <Stack className={"order-main-content"}>
                <PausedOrders setValue={setValue} />
                <ProcessOrders setValue={setValue} />
                <FinishedOrders />
              </Stack>
            </TabContext>
          </Stack>

          {/* Right Section */}
          <Stack className="order-right" flex={0.3}>
            <Box className="order-info-box">
              <Box className="member-box">
                <div className="order-user-img">
                  <img
                    src={
                      authMember?.memberImage
                        ? `${serverApi}/${authMember.memberImage}`
                        : "/icons/default-user.svg"
                    }
                    className="order-user-avatar"
                    alt="User Avatar"
                  />
                  <div className="order-user-icon-box">
                    <img
                      src={
                        authMember?.memberType === MemberType.RESTAURANT
                          ? "/icons/restaurant.svg"
                          : "/icons/user-badge.svg"
                      }
                      className="order-user-profit-img"
                      alt="User Badge"
                    />
                  </div>
                </div>
                <span className="order-user-name">
                  {authMember?.memberNick}
                </span>
                <span className="order-user-profit">
                  {authMember?.memberType}
                </span>
              </Box>
              <Box className="liner" />
              <Box className="order-user-address">
                <LocationOnIcon className="order-user-icon" />
                <span className="order-user-address-txt">
                  {authMember?.memberAddress
                    ? authMember.memberAddress
                    : "No address provided"}
                </span>
              </Box>
            </Box>

            <Box className="order-info-box">
              <Box className="payment-box">
                <div className="payment-header">
                  <span className="payment-title">Payment Details</span>
                  <div className="card-icons">
                    <img
                      src="/icons/visa-card.svg"
                      alt="Visa"
                      className="card-icon"
                    />
                    <img
                      src="/icons/master-card.svg"
                      alt="MasterCard"
                      className="card-icon"
                    />
                    <img
                      src="/icons/western-card.svg"
                      alt="Amex"
                      className="card-icon"
                    />
                  </div>
                </div>

                <form className="payment-form">
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    className="payment-input"
                  />
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="payment-input"
                  />
                  <div className="payment-row">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="payment-input small"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="payment-input small"
                    />
                  </div>
                  <button className="pay-button">PAY NOW</button>
                </form>
              </Box>
            </Box>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
