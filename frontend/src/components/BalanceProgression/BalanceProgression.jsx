import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Chart } from "primereact/chart";
import SidebarComponent from "../SidebarComponent/SidebarComponent";
import "./BalanceProgression.css";
import { jwtDecode } from "jwt-decode";

export default function BalanceProgression() {
  const [progressionData, setProgressionData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [categoryPieChartData, setCategoryPieChartData] = useState({});
  const [subcategoryPieChartData, setSubategoryPieChartData] = useState({});
  const [loading, setLoading] = useState(false);
  const [intervalType, setIntervalType] = useState("MTD"); // Default to MTD
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const apiUrl = import.meta.env.VITE_API_URL;

  const intervalOptions = [
    { label: "Month to Date (MTD)", value: "MTD" },
    { label: "Year to Date (YTD)", value: "YTD" },
    { label: "Custom Interval", value: "CUSTOM" },
  ];

  const fetchBalanceProgression = async (startDate, endDate) => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const response = await axios.get(`${apiUrl}/v1/balance_progression`, {
          params: { userId, startDate, endDate },
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        setProgressionData(data);

        const sortedData = [...data].sort(
          (a, b) => new Date(a.movement_date) - new Date(b.movement_date)
        );

        // Line Chart Data
        const chartLabels = sortedData.map(
          (item) => item.movement_date.split("T")[0]
        );
        const chartBalances = sortedData.map(
          (item) => item.balance_after_movement
        );

        setChartData({
          labels: chartLabels,
          datasets: [
            {
              label: "Balance Progression",
              data: chartBalances,
              fill: false,
              borderColor: "#42A5F5", // Blue color for the line
              tension: 0.4,
            },
          ],
        });

        // Fetch category-wise expenditure for the pie chart
        fetchCategoryData(userId, startDate, endDate);
        fetchSubategoryData(userId, startDate, endDate);
      }
    } catch (err) {
      console.error("Error fetching balance progression:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryData = async (userId, startDate, endDate) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${apiUrl}/v1/category_spending`, {
        params: { userId, startDate, endDate },
        headers: { Authorization: `Bearer ${token}` },
      });

      const categoryData = response.data;

      const pieLabels = categoryData.map((item) => item.category); // Category Names
      const pieValues = categoryData.map((item) => item.total_spent); // Total Spent

      const documentStyle = getComputedStyle(document.documentElement);

      setCategoryPieChartData({
        labels: pieLabels,
        datasets: [
          {
            data: pieValues,
            backgroundColor: [documentStyle.getPropertyValue("--red-500")],
            label: "Category Spending",
          },
        ],
      });
    } catch (err) {
      console.error("Error fetching category data:", err);
    }
  };

  const fetchSubategoryData = async (userId, startDate, endDate) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${apiUrl}/v1/subcategory_spending`, {
        params: { userId, startDate, endDate },
        headers: { Authorization: `Bearer ${token}` },
      });

      const subcategoryData = response.data;

      const pieLabels = subcategoryData.map((item) => item.subcategory); // Category Names
      const pieValues = subcategoryData.map((item) => item.total_spent); // Total Spent

      const documentStyle = getComputedStyle(document.documentElement);

      setSubategoryPieChartData({
        labels: pieLabels,
        datasets: [
          {
            data: pieValues,
            backgroundColor: [documentStyle.getPropertyValue("--red-500")],
            label: "Category Spending",
          },
        ],
      });
    } catch (err) {
      console.error("Error fetching category data:", err);
    }
  };

  const handleIntervalChange = (value) => {
    setIntervalType(value);

    // Reset values when interval changes
    setSelectedYear(new Date());
    setSelectedMonth(new Date());
    setCustomStartDate(null);
    setCustomEndDate(null);

    if (value === "MTD" || value === "YTD") {
      setProgressionData([]);
      setChartData({});
      setCategoryPieChartData({});
    }
  };

  const handleMTDSubmit = () => {
    if (selectedMonth) {
      const startDate = new Date(
        selectedMonth.getFullYear(),
        selectedMonth.getMonth(),
        1
      )
        .toISOString()
        .split("T")[0];
      const endDate =
        selectedMonth.getMonth() === new Date().getMonth() &&
        selectedMonth.getFullYear() === new Date().getFullYear()
          ? new Date().toISOString().split("T")[0]
          : new Date(
              selectedMonth.getFullYear(),
              selectedMonth.getMonth() + 1,
              0
            )
              .toISOString()
              .split("T")[0];

      fetchBalanceProgression(startDate, endDate);
    } else {
      alert("Please select a month.");
    }
  };

  const handleYTDSubmit = () => {
    if (selectedYear) {
      const startDate = new Date(selectedYear.getFullYear(), 0, 1)
        .toISOString()
        .split("T")[0];
      const endDate =
        selectedYear.getFullYear() === new Date().getFullYear()
          ? new Date().toISOString().split("T")[0]
          : new Date(selectedYear.getFullYear(), 11, 31)
              .toISOString()
              .split("T")[0];

      fetchBalanceProgression(startDate, endDate);
    } else {
      alert("Please select a year.");
    }
  };

  const handleCustomIntervalSubmit = () => {
    if (customStartDate && customEndDate) {
      const startDate = customStartDate.toISOString().split("T")[0];
      const endDate = customEndDate.toISOString().split("T")[0];
      fetchBalanceProgression(startDate, endDate);
    } else {
      alert("Please select both start and end dates.");
    }
  };

  const statusTemplate = (rowData) => {
    return rowData.type === 1 ? (
      <i
        className="pi pi-arrow-up text-green-500"
        style={{ fontSize: "1.5rem" }}
      ></i> // Deposit
    ) : (
      <i
        className="pi pi-arrow-down text-red-500"
        style={{ fontSize: "1.5rem" }}
      ></i> // Expense
    );
  };

  useEffect(() => {
    handleMTDSubmit();
  }, []);

  return (
    <div>
      <SidebarComponent />
      <div className="dropdown-container">
        <label htmlFor="intervalType">Select Interval:</label>
        <Dropdown
          value={intervalType}
          options={intervalOptions}
          onChange={(e) => handleIntervalChange(e.value)}
          placeholder="Select Interval"
          className="p-dropdown"
        />

        {intervalType === "MTD" && (
          <div className="date-picker">
            <label htmlFor="selectedMonth">Select Month:</label>
            <Calendar
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.value)}
              placeholder="Select Month"
              view="month"
              dateFormat="mm/yy"
              showButtonBar
            />
            <button onClick={handleMTDSubmit} className="p-button p-component">
              Fetch MTD
            </button>
          </div>
        )}
        {intervalType === "YTD" && (
          <div className="date-picker">
            <label htmlFor="selectedYear">Select Year:</label>
            <Calendar
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.value)}
              placeholder="Select Year"
              view="year"
              dateFormat="yy"
              showButtonBar
            />
            <button onClick={handleYTDSubmit} className="p-button p-component">
              Fetch YTD
            </button>
          </div>
        )}

        {intervalType === "CUSTOM" && (
          <div className="custom-date-picker">
            <label htmlFor="customStartDate">Start Date:</label>
            <Calendar
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.value)}
              placeholder="Select Start Date"
              showButtonBar
            />
            <label htmlFor="customEndDate">End Date:</label>
            <Calendar
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.value)}
              placeholder="Select End Date"
              showButtonBar
            />
            <button
              onClick={handleCustomIntervalSubmit}
              className="p-button p-component"
            >
              Fetch Custom Interval
            </button>
          </div>
        )}
      </div>

      {/* Line Chart Section */}
      <div className="chart-container">
        <Chart type="line" data={chartData} className="w-8 " />
      </div>

      {/* Pie Chart Section */}
      <div className="chart-container">
        <Chart type="bar" data={categoryPieChartData} className="w-6" />
      </div>
      <div className="chart-container">
        <Chart type="bar" data={subcategoryPieChartData} className="w-6" />
      </div>
    </div>
  );
}
