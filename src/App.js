import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import './App.css';


const createGradient = (ctx) => {
  const gradient = ctx.createLinearGradient(0, 200, 300, 400);

  gradient.addColorStop(0, 'red');
  gradient.addColorStop(0.25, 'violet');
  gradient.addColorStop(0.5, 'purple');
  gradient.addColorStop(1, 'green');

  return gradient;
};

const App = () => {
  const canvasRef = useRef(null);
  const [value, setValue] = useState(50);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gradient = createGradient(ctx);

    const data = {
      datasets: [
        {
          data: [100],
          backgroundColor: gradient,
          borderColor: 'white',
          needleValue: value,
          borderWidth: 2,
          cutout: '92%',
          circumference: '180',
          rotation: 270,
          borderRadius: 5,
        },
      ],
    };

    const gaugeNeedle = {
      id: 'gaugeNeedle',
      afterDatasetDraw(chart, args, options) {
        const {
          ctx,
          data,
          chartArea: { width, height },
        } = chart;
        ctx.save();
        const needleValue = data.datasets[0].needleValue;
        const dataTotal = data.datasets[0].data.reduce((a, b) => a + b, 0);

        const angle = Math.PI + (1 / dataTotal) * needleValue * Math.PI;

        const cx = width / 2;
        const cy = chart._metasets[0].data[0].y;

        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, -85);
        ctx.lineTo(height - ctx.canvas.offsetTop-50, 0);
        ctx.lineTo(0, 85);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.restore();

        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, 10);
        ctx.fill();
        ctx.restore();

        const text = value;
        const padding = 90;
        const radius = (text -3 ) / 2 + padding;
        ctx.textAlign = 'center';
        ctx.font = 'normal 90px Helvetica';
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#F5F5F5';
        ctx.fill();
        ctx.fillStyle = '#00563B';
        ctx.fillText(text, cx, cy);
        ctx.restore();

        ctx.canvas.style.transition = "transform 1s ease-out 10s";
        ctx.canvas.style.zIndex = '1';
      },
    };

    const config = {
      type: 'doughnut',
      data,
      options: {
        animation: {
          duration: 2000,
          // delay: 500,
          transition: 'transform 80s'
        },
        legend :{
          display: false,
        },
        tooltip: {
          yAlign: 'bottom',
          displayColors: false,
        }
      },
      plugins: [gaugeNeedle],
    }

    const myChart = new Chart(canvas, config);

    return () => {
      myChart.destroy();
    };
  }, [value]);

  return (
    <>
      <div className="chartCard">
        <div className="chartBox">
          <canvas ref={canvasRef} >
</canvas>
<input  value ={value} min={0} max={100} type='number' onChange={(e)=> setValue(e.target.value)}/>
</div>
</div>
</>
) }

export default App;
