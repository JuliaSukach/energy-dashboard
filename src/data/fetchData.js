export const fetchEnergyData = async (interval = '1h', start = '2024-08-01T00:00:00.000Z', stop = '2024-10-16T09:00:00.000Z') => {
    try {
        // Simulate an API request (fetching the static JSON file)
        const response = await fetch('/challenge/api.json')
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        const data = await response.json()
        // Filter data by the given start and stop times
        const filteredData = data.filter(item => {
            const timestamp = new Date(item.ts)
            return timestamp >= new Date(start) && timestamp <= new Date(stop)
        })
        return filteredData
    } catch (error) {
        console.error('Error fetching energy data:', error)
        return null
    }
}