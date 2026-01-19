import React from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import Header from "./Component/Header";
import Home from "./Component/Home";
import NavBar from "./Component/navbar";
import Checkout from "./Component/Checkout";

import Login from "./Component/Login";
import Headergreen from "./Component/Headergreen";
import NavBarg from "./Component/navbargreen";
import OrderConfirmationWrapper from "./Component/OrderConfirmationWrapper";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EducationSection from "./Component/Educationsection";
import SustainabilityReportsSection from "./Component/Sustainability";
import Footer from "./Component/Footer";

import Orders from "./Component/Orders";
import Thanks from "./Component/thanks";
import SellerSection from "./Component/SellerSection";
import Submitted from "./Component/Submitted";

import Dashboard from "./Component/Dashboard";
import Feedback from "./Component/feedback";

import ProductDetails from "./Component/ProductDetails";

import ProductDetails1 from "./Component/ProductDetails1";

import FSubmitted from "./Component/Feedbacksubmitted";
import GreenProducts from "./Component/GreenProducts";

import ProductPage from "./Component/ProductPage";
import Signup from "./Component/Signup";
import GroupOrderSetup from "./Component/GroupOrderSetup";
import MyGroups from "./Component/MyGroups";
import NearbyGroups from "./Component/NearbyGroups";

import ProtectedRoute from "./Auth/ProtectedRoute";
import OrderPageWrapper from "./Component/OrderPageWrapper";
import MyOrders from "./Component/MyOrders";
import NormalHeader from "./Component/NormalHeader";


function App() {
  return (
    <Router>
      <div className="app">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
        />
        <Routes>
          <Route path="/" element={[<NormalHeader />, <NavBar />, <Home />, <Footer />]} />
          <Route path="/feedbacksubmitted" element={[<Headergreen />, <NavBarg />, <FSubmitted />]} />
          <Route path="/feedback" element={[<Headergreen />, <NavBarg />, <Feedback />, <Footer />]} />
          <Route path="/submitted" element={[<Headergreen />, <Submitted />]} />
          <Route path="/seller" element={[<Headergreen />, <SellerSection />, <Footer />]} />
          <Route path="/thanks" element={[<Header />, <Thanks />]} />
          <Route path="/orders" element={[<Headergreen />, <Orders />, <Footer />]} />
          <Route path="/sustainability" element={[<Headergreen />, <SustainabilityReportsSection />, <Footer />]} />
          <Route path="/education" element={[<Headergreen />, <EducationSection />, <Footer />]} />
          <Route path="/green" element={[<Headergreen />, <GreenProducts />, <Footer />]} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/checkout" element={[<Headergreen />, <Checkout />, <Footer />]} />
          <Route path="/greendashboard" element={[<Headergreen />, <Dashboard />, <Footer />]} />
          <Route path="/product" element={[<Headergreen />, <NavBarg />, <ProductDetails />, <Footer />]} />
          <Route path="/product1" element={[<Headergreen />, <NavBarg />, <ProductDetails1 />, <Footer />]} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/standardDashboard" element={[<Headergreen />, <Dashboard />, <Footer />]} />
          {/* ✅ Protected Routes */}
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <Header />
                <MyOrders />
                <Footer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery"
            element={
              <ProtectedRoute>
                <OrderPageWrapper />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-confirmation"
            element={

              <ProtectedRoute>
                {
                  [<Headergreen />, <OrderConfirmationWrapper />]
                }

              </ProtectedRoute>
            }
          />
          <Route
            path="/group-order-setup"
            element={
              <ProtectedRoute>
              {
                  [<Headergreen />, <GroupOrderSetup />,<Footer/>]
              }
                
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-groups"
            element={
              <ProtectedRoute>
              {
                  [<Headergreen />,<MyGroups />, <Footer />]
              }
                
              </ProtectedRoute>
            }
          />
          <Route
            path="/nearby-groups"
            element={
              <ProtectedRoute>
              {
                  [<Headergreen />, <NearbyGroups />,<Footer/>]
              }
                
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;