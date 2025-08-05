import React, { useState } from "react";
import axios from "axios";

const ExpiryPredictionForm = () => {
  const [formData, setFormData] = useState({
    donation_day: "",
    donation_month: "",
    blood_type: "",
    collection_volume_ml: "",
    hemoglobin_g_dl: "",
    donor_age: ""
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPrediction(null);

    try {
      const response = await axios.post("http://localhost:8000/api/predict_expiry", {
        donation_day: parseInt(formData.donation_day),
        donation_month: parseInt(formData.donation_month),
        blood_type: formData.blood_type,
        collection_volume_ml: parseFloat(formData.collection_volume_ml),
        hemoglobin_g_dl: parseFloat(formData.hemoglobin_g_dl),
        donor_age: parseInt(formData.donor_age)
      });
      setPrediction(response.data.predicted_shelf_life_days);
    } catch (err) {
      console.error(err);
      setError("Prediction failed. Check the input or backend.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Predict Blood Expiry</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          name="donation_day"
          placeholder="Donation Day"
          value={formData.donation_day}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="donation_month"
          placeholder="Donation Month"
          value={formData.donation_month}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="blood_type"
          placeholder="Blood Type (e.g. O+, A-)"
          value={formData.blood_type}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          step="0.1"
          name="collection_volume_ml"
          placeholder="Collection Volume (ml)"
          value={formData.collection_volume_ml}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          step="0.1"
          name="hemoglobin_g_dl"
          placeholder="Hemoglobin (g/dL)"
          value={formData.hemoglobin_g_dl}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="donor_age"
          placeholder="Donor Age"
          value={formData.donor_age}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Predict
        </button>
      </form>

      {prediction !== null && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded text-center">
          Predicted Shelf Life: <strong>{prediction} days</strong>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default ExpiryPredictionForm;
