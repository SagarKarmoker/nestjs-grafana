# Basic API Monitor

A NestJS application with complete monitoring stack using Prometheus and Grafana. This project demonstrates how to monitor a Node.js API with metrics collection, visualization dashboards, and alerting capabilities.

## Features

- **NestJS API**: Simple REST API with health check endpoint
- **Prometheus Metrics**: Automatic collection of HTTP request metrics, Node.js runtime stats, and custom metrics
- **Grafana Dashboard**: Pre-configured dashboard with panels for request rates, latency percentiles, error rates, memory usage, and more
- **Docker Compose**: Complete containerized setup for easy local development and testing

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Grafana   │────▶│  Prometheus │────▶│  NestJS API │
│  (Port 3001)│     │  (Port 9090)│     │ (Port 8080) │
└─────────────┘     └─────────────┘     └─────────────┘
                            │                   │
                            └───────────────────┘
                                    Scrapes
                                   /metrics
```

## Prerequisites

- Docker
- Docker Compose
- pnpm (for local development)

## Quick Start

### 1. Clone and start the services

```bash
# Start all services
docker compose up -d
```

This will start three containers:

- **API**: NestJS application on port 8080
- **Prometheus**: Metrics collection on port 9090
- **Grafana**: Visualization dashboard on port 3001

### 2. Access the services

| Service      | URL                           | Description                           |
| ------------ | ----------------------------- | ------------------------------------- |
| API          | http://localhost:8080/api/v1  | Main application endpoint             |
| Health Check | http://localhost:8080/api/v1  | Returns health status                 |
| Metrics      | http://localhost:8080/metrics | Prometheus metrics endpoint           |
| Prometheus   | http://localhost:9090         | Metrics query interface               |
| Grafana      | http://localhost:3001         | Visualization dashboard (admin/admin) |

### 3. View the Dashboard

1. Open Grafana: http://localhost:3001
2. Login with default credentials:
   - Username: `admin`
   - Password: `admin`
3. Navigate to Dashboards → Browse → "NestJS API Dashboard"

### 4. Generate Traffic (Optional)

To see metrics in the dashboard, generate some traffic:

```bash
# Simple health check
curl http://localhost:8080/api/v1

# Generate load
for i in {1..100}; do curl -s http://localhost:8080/api/v1 > /dev/null; done

# Test error responses
curl http://localhost:8080/api/v1/nonexistent
```

## Available Metrics

The dashboard includes the following panels:

### Overview

- **Request Rate**: Total requests per second
- **P95 Latency**: 95th percentile response time
- **Error Rate**: Percentage of 5xx responses
- **Active Handles**: Number of active async handles

### HTTP Metrics

- Request rate by route
- Response time percentiles (P50, P95, P99)
- Status code distribution (2xx, 4xx, 5xx)

### Node.js Runtime

- Memory usage (Heap Total, Heap Used, External)
- Event loop lag
- CPU usage
- Active requests
- Process uptime
- Node.js version

## Development

### Local Development

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm run start:dev

# Build for production
pnpm run build

# Run tests
pnpm run test
```

### Project Structure

```
.
├── src/
│   ├── app.controller.ts      # Health check endpoint
│   ├── app.module.ts          # Application module with Prometheus
│   ├── app.service.ts         # Health check logic
│   ├── main.ts                # Application bootstrap
│   └── metrics.controller.ts  # Metrics endpoint
├── grafana/
│   ├── dashboards/
│   │   └── nestjs-dashboard.json  # Grafana dashboard definition
│   └── provisioning/
│       ├── dashboards/
│       │   └── dashboards.yml     # Dashboard provisioning config
│       └── datasources/
│           └── datasources.yml    # Prometheus datasource config
├── docker-compose.yml         # Docker Compose configuration
├── Dockerfile                 # API container definition
├── prometheus.yml             # Prometheus scrape configuration
└── package.json               # Dependencies and scripts
```

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=8080
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=admin
```

### Prometheus Targets

Edit `prometheus.yml` to change the scrape configuration:

```yaml
scrape_configs:
  - job_name: 'api'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['api:8080']
```

## Troubleshooting

### Prometheus shows target as DOWN

1. Check if the API is running: `curl http://localhost:8080/api/v1`
2. Verify metrics endpoint: `curl http://localhost:8080/metrics`
3. Check Prometheus targets: http://localhost:9090/targets

### Grafana dashboard shows "No data"

1. Ensure Prometheus is connected: Configuration → Data sources → Prometheus → "Save & test"
2. Generate some traffic to the API
3. Check if time range is appropriate (dashboard defaults to "Last 1 hour")

### Port conflicts

If ports are already in use, modify `docker-compose.yml`:

```yaml
ports:
  - 'YOUR_PORT:8080' # For API
  - 'YOUR_PORT:9090' # For Prometheus
  - 'YOUR_PORT:3000' # For Grafana
```

## License

MIT

## Author

Sagar Karmoker

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
