import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with the database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type SensorReading = {
  id: string
  device_id: string
  timestamp: string
  temperature: number
  humidity: number
  air_quality: number
  ecg_value: number
  ecg_lead_connected: boolean
  heart_rate: number
  spo2: number
  body_temp_f: number
}

export async function getLatestSensorData() {
  const { data, error } = await supabase
    .from('latest_sensor_data')
    .select('*')
  
  if (error) {
    console.error('Error fetching latest sensor data:', error)
    return []
  }
  
  return data as SensorReading[]
}

export async function getSensorDataByTimeRange(startDate: Date, endDate: Date) {
  const { data, error } = await supabase
    .from('sensor_readings')
    .select('*')
    .gte('timestamp', startDate.toISOString())
    .lte('timestamp', endDate.toISOString())
    .order('timestamp', { ascending: true })
  
  if (error) {
    console.error('Error fetching sensor data by time range:', error)
    return []
  }
  
  return data as SensorReading[]
}

export type UserRole = 'patient'

export async function getCurrentUserRole(): Promise<UserRole | null> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  // Access the user's role from metadata
  const role = user.user_metadata?.role as UserRole
  return role || null
}