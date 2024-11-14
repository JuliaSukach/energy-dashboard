# Energy Dashboard

This project is a dashboard for visualizing energy data. Users can toggle between daily, weekly, and monthly views, and view energy KPIs and charts for the selected period.

## Features
- **Interval Toggle**: Switch between daily, weekly, and monthly intervals.
- **Interactive Chart**: Displays energy production and consumption data, with tooltips for detailed information.
- **KPIs**: Summarizes key energy metrics (e.g., total production, consumption, grid usage).
- **Smooth Transitions**: The chart transitions smoothly when switching between intervals.

## How to Run

1. Clone this repository.
2. Run `npm install` to install the dependencies.
3. Run `npm start` to start the development server.
4. Access the app at `http://localhost:3000`.

## Design Choices

- **React**: Used for the frontend due to its component-based architecture and ease of state management.
- **D3.js**: Used for data visualization due to its powerful charting and graphing capabilities.
- **CSS**: Custom styles were added for layout and design.

## Future Enhancements

- Add more customization options for selecting date ranges.
- Add comparison features to compare energy usage between different periods.