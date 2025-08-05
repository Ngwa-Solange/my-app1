import React from "react";
import BloodTypeChart from "../components/BloodTypeChart";
import BloodStockChart from "../components/BloodStockChart";
import DonationFrequencyChart from "../components/DonationFrequencyChart";
import ExpiryPredictionForm from "../components/ExpiryPredictionForm";

function MainLayout() {
  return (
    <div className="container mt-4">
      {/* Header with Logo and Title */}
      <header className="text-center mb-5">
        <img src="/logo.png" alt="Logo" style={{ height: "60px" }} />
        <h1 className="display-5 mt-3 fw-bold">Blood Bank Dashboard</h1>
        <p className="text-muted">Real-time monitoring & predictions</p>
      </header>

      {/* Dashboard Grid */}
      <div className="row gy-4 gx-4">
        {/* Blood Type Chart */}
        <div className="col-lg-6 col-md-12">
          <div className="card shadow-sm p-4 h-100">
            <BloodTypeChart />
          </div>
        </div>

        {/* Blood Stock Chart */}
        <div className="col-lg-6 col-md-12">
          <div className="card shadow-sm p-4 h-100">
            <BloodStockChart />
          </div>
        </div>
        <div className="col-lg-6 col-md-12">
          <div className="card shadow-sm p-4 h-100">
          </div>
        </div>


        {/* Donation Frequency Chart */}
        <div className="col-lg-6 col-md-12">
          <div className="card shadow-sm p-4 h-100">
            <DonationFrequencyChart />
          </div>
        </div>

        {/* Expiry Prediction Form */}
        <div className="col-12">
          <div className="card shadow-sm p-4">
            <ExpiryPredictionForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
