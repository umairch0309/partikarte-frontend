import React from "react";
import { Route, Routes } from "react-router-dom";
import UserLayout from "../../components/Layouts/UserLayout/UserLayout";
import Page404 from "../common/Page404";
import LandingPage from "./LandingPage";
import AllEventsPage from "./AllEventsPage";
import ViewEvent from "./ViewEvent";
import CheckoutPage from "./CheckoutPage";
import PoliciesPage from "./PoliciesPage";
import ContactUs from "./ContactUs";
import BusinessProfile from "./BusinessProfile";
import JoinBusiness from "./JoinBusiness";
import { BookingProvider } from "../../context/booking-context";
import PaymentSuccessPage from "../common/PaymentSuccessPage";
import PaymentErrorPage from "../common/PaymentErrorPage";

const UserMain = () => {
  return (
    <BookingProvider>
      <UserLayout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/all-events" element={<AllEventsPage />} />
          <Route path="/all-events/:eventId" element={<ViewEvent />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route
            path="/checkout/payment-success"
            element={<PaymentSuccessPage />}
          />
          <Route
            path="/checkout/payment-error"
            element={<PaymentErrorPage />}
          />
          <Route path="/policies" element={<PoliciesPage />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/join-business" element={<JoinBusiness />} />
          <Route
            path="/business-profile/:businessId"
            element={<BusinessProfile />}
          />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </UserLayout>
    </BookingProvider>
  );
};

export default UserMain;
