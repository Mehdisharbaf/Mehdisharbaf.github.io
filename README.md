# Dr. Alder - Smart Factory Gateway

A production-ready, Dockerized web application serving as a "Local Factory Gateway" (Middleware) for Dr. Alder's Heimtiernahrung. It bridges an external AI app (hosted on Vercel) that extracts OCR data from delivery notes (Lieferscheine) with a local label printer (Etikettendrucker).

## Context & Goal

This app solves the issue of local factory printers disconnecting from the internet. It acts as a local bridge:
- Receives webhooks from Vercel.
- Queues print jobs safely in the local network.
- Monitors the factory printers.

The UI is built with a professional B2B industrial look and is completely in German.

## Core Features

- **Printer Watchdog (Drucker-Monitor)**: Displays status of local printer, allows simulation of offline/online status.
- **Lieferschein Print Queue (Warteschlange)**: Displays incoming delivery notes in a queue. If the printer is online, they are marked as printed (Gedruckt). Otherwise, they are safely queued (Fehler: Im Docker gespeichert) until the printer is back online.
- **Vercel Webhook Receiver**: API endpoint (`POST /api/webhook/lieferschein`) to accept incoming JSON payloads.

## Deployment with Docker (AWS EC2 / Ubuntu)

This application is fully Dockerized and ready for deployment on any modern Linux instance with Docker installed.

### Prerequisites

Make sure you have Docker and Docker Compose installed on your system.

```bash
# Update packages
sudo apt update

# Install Docker
sudo apt install docker.io

# Install Docker Compose
sudo apt install docker-compose
```

### Build & Run

Clone the repository to your instance, then navigate to the project directory:

```bash
# 1. Build the Docker image and start the container
sudo docker-compose up -d --build

# 2. Check the logs to ensure the server started correctly
sudo docker-compose logs -f

# 3. Access the application
# The application will be running on port 3000.
# Access it via your browser: http://<your-ec2-ip>:3000
```

### Webhook API Usage

To send a delivery note payload to the gateway from the external AI app:

**Endpoint:** `POST /api/webhook/lieferschein`

**Payload:**
```json
{
  "supplier": "Premium Pet Supply",
  "itemCount": 42
}
```

## Tech Stack

- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Icons: Lucide-React
- Containerization: Docker & Docker Compose
