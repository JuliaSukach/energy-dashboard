import * as d3 from 'd3'

const aggregateMetric = (v, key) => {
    // Check if all values for the metric are null/undefined
    const allNull = v.every(d => d[key] === null || d[key] === undefined)
    if (allNull) {
        return null
    }

    // Sum valid values for the metric
    return d3.sum(v, d => d[key] !== null && d[key] !== undefined ? d[key] : 0)
}

// Function to group data by selected interval
export const groupDataByInterval = (data, interval) => {
    let groupedData
    // Aggregation logic for all metrics
    const aggregate = (v) => ({
        prod: aggregateMetric(v, 'prod'),
        cons: aggregateMetric(v, 'cons'),
        self: aggregateMetric(v, 'self'),
        fromGrid: aggregateMetric(v, 'fromGrid'),
        toGrid: aggregateMetric(v, 'toGrid')
    })

    // Group data based on the selected interval
    if (interval === 'daily') {
        groupedData = d3.rollup(
            data,
            aggregate,
            d => d3.timeDay(new Date(d.ts))
        )
    } else if (interval === 'weekly') {
        groupedData = d3.rollup(
            data,
            aggregate,
            d => d3.timeWeek(new Date(d.ts))
        )
    } else if (interval === 'monthly') {
        groupedData = d3.rollup(
            data,
            aggregate,
            d => d3.timeMonth(new Date(d.ts))
        )
    }

    return Array.from(groupedData, ([key, value]) => ({
        date: key,
        ...value
    }))
}