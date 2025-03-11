import React, { useState, useEffect } from "react";
import { Container, Typography, Card, CardContent, Button, TextField } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ReportGenerator = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Fetch reports from API (replace with your actual API call)
    const fetchReports = async () => {
      try {
        const response = await fetch("/api/reports");
        const data = await response.json();
        setReports(data);
        setFilteredReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    const results = reports.filter((report) =>
      report.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredReports(results);
  }, [search, reports]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Gym Reports", 14, 10);
    autoTable(doc, {
      head: [["ID", "Name", "Revenue", "Attendance"]],
      body: filteredReports.map((r) => [r.id, r.name, r.revenue, r.attendance]),
    });
    doc.save("gym_reports.pdf");
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Gym Reports
      </Typography>
      <TextField
        label="Search Reports"
        variant="outlined"
        fullWidth
        margin="normal"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={exportToPDF}>
        Export to PDF
      </Button>
      <Card sx={{ marginTop: 2, padding: 2 }}>
        <CardContent>
          <Typography variant="h6">Revenue vs Attendance</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredReports}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
              <Bar dataKey="attendance" fill="#82ca9d" name="Attendance" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ReportGenerator;
