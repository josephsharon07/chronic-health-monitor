'use client'

import { useState, useEffect } from 'react'
import { getSensorDataByTimeRange, SensorReading } from '@/lib/supabase'
import { SensorHistory } from '@/components/SensorChart'

export default function RecordsPage() {
  const [sensorData, setSensorData] = useState<SensorReading[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initial data load - fetch last 24 hours
    fetchDataByTimeRange(
      new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      new Date()
    )
  }, [])

  const fetchDataByTimeRange = async (startDate: Date, endDate: Date) => {
    try {
      setLoading(true)
      const data = await getSensorDataByTimeRange(startDate, endDate)
      setSensorData(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching sensor history:', err)
      setError('Failed to load sensor history. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Health Records</h1>
        <div className="text-sm text-gray-500">
          {sensorData.length} readings found
        </div>
      </div>
      
      {loading && sensorData.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          {loading && (
            <div className="absolute top-0 left-0 right-0 z-10 bg-white bg-opacity-60 flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          <SensorHistory 
            data={sensorData}
            onTimeRangeChange={fetchDataByTimeRange}
          />
          
          {sensorData.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
              No data available for the selected time range
            </div>
          )}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Understanding Your Records</h2>
        <p className="text-gray-700 mb-4">
          This page allows you to view and analyze your health data over time. Use the filters to select different time periods and sensor types to visualize trends and patterns.
        </p>
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Tips for Data Analysis</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Look for patterns in your data over time</li>
              <li>Compare different time periods (e.g., day vs. night)</li>
              <li>Note any correlations between different measurements</li>
              <li>Track how lifestyle changes affect your readings</li>
              <li>Share significant findings with your healthcare provider</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Data Export</h3>
            <p className="text-gray-700">
              You can download your data as a PDF report using the Reports feature in the navigation menu. This is useful for sharing information with healthcare providers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}