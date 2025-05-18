'use client'

import { useState, useEffect, useRef } from 'react'
import { jsPDF } from 'jspdf'
import { getSensorDataByTimeRange, SensorReading } from '@/lib/supabase'
import { SensorHistory } from '@/components/SensorChart'
import SensorCard from '@/components/SensorCard'

export default function ReportsPage() {
  const [sensorData, setSensorData] = useState<SensorReading[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTimeRange, setSelectedTimeRange] = useState<{start: Date, end: Date}>({
    start: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
    end: new Date()
  })
  const [selectedSensor, setSelectedSensor] = useState<keyof SensorReading>('heart_rate')
  const [generating, setGenerating] = useState(false)
  
  const reportRef = useRef<HTMLDivElement>(null)
  
  const sensorOptions = [
    { value: 'heart_rate', label: 'Heart Rate', unit: 'BPM', color: '#ff4560' },
    { value: 'spo2', label: 'Blood Oxygen', unit: '%', color: '#008ffb' },
    { value: 'body_temp_f', label: 'Body Temperature', unit: '°F', color: '#feb019' },
    { value: 'temperature', label: 'Room Temperature', unit: '°C', color: '#00e396' },
    { value: 'humidity', label: 'Humidity', unit: '%', color: '#00d4bd' },
    { value: 'air_quality', label: 'Air Quality', unit: 'ppm', color: '#9c27b0' },
    { value: 'ecg_value', label: 'ECG Value', unit: 'mV', color: '#673ab7' }
  ]

  useEffect(() => {
    fetchDataByTimeRange(selectedTimeRange.start, selectedTimeRange.end)
  }, [])

  const fetchDataByTimeRange = async (startDate: Date, endDate: Date) => {
    try {
      setLoading(true)
      const data = await getSensorDataByTimeRange(startDate, endDate)
      setSensorData(data)
      setSelectedTimeRange({ start: startDate, end: endDate })
      setError(null)
    } catch (err) {
      console.error('Error fetching sensor data for report:', err)
      setError('Failed to load sensor data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }
  
  const generatePDF = async () => {
    if (!reportRef.current || sensorData.length === 0) return
    
    try {
      setGenerating(true)
      
      // Create a new jsPDF instance
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      // Add title
      doc.setFontSize(22)
      doc.text('Health Monitoring Report', 105, 20, { align: 'center' })
      
      // Add date range
      doc.setFontSize(12)
      doc.text(
        `Date Range: ${selectedTimeRange.start.toLocaleDateString()} - ${selectedTimeRange.end.toLocaleDateString()}`, 
        105, 
        30, 
        { align: 'center' }
      )
      
      // Add report generation time
      doc.setFontSize(10)
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 35, { align: 'center' })
      
      // Add selected sensor data section
      const selectedSensorOption = sensorOptions.find(option => option.value === selectedSensor)
      
      doc.setFontSize(14)
      doc.text(`${selectedSensorOption?.label || 'Sensor'} Data Analysis`, 20, 45)
      
      // Add statistics
      doc.setFontSize(12)
      
      // Calculate statistics
      const values = sensorData
        .map(reading => reading[selectedSensor] as number)
        .filter(value => value !== null && !isNaN(value))
      
      if (values.length > 0) {
        const min = Math.min(...values)
        const max = Math.max(...values)
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length
        
        doc.text(`Number of Readings: ${values.length}`, 20, 55)
        doc.text(`Minimum: ${min.toFixed(2)} ${selectedSensorOption?.unit || ''}`, 20, 62)
        doc.text(`Maximum: ${max.toFixed(2)} ${selectedSensorOption?.unit || ''}`, 20, 69)
        doc.text(`Average: ${avg.toFixed(2)} ${selectedSensorOption?.unit || ''}`, 20, 76)
        
        // Add normal range information based on sensor type
        switch (selectedSensor) {
          case 'heart_rate':
            doc.text('Normal Range: 60-100 BPM', 20, 83)
            break
          case 'spo2':
            doc.text('Normal Range: 95-100%', 20, 83)
            break
          case 'body_temp_f':
            doc.text('Normal Range: 97-99°F', 20, 83)
            break
        }
      } else {
        doc.text('No data available for the selected sensor and time range', 20, 55)
      }
      
      // Add note at the bottom
      doc.setFontSize(10)
      doc.text(
        'Note: This report is generated for informational purposes only and is not a substitute for professional medical advice.',
        20,
        280
      )
      
      // Save the PDF
      doc.save(`health-report-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (err) {
      console.error('Error generating PDF:', err)
      setError('Failed to generate PDF report. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Health Reports</h1>
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
        <div ref={reportRef} className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Select Report Parameters</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sensor Type
                </label>
                <select
                  value={selectedSensor}
                  onChange={(e) => setSelectedSensor(e.target.value as keyof SensorReading)}
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
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={selectedTimeRange.start.toISOString().split('T')[0]}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value)
                        setSelectedTimeRange(prev => ({
                          ...prev,
                          start: newDate
                        }))
                      }}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">End Date</label>
                    <input
                      type="date"
                      value={selectedTimeRange.end.toISOString().split('T')[0]}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value)
                        newDate.setHours(23, 59, 59, 999)
                        setSelectedTimeRange(prev => ({
                          ...prev,
                          end: newDate
                        }))
                      }}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => fetchDataByTimeRange(selectedTimeRange.start, selectedTimeRange.end)}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Update Data
              </button>
              
              <button
                onClick={generatePDF}
                disabled={generating || sensorData.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? 'Generating...' : 'Download PDF Report'}
              </button>
            </div>
          </div>
          
          {sensorData.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Summary Statistics</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {(() => {
                        const values = sensorData
                          .map(reading => reading[selectedSensor] as number)
                          .filter(value => value !== null && !isNaN(value))
                          
                        if (values.length === 0) return null
                        
                        const min = Math.min(...values)
                        const max = Math.max(...values)
                        const avg = values.reduce((sum, val) => sum + val, 0) / values.length
                        const selectedSensorOption = sensorOptions.find(option => option.value === selectedSensor)
                        
                        return (
                          <>
                            <SensorCard
                              title="Minimum"
                              value={min.toFixed(2)}
                              unit={selectedSensorOption?.unit}
                              colorClass="bg-blue-500"
                            />
                            <SensorCard
                              title="Maximum"
                              value={max.toFixed(2)}
                              unit={selectedSensorOption?.unit}
                              colorClass="bg-red-500"
                            />
                            <SensorCard
                              title="Average"
                              value={avg.toFixed(2)}
                              unit={selectedSensorOption?.unit}
                              colorClass="bg-green-500"
                            />
                            <SensorCard
                              title="Readings"
                              value={values.length.toString()}
                              colorClass="bg-purple-500"
                            />
                          </>
                        )
                      })()}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Data Visualization</h3>
                    <SensorHistory 
                      data={sensorData}
                      onTimeRangeChange={fetchDataByTimeRange}
                    />
                  </div>
                </>
              )}
            </div>
          ) : !loading && (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
              No data available for the selected time range and sensor type
            </div>
          )}
        </div>
      )}
    </div>
  )
}