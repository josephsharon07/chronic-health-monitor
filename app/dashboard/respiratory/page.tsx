'use client'

import { useState, useEffect } from 'react'
import { getLatestSensorData, SensorReading } from '@/lib/supabase'
import SensorCard from '@/components/SensorCard'
import SensorChart from '@/components/SensorChart'

export default function RespiratoryPage() {
  const [sensorData, setSensorData] = useState<SensorReading | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const data = await getLatestSensorData()
        
        if (data && data.length > 0) {
          setSensorData(data[0])
        } else {
          setSensorData(null)
        }
        
        setError(null)
      } catch (err) {
        console.error('Error fetching sensor data:', err)
        setError('Failed to load sensor data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Respiratory Monitoring</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Refresh Data
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : sensorData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sensorData.spo2 !== null && (
            <SensorCard
              title="Blood Oxygen"
              value={sensorData.spo2.toFixed(0)}
              unit="%"
              colorClass="bg-blue-500"
              description="Normal range: 95-100%"
            />
          )}
          
          {sensorData.air_quality !== null && (
            <SensorCard
              title="Air Quality"
              value={sensorData.air_quality.toString()}
              unit="ppm"
              colorClass="bg-purple-500"
              description="VOC concentration in air"
            />
          )}
          
          {sensorData.ecg_value !== null && (
            <SensorCard
              title="Breath Monitor"
              value={sensorData.ecg_value.toFixed(0)}
              unit="mV"
              colorClass="bg-green-500"
              description="Current breathing pattern value"
            />
          )}
        </div>
      ) : (
        <div className="text-center py-8">No respiratory data available</div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Respiratory Health Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Blood Oxygen (SpO2)</h3>
            <p className="text-gray-700 mb-3">
              Blood oxygen level is a measure of how much oxygen your red blood cells are carrying. 
              Normal SpO2 levels are between 95% and 100%.
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>95-100%: Normal range</li>
              <li>91-94%: Mild hypoxemia (low blood oxygen)</li>
              <li>86-90%: Moderate hypoxemia</li>
              <li>Below 86%: Severe hypoxemia - seek medical attention</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Air Quality</h3>
            <p className="text-gray-700 mb-3">
              Air quality readings measure volatile organic compounds (VOCs) in the air. 
              Lower readings indicate better air quality.
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>0-500 ppm: Excellent air quality</li>
              <li>500-1000 ppm: Good air quality</li>
              <li>1000-2000 ppm: Fair air quality</li>
              <li>2000-5000 ppm: Poor - consider ventilation</li>
              <li>Above 5000 ppm: Very poor - take action</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Recommendations</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Practice deep breathing exercises regularly</li>
            <li>Ensure proper ventilation in your living space</li>
            <li>Use air purifiers if air quality is consistently poor</li>
            <li>Stay hydrated to help maintain respiratory health</li>
            <li>Consult your healthcare provider if SpO2 levels fall below 92% consistently</li>
          </ul>
        </div>
      </div>
    </div>
  )
}