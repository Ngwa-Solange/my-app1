import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Heart, Activity, Plus, Minus, AlertTriangle, CheckCircle, Clock, Filter, RefreshCw, TrendingUp, PieChart, BarChart3, User, Upload, Download, Moon, Sun } from 'lucide-react';
import * as Plotly from 'plotly.js-dist';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Mock data
const mockBloodStocks = [
  { id: 1, bloodType: 'A+', quantity: 25, donorInfo: 'John Doe', dateAdded: '2025-08-05', status: 'In', location: 'Main Hospital' },
  { id: 2, bloodType: 'O+', quantity: 8, donorInfo: 'Jane Smith', dateAdded: '2025-08-04', status: 'In', location: 'Emergency Ward' },
  { id: 3, bloodType: 'B-', quantity: 15, donorInfo: 'Mike Brown', dateAdded: '2025-08-03', status: 'In', location: 'ICU' },
  { id: 4, bloodType: 'AB+', quantity: 5, donorInfo: 'Sarah Lee', dateAdded: '2025-08-02', status: 'In', location: 'Surgery' },
  { id: 5, bloodType: 'A-', quantity: 18, donorInfo: 'Emily Davis', dateAdded: '2025-08-01', status: 'In', location: 'Main Hospital' },
  { id: 6, bloodType: 'O-', quantity: 12, donorInfo: 'Tom Wilson', dateAdded: '2025-08-05', status: 'In', location: 'Emergency Ward' },
  { id: 7, bloodType: 'B+', quantity: 22, donorInfo: 'Lisa Taylor', dateAdded: '2025-08-04', status: 'In', location: 'ICU' },
  { id: 8, bloodType: 'AB-', quantity: 7, donorInfo: 'David Clark', dateAdded: '2025-08-03', status: 'In', location: 'Surgery' },
];

const mockForecastData = {
  dates: ['2025-08-05', '2025-08-06', '2025-08-07', '2025-08-08', '2025-08-09', '2025-08-10', '2025-08-11'],
  'A+': [25, 23, 21, 19, 17, 15, 13],
  'O+': [8, 6, 4, 2, 1, 0, -2],
  'B-': [15, 14, 13, 12, 11, 10, 9],
  'AB+': [5, 4, 3, 2, 1, 0, -1],
  'A-': [18, 17, 16, 15, 14, 13, 12],
  'O-': [12, 11, 10, 9, 8, 7, 6],
  'B+': [22, 21, 20, 19, 18, 17, 16],
  'AB-': [7, 6, 5, 4, 3, 2, 1],
};

const mockBloodTypeDistribution = [
  { bloodType: 'O+', percentage: 38, quantity: 45, color: '#ef4444' },
  { bloodType: 'A+', percentage: 34, quantity: 40, color: '#f97316' },
  { bloodType: 'B+', percentage: 9, quantity: 22, color: '#eab308' },
  { bloodType: 'AB+', percentage: 3, quantity: 5, color: '#22c55e' },
  { bloodType: 'O-', percentage: 7, quantity: 12, color: '#3b82f6' },
  { bloodType: 'A-', percentage: 6, quantity: 18, color: '#8b5cf6' },
  { bloodType: 'B-', percentage: 2, quantity: 15, color: '#ec4899' },
  { bloodType: 'AB-', percentage: 1, quantity: 7, color: '#06b6d4' },
];

const mockDonationData = {
  dates: ['2025-07-29', '2025-07-30', '2025-07-31', '2025-08-01', '2025-08-02', '2025-08-03', '2025-08-04', '2025-08-05'],
  donations: [12, 8, 15, 20, 18, 22, 16, 14],
  transfusions: [8, 12, 10, 15, 16, 18, 14, 12],
};

// Dark Mode Context
const DarkModeContext = React.createContext();

const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(prev => !prev);
  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Navigation Component
const Navigation = () => {
  const { darkMode, toggleDarkMode } = React.useContext(DarkModeContext);
  return (
    <nav className="bg-gradient-to-r from-red-600 to-blue-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Heart className="w-8 h-8 text-white" />
          <h1 className="text-2xl font-bold text-white">Blood Bank Dashboard</h1>
        </div>
        <div className="flex space-x-4 items-center">
          <Link to="/" className="text-white hover:text-gray-200">Dashboard</Link>
          <Link to="/inventory" className="text-white hover:text-gray-200">Inventory</Link>
          <Link to="/add-remove" className="text-white hover:text-gray-200">Add/Remove</Link>
          <Link to="/forecast" className="text-white hover:text-gray-200">Forecast</Link>
          <Link to="/upload" className="text-white hover:text-gray-200">Upload</Link>
          <Link to="/profile" className="text-white hover:text-gray-200">Profile</Link>
          <button onClick={toggleDarkMode} className="text-white hover:text-gray-200">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

// Dashboard Page
const Dashboard = () => {
  const [bloodStocks, setBloodStocks] = useState(mockBloodStocks);
  const totalStock = bloodStocks.reduce((sum, stock) => sum + stock.quantity, 0);
  const bloodAddedToday = mockBloodStocks.filter(stock => stock.dateAdded === '2025-08-05').reduce((sum, stock) => sum + stock.quantity, 0);
  const bloodUsedToday = mockDonationData.transfusions[mockDonationData.dates.indexOf('2025-08-05')] || 0;
  const lowStockAlerts = bloodStocks.filter(stock => stock.quantity < 10);

  useEffect(() => {
    lowStockAlerts.forEach(stock => {
      toast.error(`Alert: ${stock.bloodType} is below 10 units!`, { autoClose: 5000 });
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-700">Total Blood Stock</h3>
          <p className="text-3xl font-bold text-red-600">{totalStock} units</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <Plus className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-700">Blood Added Today</h3>
          <p className="text-3xl font-bold text-green-600">{bloodAddedToday} units</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <Minus className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-700">Blood Used Today</h3>
          <p className="text-3xl font-bold text-red-600">{bloodUsedToday} units</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <Activity className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-700">Predicted Demand</h3>
          <p className="text-3xl font-bold text-blue-600">{Math.max(...Object.values(mockForecastData).filter(v => Array.isArray(v)).flat())} units</p>
        </div>
      </div>
      <BloodTypeDistribution />
      <HistoricalStockChart />
      <DonationTrendsChart />
    </div>
  );
};

// Inventory Table Page
const InventoryTable = () => {
  const [bloodStocks, setBloodStocks] = useState(mockBloodStocks);
  const [filteredStocks, setFilteredStocks] = useState(mockBloodStocks);
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const bloodTypes = ['ALL', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const statuses = ['ALL', 'In', 'Out'];

  useEffect(() => {
    let filtered = bloodStocks;
    if (filterType !== 'ALL') filtered = filtered.filter(stock => stock.bloodType === filterType);
    if (filterStatus !== 'ALL') filtered = filtered.filter(stock => stock.status === filterStatus);
    if (dateRange.start) filtered = filtered.filter(stock => new Date(stock.dateAdded) >= new Date(dateRange.start));
    if (dateRange.end) filtered = filtered.filter(stock => new Date(stock.dateAdded) <= new Date(dateRange.end));
    if (searchTerm) filtered = filtered.filter(stock => stock.donorInfo.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredStocks(filtered);
  }, [filterType, filterStatus, dateRange, searchTerm, bloodStocks]);

  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(filteredStocks);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory');
    XLSX.writeFile(wb, 'blood_inventory.csv');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID', 'Blood Type', 'Quantity', 'Donor Info', 'Date Added', 'Status', 'Location']],
      body: filteredStocks.map(stock => [stock.id, stock.bloodType, stock.quantity, stock.donorInfo, stock.dateAdded, stock.status, stock.location]),
    });
    doc.save('blood_inventory.pdf');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center"><Heart className="w-6 h-6 text-red-500 mr-2" /> Inventory</h2>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2">
              {bloodTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2">
              {statuses.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
            <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2" />
            <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by donor..." className="border border-gray-300 rounded-lg px-3 py-2" />
            <button onClick={exportToCSV} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"><Download className="w-4 h-4 mr-2" /> CSV</button>
            <button onClick={exportToPDF} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"><Download className="w-4 h-4 mr-2" /> PDF</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Blood Type</th>
                <th className="py-3 px-4 text-left">Quantity</th>
                <th className="py-3 px-4 text-left">Donor Info</th>
                <th className="py-3 px-4 text-left">Date Added</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Location</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map(stock => (
                <tr key={stock.id} className="border-b">
                  <td className="py-3 px-4">{stock.id}</td>
                  <td className="py-3 px-4">{stock.bloodType}</td>
                  <td className="py-3 px-4">{stock.quantity}</td>
                  <td className="py-3 px-4">{stock.donorInfo}</td>
                  <td className="py-3 px-4">{stock.dateAdded}</td>
                  <td className="py-3 px-4">{stock.status}</td>
                  <td className="py-3 px-4">{stock.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Add/Remove Blood Page
const AddRemoveBlood = () => {
  const [activeTab, setActiveTab] = useState('Add');
  const schema = yup.object().shape({
    bloodType: yup.string().required('Blood type is required'),
    quantity: yup.number().positive('Quantity must be positive').required('Quantity is required'),
    donorId: yup.string().optional(),
    date: yup.string().required('Date is required'),
    staffName: yup.string().required('Staff name is required'),
    reason: yup.string().when('actionType', {
      is: 'Remove',
      then: yup.string().required('Reason is required'),
      otherwise: yup.string().optional(),
    }),
    patientId: yup.string().optional(),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { bloodType: 'A+', date: new Date().toISOString().split('T')[0], actionType: activeTab },
  });

  const onSubmit = (data) => {
    toast.success(`${data.actionType}ed ${data.quantity} units of ${data.bloodType}`);
    reset();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex border-b mb-4">
          <button onClick={() => setActiveTab('Add')} className={`px-4 py-2 ${activeTab === 'Add' ? 'border-b-2 border-blue-600' : ''}`}>Add Blood</button>
          <button onClick={() => setActiveTab('Remove')} className={`px-4 py-2 ${activeTab === 'Remove' ? 'border-b-2 border-blue-600' : ''}`}>Remove Blood</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('actionType')} value={activeTab} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Blood Type</label>
              <select {...register('bloodType')} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => <option key={type} value={type}>{type}</option>)}
              </select>
              {errors.bloodType && <p className="text-red-600">{errors.bloodType.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Quantity</label>
              <input type="number" {...register('quantity')} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              {errors.quantity && <p className="text-red-600">{errors.quantity.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Donor ID (optional)</label>
              <input type="text" {...register('donorId')} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Date</label>
              <input type="date" {...register('date')} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              {errors.date && <p className="text-red-600">{errors.date.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Staff Name</label>
              <input type="text" {...register('staffName')} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              {errors.staffName && <p className="text-red-600">{errors.staffName.message}</p>}
            </div>
            {activeTab === 'Remove' && (
              <>
                <div>
                  <label className="block text-sm font-medium">Reason</label>
                  <select {...register('reason')} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    {['Transfusion', 'Surgery', 'Emergency', 'Expired', 'Testing', 'Transfer'].map(reason => <option key={reason} value={reason}>{reason}</option>)}
                  </select>
                  {errors.reason && <p className="text-red-600">{errors.reason.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium">Patient ID (optional)</label>
                  <input type="text" {...register('patientId')} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
              </>
            )}
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center">
            {activeTab === 'Add' ? <Plus className="w-4 h-4 mr-2" /> : <Minus className="w-4 h-4 mr-2" />}
            {activeTab} Blood
          </button>
        </form>
      </div>
    </div>
  );
};

// Forecast & Analytics Page
const ForecastAnalytics = () => {
  const recommendations = [
    'Stock more O+ in next 7 days based on historical data',
    'Low usage of AB- last 30 days. Delay restocking.',
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <ForecastChart />
      <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
        <h2 className="text-xl font-bold text-gray-800 flex items-center"><Activity className="w-6 h-6 text-blue-500 mr-2" /> Recommendations</h2>
        <ul className="mt-4 space-y-2">
          {recommendations.map((rec, index) => (
            <li key={index} className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> {rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Upload Dataset Page
const UploadDataset = () => {
  const [previewData, setPreviewData] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = XLSX.read(event.target.result, { type: 'binary' });
      const sheetName = data.SheetNames[0];
      const sheet = data.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      setPreviewData(parsedData.slice(0, 5));
      toast.info('Prediction in progress...', { autoClose: 2000 });
      setTimeout(() => {
        toast.success('Prediction completed!');
        setUploading(false);
      }, 2000);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 flex items-center"><Upload className="w-6 h-6 text-blue-500 mr-2" /> Upload Dataset</h2>
        <input type="file" accept=".csv,.xlsx" onChange={handleFileUpload} className="mt-4" />
        {uploading && <p className="mt-4 flex items-center"><RefreshCw className="w-5 h-5 animate-spin mr-2" /> Prediction in progress...</p>}
        {previewData && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Data Preview</h3>
            <table className="w-full mt-2">
              <tbody>
                {previewData.map((row, index) => (
                  <tr key={index} className="border-b">
                    {row.map((cell, cellIndex) => <td key={cellIndex} className="py-2 px-4">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// User Profile Page
const UserProfile = () => {
  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').optional(),
    notifications: yup.boolean(),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: 'John Doe', email: 'john@example.com', notifications: true },
  });

  const onSubmit = (data) => {
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto">
        <h2 className="text-xl font-bold text-gray-800 flex items-center"><User className="w-6 h-6 text-blue-500 mr-2" /> Profile Settings</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input type="text" {...register('name')} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            {errors.name && <p className="text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" {...register('email')} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            {errors.email && <p className="text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input type="password" {...register('password')} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            {errors.password && <p className="text-red-600">{errors.password.message}</p>}
          </div>
          <div>
            <label className="flex items-center">
              <input type="checkbox" {...register('notifications')} className="mr-2" />
              Receive Notifications
            </label>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

// Components from the original code (unchanged)
const HistoricalStockChart = () => {
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistoricalData();
  }, []);

  const fetchHistoricalData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setHistoricalData({
        dates: ['2025-07-29', '2025-07-30', '2025-07-31', '2025-08-01', '2025-08-02', '2025-08-03', '2025-08-04', '2025-08-05'],
        'A+': [20, 22, 19, 25, 23, 26, 24, 25],
        'O+': [15, 12, 10, 8, 6, 9, 7, 8],
        'B-': [18, 16, 17, 15, 14, 16, 15, 15],
        'AB+': [8, 6, 4, 5, 3, 7, 6, 5],
        'A-': [22, 20, 19, 18, 17, 19, 18, 18],
        'O-': [16, 14, 13, 12, 11, 13, 12, 12],
        'B+': [25, 23, 24, 22, 21, 23, 22, 22],
        'AB-': [10, 8, 7, 7, 6, 8, 7, 7],
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch historical data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (historicalData && !loading) {
      const traces = Object.keys(historicalData).filter(key => key !== 'dates').map(bloodType => ({
        x: historicalData.dates,
        y: historicalData[bloodType],
        type: 'scatter',
        mode: 'lines+markers',
        name: bloodType,
        line: { width: 3 },
        marker: { size: 6 },
      }));

      const layout = {
        title: { text: 'Historical Stock Trends (Past 7 Days)', font: { size: 18, color: '#374151' } },
        xaxis: { title: 'Date', gridcolor: '#f3f4f6' },
        yaxis: { title: 'Stock Quantity (Units)', gridcolor: '#f3f4f6' },
        plot_bgcolor: 'white',
        paper_bgcolor: 'white',
        margin: { t: 60, r: 20, b: 60, l: 60 },
        showlegend: true,
        legend: { orientation: 'h', x: 0, y: -0.2 },
      };

      const config = { displayModeBar: true, displaylogo: false, modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'] };
      Plotly.newPlot('historical-chart', traces, layout, config);
    }
  }, [historicalData, loading]);

  if (loading) return <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-center py-8"><RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" /> Loading...</div>;
  if (error) return (
    <div className="bg-white p-6 rounded-xl shadow-lg text-center py-8">
      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <p className="text-red-600 mb-4">{error}</p>
      <button onClick={fetchHistoricalData} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Retry</button>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center space-x-2 mb-6"><TrendingUp className="w-6 h-6 text-green-500" /><h2 className="text-xl font-bold text-gray-800">Stock Trends Over Time</h2></div>
      <div id="historical-chart" className="w-full h-96"></div>
    </div>
  );
};

const BloodTypeDistribution = () => {
  const [distributionData, setDistributionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDistributionData();
  }, []);

  const fetchDistributionData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      setDistributionData(mockBloodTypeDistribution);
      setError(null);
    } catch (err) {
      setError('Failed to fetch distribution data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (distributionData && !loading) {
      const trace = [{
        labels: distributionData.map(item => item.bloodType),
        values: distributionData.map(item => item.quantity),
        type: 'pie',
        marker: { colors: distributionData.map(item => item.color) },
        textinfo: 'label+percent',
        textposition: 'outside',
        hovertemplate: '<b>%{label}</b><br>Quantity: %{value} units<br>Percentage: %{percent}<extra></extra>',
      }];

      const layout = {
        title: { text: 'Current Blood Type Distribution', font: { size: 18, color: '#374151' } },
        plot_bgcolor: 'white',
        paper_bgcolor: 'white',
        margin: { t: 60, r: 20, b: 60, l: 20 },
        showlegend: true,
        legend: { orientation: 'v', x: 1.02, y: 0.5 },
      };

      const config = { displayModeBar: true, displaylogo: false, modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'] };
      Plotly.newPlot('distribution-chart', trace, layout, config);
    }
  }, [distributionData, loading]);

  if (loading) return <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-center py-8"><RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" /> Loading...</div>;
  if (error) return (
    <div className="bg-white p-6 rounded-xl shadow-lg text-center py-8">
      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <p className="text-red-600 mb-4">{error}</p>
      <button onClick={fetchDistributionData} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Retry</button>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center space-x-2 mb-6"><PieChart className="w-6 h-6 text-orange-500" /><h2 className="text-xl font-bold text-gray-800">Blood Type Availability</h2></div>
      <div id="distribution-chart" className="w-full h-96"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {distributionData && distributionData.slice(0, 4).map(item => (
          <div key={item.bloodType} className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">{item.bloodType}</div>
            <div className="text-lg font-semibold">{item.quantity} units</div>
            <div className="text-sm text-gray-600">{item.percentage}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DonationTrendsChart = () => {
  const [donationData, setDonationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDonationData();
  }, []);

  const fetchDonationData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 700));
      setDonationData(mockDonationData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch donation data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (donationData && !loading) {
      const traces = [
        { x: donationData.dates, y: donationData.donations, type: 'bar', name: 'Donations', marker: { color: '#22c55e' }, hovertemplate: '<b>Donations</b><br>Date: %{x}<br>Units: %{y}<extra></extra>' },
        { x: donationData.dates, y: donationData.transfusions, type: 'bar', name: 'Transfusions', marker: { color: '#ef4444' }, hovertemplate: '<b>Transfusions</b><br>Date: %{x}<br>Units: %{y}<extra></extra>' },
      ];

      const layout = {
        title: { text: 'Donations vs Transfusions Over Time', font: { size: 18, color: '#374151' } },
        xaxis: { title: 'Date', gridcolor: '#f3f4f6' },
        yaxis: { title: 'Units', gridcolor: '#f3f4f6' },
        plot_bgcolor: 'white',
        paper_bgcolor: 'white',
        margin: { t: 60, r: 20, b: 60, l: 60 },
        showlegend: true,
        legend: { orientation: 'h', x: 0, y: -0.2 },
        barmode: 'group',
      };

      const config = { displayModeBar: true, displaylogo: false, modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'] };
      Plotly.newPlot('donation-chart', traces, layout, config);
    }
  }, [donationData, loading]);

  if (loading) return <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-center py-8"><RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" /> Loading...</div>;
  if (error) return (
    <div className="bg-white p-6 rounded-xl shadow-lg text-center py-8">
      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <p className="text-red-600 mb-4">{error}</p>
      <button onClick={fetchDonationData} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Retry</button>
    </div>
  );

  const totalDonations = donationData ? donationData.donations.reduce((a, b) => a + b, 0) : 0;
  const totalTransfusions = donationData ? donationData.transfusions.reduce((a, b) => a + b, 0) : 0;
  const netChange = totalDonations - totalTransfusions;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center space-x-2 mb-6"><BarChart3 className="w-6 h-6 text-blue-500" /><h2 className="text-xl font-bold text-gray-800">Donation & Usage Trends</h2></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg text-center border-l-4 border-green-500">
          <div className="text-2xl font-bold text-green-600">{totalDonations}</div>
          <div className="text-sm text-green-700">Total Donations (7 days)</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center border-l-4 border-red-500">
          <div className="text-2xl font-bold text-red-600">{totalTransfusions}</div>
          <div className="text-sm text-red-700">Total Transfusions (7 days)</div>
        </div>
        <div className={`p-4 rounded-lg text-center border-l-4 ${netChange >= 0 ? 'bg-blue-50 border-blue-500' : 'bg-yellow-50 border-yellow-500'}`}>
          <div className={`text-2xl font-bold ${netChange >= 0 ? 'text-blue-600' : 'text-yellow-600'}`}>{netChange >= 0 ? '+' + netChange : netChange}</div>
          <div className={`text-sm ${netChange >= 0 ? 'text-blue-700' : 'text-yellow-700'}`}>Net Change (7 days)</div>
        </div>
      </div>
      <div id="donation-chart" className="w-full h-96"></div>
    </div>
  );
};

const ForecastChart = () => {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchForecastData();
  }, []);

  const fetchForecastData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setForecastData(mockForecastData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch forecast data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (forecastData && !loading) {
      const traces = Object.keys(forecastData).filter(key => key !== 'dates').map(bloodType => ({
        x: forecastData.dates,
        y: forecastData[bloodType],
        type: 'scatter',
        mode: 'lines+markers',
        name: bloodType,
        line: { width: 3 },
        marker: { size: 6 },
      }));

      const layout = {
        title: { text: '7-Day Blood Stock Forecast', font: { size: 18, color: '#374151' } },
        xaxis: { title: 'Date', gridcolor: '#f3f4f6' },
        yaxis: { title: 'Quantity (Units)', gridcolor: '#f3f4f6' },
        plot_bgcolor: 'white',
        paper_bgcolor: 'white',
        margin: { t: 60, r: 20, b: 60, l: 60 },
        showlegend: true,
        legend: { orientation: 'h', x: 0, y: -0.2 },
      };

      const config = { displayModeBar: true, displaylogo: false, modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'] };
      Plotly.newPlot('forecast-chart', traces, layout, config);
    }
  }, [forecastData, loading]);

  if (loading) return <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-center py-8"><RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" /> Loading...</div>;
  if (error) return (
    <div className="bg-white p-6 rounded-xl shadow-lg text-center py-8">
      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <p className="text-red-600 mb-4">{error}</p>
      <button onClick={fetchForecastData} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Retry</button>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center space-x-2 mb-6"><Activity className="w-6 h-6 text-blue-500" /><h2 className="text-xl font-bold text-gray-800">AI Forecast</h2></div>
      <div id="forecast-chart" className="w-full h-96"></div>
    </div>
  );
};

// Main App Component
const App = () => {
  const { darkMode } = React.useContext(DarkModeContext);

  return (
    <div className={darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-red-50'}>
      <Router>
        <Navigation />
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<InventoryTable />} />
          <Route path="/add-remove" element={<AddRemoveBlood />} />
          <Route path="/forecast" element={<ForecastAnalytics />} />
          <Route path="/upload" element={<UploadDataset />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
        <div className="text-center mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">© 2025 AI Blood Bank Management System - Saving lives through intelligent inventory management</p>
        </div>
      </Router>
    </div>
  );
};

export default () => (
  <DarkModeProvider>
    <App />
  </DarkModeProvider>
);