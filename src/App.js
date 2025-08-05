import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import BloodTypeChart from "./components/BloodTypeChart";
import BloodStockChart from "./components/BloodStockChart";
import DonationFrequencyChart from "./components/DonationFrequencyChart";
import ExpiryPredictionForm from "./components/ExpiryPredictionForm";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route
            path="/"
            element={
              <div className="container mt-4">
                <div className="text-center mb-4">
                  <h1 className="display-5">Blood Bank Dashboard</h1>
                </div>

                {/* Add vertical (gy) and horizontal (gx) spacing */}
                <div className="row gy-3 gx-10">
                  <div className="col-md-6">
                    <div className="card p-3 shadow">
                      <BloodTypeChart />
                    </div>
                     </div>
                   <div className="card shadow-sm p-4 h-100">
                   </div>
                   
                  <div className="col-md-6">
                    <div className="card p-3 shadow">
                      <BloodStockChart />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card p-3 shadow">
                      <DonationFrequencyChart />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="card p-3 shadow">
                      <ExpiryPredictionForm />
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
