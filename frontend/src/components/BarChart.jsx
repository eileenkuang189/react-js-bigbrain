import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const BarChart = ({ data, label, xTitle, yTitle, sectionTitle }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current && data) {
      const ctx = chartRef.current.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.labels.map((q, i) => `Q${i + 1}`),
          datasets: [{
            data: data,
            backgroundColor: '#381272',
            borderColor: 'white',
            borderWidth: 2,
            barThickness: 30,
          }],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: xTitle
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: yTitle
              }
            }
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
      return () => {
        chart.destroy();
      };
    }
  }, [data]);

  return (
    <Box sx={{ pb: 2 }}>
      <Typography variant='h5' sx={{ pb: 2 }}>{sectionTitle}</Typography>
      <canvas ref={chartRef} aria-label={label} style={{ maxWidth: '600px', margin: '0 auto' }}/>
    </Box>
  );
};

export default BarChart;
