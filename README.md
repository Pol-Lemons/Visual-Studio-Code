# CarTech - Used Car Cost Predictor

CarTech is a React + TypeScript web app that helps users estimate the real monthly cost of owning a used car.

Users can search vehicles, select trims, enter ownership details, and estimate used car price, gas cost, insurance, maintenance, monthly payment, and total monthly cost.

## Features

- Search cars by brand, model, or year
- Filter cars by brand
- Select trims for each vehicle
- Estimate used car price based on year, mileage, and condition
- Calculate monthly gas, insurance, maintenance, and payment cost
- Compare up to 3 vehicles
- View detailed cost breakdown for each car
- Responsive grid and list layout

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React Icons

## How It Works

The app uses a rule-based pricing formula.

Estimated used price is calculated from:

- Original trim price
- Vehicle year
- Mileage
- Condition

Monthly ownership cost includes:

- Estimated monthly payment
- Gas cost
- Insurance estimate
- Maintenance estimate

## Project Status

This project is still in progress.

Planned improvements:

- Add more brands and models
- Add different specs for each model year
- Move vehicle data into a separate data file
- Add backend API
- Add database support
- Add machine learning price prediction

## Run Locally

```bash
npm install
npm run dev
