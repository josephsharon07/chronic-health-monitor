'use client'

import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { SensorReading } from '@/lib/supabase'

type ChartDataPoint = {
  timestamp: string
  [key: string]: any
}

type SensorChartProps = {
  data: SensorReading[]
  sensorType: keyof SensorReading
  title: string
  color?: string
  unit?: string
}

export default function SensorChart({
  data,
  sensorType,
  title,
  color = '#8884d8',
  unit = ''
}: SensorChartProps) {
  if (!data || data.length === 0) {
    return <div className="text-center py-8">No data available for chart</div>
  }

  // Format data for chart
  const chartData: ChartDataPoint[] = data.map(reading => {
    const timestamp = new Date(reading.timestamp).toLocaleString()
    return {
      timestamp,
      [sensorType]: reading[sensorType]
    }
  })

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis unit={unit} />
            <Tooltip 
              labelFormatter={(value) => `Time: ${value}`}
              formatter={(value) => [`${value}${unit}`, title]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={sensorType}
              stroke={color}
              activeDot={{ r: 8 }}
              name={title}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

type TimeRangeOption = '24h' | '7d' | '30d' | 'custom'

type SensorHistoryProps = {
  data: SensorReading[]
  onTimeRangeChange: (startDate: Date, endDate: Date) => void
}

export function SensorHistory({ data, onTimeRangeChange }: SensorHistoryProps) {
  const [timeRange, setTimeRange] = useState<TimeRangeOption>('24h')
  const [sensorType, setSensorType] = useState<keyof SensorReading>('heart_rate')
  const [customStartDate, setCustomStartDate] = useState<string>('')
  const [customEndDate, setCustomEndDate] = useState<string>('')
  
  const sensorOptions = [
    { value: 'heart_rate', label: 'Heart Rate', unit: 'BPM', color: '#ff4560' },
    { value: 'spo2', label: 'Blood Oxygen', unit: '%', color: '#008ffb' },
    { value: 'body_temp_f', label: 'Body Temperature', unit: '°F', color: '#feb019' },
    { value: 'temperature', label: 'Room Temperature', unit: '°C', color: '#00e396' },
    { value: 'humidity', label: 'Humidity', unit: '%', color: '#00d4bd' },
    { value: 'air_quality', label: 'Air Quality', unit: 'ppm', color: '#9c27b0' },
    { value: 'ecg_value', label: 'ECG Value', unit: 'mV', color: '#673ab7' }
  ]
  
  const handleTimeRangeChange = (range: TimeRangeOption) => {
    setTimeRange(range)
    
    const now = new Date()
    let startDate = new Date()
    let endDate = now
    
    switch (range) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'custom':
        // Handle in the custom date form submission
        return
    }
    
    onTimeRangeChange(startDate, endDate)
  }
  
  const handleCustomRangeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (customStartDate && customEndDate) {
      const startDate = new Date(customStartDate)
      const endDate = new Date(customEndDate)
      
      // Add time to make endDate inclusive of the full day
      endDate.setHours(23, 59, 59, 999)
      
      onTimeRangeChange(startDate, endDate)
    }
  }
  
  const selectedSensor = sensorOptions.find(option => option.value === sensorType)
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sensor Type
            </label>
            <select
              value={sensorType}
              onChange={(e) => setSensorType(e.target.value as keyof SensorReading)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {sensorOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Range
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleTimeRangeChange('24h')}
                className={`px-3 py-1 text-sm rounded-md ${
                  timeRange === '24h'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                24h
              </button>
              <button
                onClick={() => handleTimeRangeChange('7d')}
                className={`px-3 py-1 text-sm rounded-md ${
                  timeRange === '7d'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                7d
              </button>
              <button
                onClick={() => handleTimeRangeChange('30d')}
                className={`px-3 py-1 text-sm rounded-md ${
                  timeRange === '30d'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                30d
              </button>
              <button
                onClick={() => setTimeRange('custom')}
                className={`px-3 py-1 text-sm rounded-md ${
                  timeRange === 'custom'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Custom
              </button>
            </div>
          </div>
        </div>
        
        {timeRange === 'custom' && (
          <div className="mt-4">
            <form onSubmit={handleCustomRangeSubmit} className="flex gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Apply
              </button>
            </form>
          </div>
        )}
      </div>
      
      {selectedSensor && (
        <SensorChart
          data={data}
          sensorType={sensorType}
          title={selectedSensor.label}
          color={selectedSensor.color}
          unit={selectedSensor.unit}
        />
      )}
    </div>
  )
}