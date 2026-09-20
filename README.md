# HomeSense

[Live demo](https://homesense-web.vercel.app/)

This repository is a responsive **web showcase** for **HomeSense**, a household electricity-monitoring thesis project. It presents the product experience and mobile-app interface; the mobile app, data collection, and backend services are separate parts of the full system.

![HomeSense dashboard preview](frontend/src/assets/thumbnail.png)

## The problem

Household electricity use is usually visible only after a bill arrives. That makes it hard to identify which appliances are consuming power, notice unusual spikes, or make small changes that lower costs.

## What I built

I designed and built the web experience that presents the HomeSense product story and mobile-app interface. It demonstrates how a household can:

- View real-time appliance usage by room and on/off status
- Track total daily consumption in kWh
- See a projected monthly bill in Philippine pesos
- Review usage trends and estimated costs
- Receive alerts for unusual consumption and practical energy-saving recommendations

## How it works

`Smart plug → data storage → HomeSense mobile app → web showcase`

A smart plug captures appliance-level readings. The HomeSense experience organizes those readings into a live feed, cost and usage summaries, bill predictions, alerts, and recommendations. This repository contains the standalone web showcase for the thesis concept.

<table align="center">
  <tr><th>Live usage</th><th>Bill prediction</th><th>Usage history</th></tr>
  <tr>
    <td align="center"><img src="frontend/src/assets/bare-app-screen-1.png" alt="HomeSense live usage screen" width="150" /></td>
    <td align="center"><img src="frontend/src/assets/bare-app-screen-2.png" alt="HomeSense bill prediction screen" width="150" /></td>
    <td align="center"><img src="frontend/src/assets/bare-app-screen-3.png" alt="HomeSense usage history screen" width="150" /></td>
  </tr>
  <tr><th>Device details</th><th>Recommendations</th><th>Alerts</th></tr>
  <tr>
    <td align="center"><img src="frontend/src/assets/bare-app-screen-4.png" alt="HomeSense device details screen" width="150" /></td>
    <td align="center"><img src="frontend/src/assets/bare-app-screen-5.png" alt="HomeSense recommendations screen" width="150" /></td>
    <td align="center"><img src="frontend/src/assets/bare-app-screen-6.png" alt="HomeSense alerts screen" width="150" /></td>
  </tr>
</table>

## HomeSense tech stack

| Layer | Technology |
| --- | --- |
| Mobile app | React Native |
| Data collector | Python |
| Backend & API | FastAPI |
| Bill prediction | Flask |
| Database | MongoDB |

## Run locally

Requirements: Node.js 18+ and npm.

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

### Useful commands

```bash
npm run build # production build
npm run test # component tests
npm run lint # lint the frontend
```

## Live demo

Visit [homesense-web.vercel.app](https://homesense-web.vercel.app/).
