import React, { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'

const EnergyChart = ({ data, interval }) => {
    const chartRef = useRef(null)

    // State to track visibility of production and consumption series
    const [showProd, setShowProd] = useState(true)
    const [showCons, setShowCons] = useState(true)

    useEffect(() => {
        if (!data || data.length === 0) return
        
        // Clear previous chart
        d3.select(chartRef.current).selectAll('*').remove()

        const svg = d3.select(chartRef.current)
            .attr('width', 800)
            .attr('height', 400)
            .style('overflow', 'visible')
            .append('g')

        const margin = { top: 20, right: 20, bottom: 30, left: 50 }
        const width = 800 - margin.left - margin.right
        const height = 400 - margin.top - margin.bottom

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)

        // Set the ranges (x: time, y: energy values)
        const x = d3.scaleTime()
            .domain(d3.extent(data, d => new Date(d.date)))  // Use unfiltered data for the x-axis
            .range([0, width])

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d.prod || 0, d.cons || 0))])
            .range([height, 0])

        // Define the line for production, skipping null values
        const lineProd = d3.line()
            .defined(d => d.prod !== null && d.prod !== undefined)  // Line breaks when prod is null
            .x(d => x(new Date(d.date)))
            .y(d => y(d.prod))

        // Define the line for consumption, skipping null values
        const lineCons = d3.line()
            .defined(d => d.cons !== null && d.cons !== undefined)  // Line breaks when cons is null
            .x(d => x(new Date(d.date)))
            .y(d => y(d.cons))

        // Conditionally add the production line based on visibility
        if (showProd) {
            g.append('path')
                .datum(data)
                .attr('class', 'line')
                .attr('d', lineProd)
                .style('stroke', 'steelblue')
                .style('fill', 'none');
        }

        // Conditionally add the consumption line based on visibility
        if (showCons) {
            g.append('path')
                .datum(data)
                .attr('class', 'line')
                .attr('d', lineCons)
                .style('stroke', 'orange')
                .style('fill', 'none');
        }

        // Add the X Axis
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x))

        // Add the Y Axis
        g.append('g')
            .call(d3.axisLeft(y))

        // Create a legend
        const legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${width - 100}, -40)`)  // Adjust legend position
    
        // Add legend items
        const legendItems = [
            { color: 'steelblue', label: 'Production', visible: showProd, toggle: setShowProd },
            { color: 'orange', label: 'Consumption', visible: showCons, toggle: setShowCons }
        ]

        legendItems.forEach((item, i) => {
            const legendRow = legend.append('g')
                .attr('transform', `translate(0, ${i * 20})`)
                .style('cursor', 'pointer')
                .on('click', () => item.toggle(!item.visible))

            // Draw legend color box
            legendRow.append('rect')
                .attr('width', 15)
                .attr('height', 15)
                .attr('fill', item.color)
                .attr('opacity', item.visible ? 1 : 0.3)

            // Add text next to the color box
            legendRow.append('text')
                .attr('x', 20)
                .attr('y', 12)
                .attr('font-size', '12px')
                .attr('fill', '#000')
                .text(item.label)
                .style('text-decoration', item.visible ? 'none' : 'line-through')
        })

        // Create a tooltip div and append it to the body
        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background-color', 'white')
            .style('border', '1px solid #ccc')
            .style('padding', '10px')
            .style('border-radius', '4px')
            .style('pointer-events', 'none')
            .style('opacity', 0)  // Initially hidden

        // Add circles for the production data points, only if visible
        if (showProd) {
            g.selectAll('.prod-circle')
                .data(data.filter(d => d.prod !== null))
                .enter()
                .append('circle')
                .attr('class', 'prod-circle')
                .attr('cx', d => x(new Date(d.date)))
                .attr('cy', d => y(d.prod))
                .attr('r', 4)
                .style('fill', 'steelblue')
                .on('mouseover', function (event, d) {
                    tooltip.transition().duration(200).style('opacity', 1)  // Show the tooltip
                    tooltip.html(`
                        <strong>Date:</strong> ${new Date(d.date).toLocaleDateString()}<br>
                        <strong>Production:</strong> ${d.prod !== null ? d.prod : 'N/A'} kWh
                    `)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px')  // Position the tooltip
                })
                .on('mousemove', function (event) {
                    tooltip.style('left', (event.pageX + 10) + 'px')
                        .style('top', (event.pageY - 28) + 'px')  // Move the tooltip with the mouse
                })
                .on('mouseout', function () {
                    tooltip.transition().duration(500).style('opacity', 0)  // Hide the tooltip
                })
        }

        // Add circles for the consumption data points, only if visible
        if (showCons) {
            g.selectAll('.cons-circle')
                .data(data.filter(d => d.cons !== null))
                .enter()
                .append('circle')
                .attr('class', 'cons-circle')
                .attr('cx', d => x(new Date(d.date)))
                .attr('cy', d => y(d.cons))
                .attr('r', 4)
                .style('fill', 'orange')
                .on('mouseover', function (event, d) {
                    tooltip.transition().duration(200).style('opacity', 1)  // Show the tooltip
                    tooltip.html(`
                        <strong>Date:</strong> ${new Date(d.date).toLocaleDateString()}<br>
                        <strong>Consumption:</strong> ${d.cons !== null ? d.cons : 'N/A'} kWh
                    `)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px')  // Position the tooltip
                })
                .on('mousemove', function (event) {
                    tooltip.style('left', (event.pageX + 10) + 'px')
                        .style('top', (event.pageY - 28) + 'px')  // Move the tooltip with the mouse
                })
                .on('mouseout', function () {
                    tooltip.transition().duration(500).style('opacity', 0)  // Hide the tooltip
                })
        }

        return () => {
            d3.select('.tooltip').remove()
        }

    }, [data, interval, showProd, showCons])

    if (!data || data.length === 0) {
        return <p>No data available for the selected interval.</p>
    }

    return <svg ref={chartRef}></svg>
}

export default EnergyChart