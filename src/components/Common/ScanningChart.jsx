import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const ScanningChart = ({ height, data: chartData }) => {
  const formatUsers = (orderAmount) => {
    if (orderAmount >= 1000) {
      return `${(orderAmount / 1000).toFixed(1)}`;
    }
    return `${orderAmount}`;
  };

  const axisStyle = {
    fill: "#99A69D",
    fontSize: "12px",
    width: "30px",
    whiteSpace: "pre-wrap",
  };
  const yAxisStyle = {
    fill: "#2B3674",
    fontSize: "12px",
  };

  const data =
    chartData?.map((order) => ({
      ...order,
      updatedAt: new Date(order.updatedAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      }),
    })) || [];

  const customTickFormatter = (tick) => {
    const [updatedAt, day] = tick.split(" ");
    const monthAbbreviation = updatedAt.substring(0, 3); // Get the first 3 letters of the month
    return `${day?.split(",")?.[0]}\n${monthAbbreviation}`;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ bottom: 10 }}>
        <CartesianGrid stroke="#3d8bff0c" />
        <XAxis
          dataKey="updatedAt"
          axisLine={{ stroke: "transparent" }}
          tickMargin={10}
          tick={{ ...axisStyle }}
          tickFormatter={customTickFormatter}
        />
        <YAxis
          tickFormatter={formatUsers}
          axisLine={{ stroke: "transparent" }}
          tickMargin={10}
          tick={{ ...yAxisStyle }}
        />
        <Tooltip
          content={<CustomTooltip />}
          wrapperStyle={{
            borderRadius: "8px",
            backgroundColor: "rgba(255, 255, 255, 1)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          }}
          cursor={{ stroke: "#3d8bff1a", strokeWidth: "2px" }}
        />
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="10%" stopColor="#338AF3" stopOpacity={0.2} />
            <stop offset="90%" stopColor="white" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <Area
          //   type="monotone"
          dataKey="orderAmount"
          stroke="#338AF3"
          type="linear"
          strokeWidth={2}
          dot={false}
          activeDot={{
            r: 6,
            fill: "white",
            stroke: "#338AF3",
            strokeWidth: "3px",
          }}
          fill="url(#colorGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-chart-tooltip">
        {payload.map((entry, index) => (
          <h4 key={`data-${index}`} style={{ color: entry.stroke }}>
            {`$${entry.value}`}
          </h4>
        ))}
        <p className="label">{`${label}`}</p>
      </div>
    );
  }

  return null;
};

export default ScanningChart;
