const ctx = document.getElementById('myChart').getContext('2d');

let currentDataType = 'temperature';

// Sample Data
const chartData = {
  temperature: [32, 28, 48, 32, 28, 32, 24, 22, 20, 24],
  precipitation: [10, 20, 15, 25, 30, 28, 18, 12, 8, 5],
  wind: [5, 7, 6, 8, 12, 15, 11, 9, 6, 7]
};

const chartLabels = [
  '3:00pm', '4:00pm', '5:00pm', '6:00pm', '7:00pm',
  '8:00pm', '9:00pm', '10:00pm', '11:00pm', '12:00pm'
];

const myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: chartLabels,
    datasets: [{
      label: 'Temperature',
      data: chartData.temperature,
      borderColor: 'rgba(255, 99, 132, 0.6)',
      backgroundColor: 'transparent',
      pointBorderColor: 'rgba(255, 99, 132, 1)',
      pointBackgroundColor: '#fff',
      pointRadius: 5,
      pointHoverRadius: 7,
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        bodyFont: {
          size: 10
        },
        bodyColor: '#000' // Dark black font in tooltip
      },
      datalabels: {
        display: true,
        color: '#000', // Black color for data labels
        font: {
          size: 10
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#000', // Black x-axis labels
          font: {
            size: 10
          }
        }
      },
      y: {
        beginAtZero: false,
        ticks: {
          color: '#000', // Black y-axis labels
          stepSize: 4,
          font: {
            size: 10
          }
        }
      }
    }
  },
  plugins: [ChartDataLabels]
});


document.querySelectorAll('.weather-tab').forEach(tab => {
  tab.addEventListener('click', (e) => {
    e.preventDefault();

    const type = tab.getAttribute('data-type');
    if (type === currentDataType) return;

    currentDataType = type;

    // Active class switching
    document.querySelectorAll('.weather-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Change dataset and label
    myLineChart.data.datasets[0].data = chartData[type];
    myLineChart.data.datasets[0].label = type.charAt(0).toUpperCase() + type.slice(1);

    // Update chart
    myLineChart.update();
  });
});
