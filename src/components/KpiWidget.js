import React from 'react'

const KpiWidget = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="kpi-widget">
                <h2>Key Performance Indicators</h2>
                <p>No data available</p>
            </div>
        )
    }
    const safeSum = (key) => data.reduce((acc, curr) => acc + (curr[key] !== null && curr[key] !== undefined ? curr[key] : 0), 0)

    const totalProduction = safeSum('prod')
    const totalConsumption = safeSum('cons')
    const totalSelfConsumption = safeSum('self')
    const totalGridUsage = safeSum('fromGrid')
    const totalGridInjection = safeSum('toGrid')

    const selfConsumptionRatio = totalProduction > 0 ? (totalSelfConsumption / totalProduction) * 100 : 0

    return (
        <div className='kpi-widget'>
            <h2>Key Performance Indicators</h2>
            <div className="kpi">
                <span>Total Production:</span>
                <span>{totalProduction.toFixed(2)} kWh</span>
            </div>
            <div className="kpi">
                <span>Total Consumption:</span>
                <span>{totalConsumption.toFixed(2)} kWh</span>
            </div>
            <div className="kpi">
                <span>Self-consumption Ratio:</span>
                <span>{selfConsumptionRatio.toFixed(2)}%</span>
            </div>
            <div className="kpi">
                <span>Total Grid Usage:</span>
                <span>{totalGridUsage.toFixed(2)} kWh</span>
            </div>
            <div className="kpi">
                <span>Total Grid Injection:</span>
                <span>{totalGridInjection.toFixed(2)} kWh</span>
            </div>
        </div>
    )
}

export default KpiWidget