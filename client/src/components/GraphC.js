import React, { useState, useEffect } from 'react';
import Chart from 'chart.js';
import io from 'socket.io-client';

const GraphC = () => {
  const [voltageData, setVoltageData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [Chart, setChart] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:3000'); // Replace with your backend URL
    socket.on('voltage', (data) => {
      setVoltageData((prevData) => [...prevData, data]);
    });
    socket.on('current', (data) => {
      setCurrentData((prevData) => [...prevData, data]);
    });

    // Cleanup function to disconnect from the socket
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Create the chart when the component mounts
    const ctx = document.getElementById('myChart').getContext('2d');
    const newChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Voltage',
            data: voltageData,
            borderColor: 'red',
            borderWidth: 2,
            fill: false,
          },
          {
            label: 'Current',
            data: currentData,
            borderColor: 'blue',
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          xAxes: [
            {
              display: false,
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });

    // Update the chart data whenever the voltage or current data changes
    if (voltageData.length > 0 && currentData.length > 0) {
      newChart.data.labels = Array.from(
        { length: voltageData.length },
        (_, i) => i + 1
      );
      newChart.data.datasets[0].data = voltageData;
      newChart.data.datasets[1].data = currentData;
      newChart.update();
    }

    // Save the chart instance for later use
    setChart(newChart);
  }, [voltageData, currentData]);

  return <canvas id="myChart" />;
};

export default GraphC;
