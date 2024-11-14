import React, { useEffect, useState } from 'react'
import { fetchEnergyData } from './data/fetchData'
import KpiWidget from './components/KpiWidget'
import EnergyChart from './components/EnergyChart'
import { groupDataByInterval } from './utils/groupData'

function App() {
    const [energyData, setEnergyData] = useState(null)
    const [interval, setInterval] = useState('daily')
    const [groupedData, setGroupedData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const startDate = '2024-08-01T00:00:00.000Z'
    const stopDate = '2024-10-16T09:00:00.000Z'

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError(null)
            try {
                const data = await fetchEnergyData(interval, startDate, stopDate)
                if (data) {
                  setEnergyData(data)
                } else {
                  throw new Error('No data available')
                }
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [interval])

    // Group the data every time the interval or energy data changes
    useEffect(() => {
        if (energyData) {
            const grouped = groupDataByInterval(energyData, interval)
            setGroupedData(grouped)
        }
    }, [energyData, interval])

    const handleIntervalChange = (e) => {
        setInterval(e.target.value)  // Set the selected interval (daily, weekly, monthly)
    }

    return (
        <div className='App'>
            <h1>Energy Dashboard</h1>
            {loading ? (
                <p>Loading data...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>Error: {error}</p>
            ) : (
                <>
                    <label>
                        View by:
                        <select value={interval} onChange={handleIntervalChange}>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        </select>
                    </label>
                    {energyData === null ? (
                        <p>Error fetching data. Please try again later.</p>
                    ) : groupedData && groupedData.length === 0 ? (
                        <p>No data available for the selected period.</p>
                    ) : (
                        <>
                            <KpiWidget data={groupedData} />
                            <EnergyChart data={groupedData} interval={interval} />
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default App