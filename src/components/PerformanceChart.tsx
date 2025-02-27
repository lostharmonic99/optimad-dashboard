
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar 
} from "recharts";

export interface ChartData {
  date: string;
  [key: string]: string | number;
}

interface PerformanceChartProps {
  data: ChartData[];
  type?: "line" | "bar";
  metrics: Array<{
    key: string;
    name: string;
    color: string;
  }>;
  height?: number;
}

const PerformanceChart = ({
  data,
  type = "line",
  metrics,
  height = 300,
}: PerformanceChartProps) => {
  if (type === "line") {
    return (
      <div className="glass-panel p-6 animate-fade-in">
        <h3 className="font-medium mb-4">Performance Trends</h3>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }} 
              tickMargin={10}
              stroke="#94a3b8"
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              tickMargin={10}
              stroke="#94a3b8"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: 'none',
              }}
            />
            <Legend />
            {metrics.map((metric) => (
              <Line
                key={metric.key}
                type="monotone"
                dataKey={metric.key}
                name={metric.name}
                stroke={metric.color}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 animate-fade-in">
      <h3 className="font-medium mb-4">Performance Metrics</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }} 
            tickMargin={10}
            stroke="#94a3b8"
          />
          <YAxis 
            tick={{ fontSize: 12 }} 
            tickMargin={10}
            stroke="#94a3b8"
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: 'none',
            }}
          />
          <Legend />
          {metrics.map((metric) => (
            <Bar
              key={metric.key}
              dataKey={metric.key}
              name={metric.name}
              fill={metric.color}
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
