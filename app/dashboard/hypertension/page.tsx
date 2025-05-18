'use client'

import { useState, useEffect } from 'react'
import { getLatestSensorData, getSensorDataByTimeRange, SensorReading } from '@/lib/supabase'
import SensorCard from '@/components/SensorCard'
import SensorChart from '@/components/SensorChart'

export default function HypertensionPage() {
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
        
        // Fetch historical data (last 7 days)
        const now = new Date()
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const history = await getSensorDataByTimeRange(sevenDaysAgo, now)
        setHistoricalData(history)
        
        setError(null)
      } catch (err) {
        console.error('Error fetching hypertension data:', err)
        setError('Failed to load hypertension data. Please try again later.')
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
        <h1 className="text-2xl font-bold">Hypertension Monitoring</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestData.heart_rate !== null && (
            <SensorCard
              title="Heart Rate"
              value={latestData.heart_rate.toFixed(1)}
              unit="BPM"
              colorClass="bg-red-500"
              description="Normal range: 60-100 BPM"
            />
          )}
          
          {latestData.body_temp_f !== null && (
            <SensorCard
              title="Body Temperature"
              value={latestData.body_temp_f.toFixed(1)}
              unit="°F"
              colorClass="bg-orange-500"
              description="Normal range: 97-99°F"
            />
          )}
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 text-white bg-yellow-500">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Status</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-baseline">
                <p className="text-xl font-bold">
                  {latestData.heart_rate && latestData.heart_rate > 100 ? 'Elevated' : 'Normal'}
                </p>
              </div>
              <p className="text-gray-500 mt-2">
                Based on current heart rate
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">No hypertension data available</div>
      )}
      
      {historicalData.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Heart Rate Trends (7-Day)</h2>
          <SensorChart
            data={historicalData}
            sensorType="heart_rate"
            title="Heart Rate"
            color="#ff4560"
            unit=" BPM"
          />
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Hypertension Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Understanding Hypertension</h3>
            <p className="text-gray-700 mb-3">
              Hypertension, or high blood pressure, is a common condition where the force of blood against your artery walls is 
              consistently too high. While this system doesn't directly measure blood pressure, monitoring heart rate and other 
              vital signs can help identify potential issues.
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Normal BP: Below 120/80 mmHg</li>
              <li>Elevated BP: 120-129/below 80 mmHg</li>
              <li>Stage 1 Hypertension: 130-139/80-89 mmHg</li>
              <li>Stage 2 Hypertension: 140+/90+ mmHg</li>
              <li>Hypertensive Crisis: 180+/120+ mmHg (emergency)</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Heart Rate and Hypertension</h3>
            <p className="text-gray-700 mb-3">
              While heart rate (pulse) and blood pressure are not the same, they can be correlated. A consistently 
              elevated heart rate can sometimes indicate cardiovascular issues that may be linked to hypertension.
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Elevated heart rate can increase cardiac workload</li>
              <li>Resting heart rate above 80 BPM may increase cardiovascular risk</li>
              <li>Regular monitoring helps establish your normal pattern</li>
              <li>Consult your doctor about your specific target ranges</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Lifestyle Recommendations</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Adopt the DASH diet (rich in fruits, vegetables, whole grains, lean protein)</li>
            <li>Reduce sodium intake to less than 1,500 mg daily</li>
            <li>Engage in regular physical activity (150+ minutes weekly)</li>
            <li>Maintain a healthy weight</li>
            <li>Limit alcohol consumption</li>
            <li>Avoid tobacco products</li>
            <li>Manage stress through meditation, deep breathing, or yoga</li>
            <li>Take prescribed medications regularly as directed</li>
          </ul>
        </div>
      </div>
    </div>
  )
}