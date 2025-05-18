'use client'

import { useState, useEffect } from 'react'
import { getLatestSensorData, getSensorDataByTimeRange, SensorReading } from '@/lib/supabase'
import SensorCard from '@/components/SensorCard'
import SensorChart from '@/components/SensorChart'

export default function CardiovascularPage() {
  const [latestData, setLatestData] = useState<SensorReading | null>(null)
  const [historicalData, setHistoricalData] = useState<SensorReading[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Fetch latest data
        const latest = await getLatestSensorData()
        if (latest && latest.length > 0) {
          setLatestData(latest[0])
        }
        
        // Fetch historical data (last 24 hours)
        const now = new Date()
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        const history = await getSensorDataByTimeRange(yesterday, now)
        setHistoricalData(history)
        
        setError(null)
      } catch (err) {
        console.error('Error fetching cardiovascular data:', err)
        setError('Failed to load cardiovascular data. Please try again later.')
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
        <h1 className="text-2xl font-bold">Cardiovascular Monitoring</h1>
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
      ) : latestData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {latestData.heart_rate !== null && (
            <SensorCard
              title="Heart Rate"
              value={latestData.heart_rate.toFixed(1)}
              unit="BPM"
              colorClass="bg-red-500"
              description="Normal range: 60-100 BPM"
            />
          )}
          
          {latestData.ecg_value !== null && (
            <SensorCard
              title="ECG Value"
              value={latestData.ecg_value.toFixed(0)}
              unit="mV"
              colorClass="bg-indigo-500"
              description={latestData.ecg_lead_connected ? "Lead connected" : "Lead disconnected"}
            />
          )}
        </div>
      ) : (
        <div className="text-center py-8">No cardiovascular data available</div>
      )}
      
      {historicalData.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Heart Rate Trends</h2>
          <SensorChart
            data={historicalData}
            sensorType="heart_rate"
            title="Heart Rate"
            color="#ff4560"
            unit=" BPM"
          />
          
          <h2 className="text-xl font-semibold">ECG Readings</h2>
          <SensorChart
            data={historicalData}
            sensorType="ecg_value"
            title="ECG Values"
            color="#673ab7"
            unit=" mV"
          />
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Cardiovascular Health Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Heart Rate (BPM)</h3>
            <p className="text-gray-700 mb-3">
              Heart rate is the number of times your heart beats per minute. A normal resting heart rate 
              for adults ranges from 60 to 100 beats per minute.
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Below 60 BPM: Bradycardia (slow heart rate)</li>
              <li>60-100 BPM: Normal range</li>
              <li>Above 100 BPM: Tachycardia (fast heart rate)</li>
              <li>Above 120 BPM at rest: Consult healthcare provider</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">ECG Monitoring</h3>
            <p className="text-gray-700 mb-3">
              Electrocardiogram (ECG) measures the electrical activity of your heart. The values shown 
              represent the electrical potential in millivolts (mV).
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>ECG values fluctuate throughout the cardiac cycle</li>
              <li>Normal QRS complex: 0.8-1.2 mV in amplitude</li>
              <li>Variations can indicate different cardiac conditions</li>
              <li>Regular monitoring helps detect anomalies early</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Recommendations</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Engage in regular aerobic exercise to strengthen your heart</li>
            <li>Maintain a heart-healthy diet low in saturated fats and sodium</li>
            <li>Practice stress reduction techniques like meditation</li>
            <li>Get adequate sleep (7-8 hours for adults)</li>
            <li>Avoid smoking and limit alcohol consumption</li>
            <li>Consult your doctor if you notice persistent irregularities</li>
          </ul>
        </div>
      </div>
    </div>
  )
}