'use client'

import { SensorReading } from '@/lib/supabase'

type SensorCardProps = {
  title: string
  value: number | string
  unit?: string
  icon?: React.ReactNode
  colorClass?: string
  description?: string
}

export default function SensorCard({
  title,
  value,
  unit,
  icon,
  colorClass = 'bg-blue-500',
  description
}: SensorCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className={`p-4 text-white ${colorClass} bg-gradient-to-br`}>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{title}</h3>
          {icon && <div className="text-xl">{icon}</div>}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-baseline">
          <p className="text-3xl font-bold text-gray-800">
            {value}
            {unit && <span className="text-lg ml-1 font-medium text-gray-600">{unit}</span>}
          </p>
        </div>
        {description && <p className="text-gray-500 mt-2 text-sm">{description}</p>}
      </div>
    </div>
  )
}

export function DataGrid({ data }: { data: SensorReading | null }) {
  if (!data) {
    return <div className="text-center py-8 text-gray-500">No sensor data available</div>
  }

  const lastUpdated = new Date(data.timestamp).toLocaleString()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Latest Readings</h2>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Last updated: {lastUpdated}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {data.heart_rate !== null && (
          <SensorCard
            title="Heart Rate"
            value={data.heart_rate.toFixed(1)}
            unit="BPM"
            colorClass="bg-gradient-to-r from-red-500 to-red-600"
            description="Normal range: 60-100 BPM"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            }
          />
        )}
        
        {data.spo2 !== null && (
          <SensorCard
            title="Blood Oxygen"
            value={data.spo2.toFixed(0)}
            unit="%"
            colorClass="bg-gradient-to-r from-blue-500 to-blue-600" 
            description="Normal range: 95-100%"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
              </svg>
            }
          />
        )}
        
        {data.body_temp_f !== null && (
          <SensorCard
            title="Body Temperature"
            value={data.body_temp_f.toFixed(1)}
            unit="°F"
            colorClass="bg-gradient-to-r from-orange-500 to-orange-600"
            description="Normal range: 97-99°F"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
              </svg>
            }
          />
        )}
        
        {data.temperature !== null && (
          <SensorCard
            title="Room Temperature"
            value={data.temperature.toFixed(1)}
            unit="°C"
            colorClass="bg-gradient-to-r from-green-500 to-green-600"
            description="Ambient temperature"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            }
          />
        )}
        
        {data.humidity !== null && (
          <SensorCard
            title="Humidity"
            value={data.humidity.toFixed(0)}
            unit="%"
            colorClass="bg-gradient-to-r from-teal-500 to-teal-600"
            description="Ambient humidity"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            }
          />
        )}
        
        {data.air_quality !== null && (
          <SensorCard
            title="Air Quality"
            value={data.air_quality.toString()}
            unit="ppm"
            colorClass="bg-gradient-to-r from-purple-500 to-purple-600"
            description="VOC concentration"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292M6.115 5.19A9 9 0 1017.18 4.64M6.115 5.19A8.965 8.965 0 0112 3c1.929 0 3.716.607 5.18 1.64" />
              </svg>
            }
          />
        )}
        
        {data.ecg_value !== null && (
          <SensorCard
            title="ECG Value"
            value={data.ecg_value.toFixed(0)}
            unit="mV"
            colorClass="bg-gradient-to-r from-indigo-500 to-indigo-600"
            description={data.ecg_lead_connected ? "Lead connected" : "Lead disconnected"}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            }
          />
        )}
      </div>
    </div>
  )
}