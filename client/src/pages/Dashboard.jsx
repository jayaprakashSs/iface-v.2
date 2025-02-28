import React, { useState, useEffect } from "react";
import MonthlyChart from "../charts/MonthlyChart";
import DailyChart from "../charts/DailyChart";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FaUsers, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton, Box, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const dashboardData = {
  totalEmployees: 150,
  presentEmployees: 120,
  absentEmployees: 30,
  presentPercentage: 80,
  absentPercentage: 20,
  lateEmployees: 5,
  latePercentage: 3,
  monthlyAttendanceData: [75, 80, 85, 90, 95, 85, 80, 78, 88, 92, 96, 98],
  dailyAttendanceData: [80, 85, 82, 90, 88, 85, 91],
  dailyLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  monthlyLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

const Dashboard = ({ pendingPayments, closePendingPayment }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pendingPayments.length > 0) setOpen(true);
  }, [pendingPayments]);

  const monthlyChartData = {
    labels: dashboardData.monthlyLabels,
    datasets: [
      {
        label: "Attendance Trend (%)",
        data: dashboardData.monthlyAttendanceData,
        backgroundColor: "rgba(34, 202, 236, 0.2)",
        borderColor: "rgba(34, 202, 236, 1)",
        borderWidth: 2,
      },
    ],
  };

  const dailyChartData = {
    labels: dashboardData.dailyLabels,
    datasets: [
      {
        label: "Daily Attendance (%)",
        data: dashboardData.dailyAttendanceData,
        backgroundColor: "rgba(52, 152, 219, 0.2)",
        borderColor: "rgba(52, 152, 219, 1)",
        borderWidth: 3,
      },
    ],
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 min-w-[80%] overflow-y-auto">
        <Navbar />
        <div className="p-8">
          <h3 className="text-4xl font-bold text-gray-900 mb-6">Erode Corporation</h3>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { label: "Total Employees", value: dashboardData.totalEmployees, icon: <FaUsers />, color: "indigo" },
              { label: "Present Employees", value: dashboardData.presentEmployees, icon: <FaCheckCircle />, color: "teal" },
              { label: "Absent Employees", value: dashboardData.absentEmployees, icon: <FaTimesCircle />, color: "rose" },
            ].map(({ label, value, icon, color }, index) => (
              <div key={index} className={`bg-${color}-100 p-6 rounded-xl shadow-lg text-center transition-all hover:scale-105`}>
                <div className={`text-6xl text-${color}-600 mb-4`}>{icon}</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{label}</h3>
                <div className={`text-4xl font-bold text-${color}-600`}>{value}</div>
              </div>
            ))}
          </div>

          {/* Percentages and Late Employees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {[
              { label: "Present Percentage", value: `${dashboardData.presentPercentage}%`, color: "cyan" },
              { label: "Absent Percentage", value: `${dashboardData.absentPercentage}%`, color: "orange" },
              { label: "Late Employees", value: `${dashboardData.lateEmployees} (${dashboardData.latePercentage}%)`, color: "purple" },
            ].map(({ label, value, color }, index) => (
              <div key={index} className={`bg-${color}-100 p-6 rounded-xl shadow-md text-center transition-all hover:scale-105`}>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{label}</h3>
                <div className={`text-4xl font-bold text-${color}-600`}>{value}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Daily Attendance Report</h3>
              <DailyChart chartData={dailyChartData} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Monthly Attendance Report</h3>
              <MonthlyChart chartData={monthlyChartData} />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Payments Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#1976D2", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Pending Payments</Typography>
          <IconButton onClick={() => setOpen(false)} color="inherit">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ bgcolor: "#FAFAFA" }}>
          {pendingPayments.length > 0 ? (
            pendingPayments.map((payment) => (
              <Paper key={payment.id} elevation={3} sx={{ p: 3, mb: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1" fontWeight="bold">
                    {payment.name} - <span style={{ color: "#43A047" }}>{payment.amount}</span>
                  </Typography>
                  <IconButton color="error" onClick={() => closePendingPayment(payment.id)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Typography variant="caption" color="textSecondary">
                  Date: {payment.date} | Company: {payment.company}
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography textAlign="center" color="textSecondary">No pending payments!</Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ bgcolor: "#F5F5F5" }}>
          <Button onClick={() => setOpen(false)} variant="outlined" color="secondary">Close</Button>
          <Button variant="contained" color="primary" onClick={() => navigate("/reports/payment-pending")}>View Details</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;
