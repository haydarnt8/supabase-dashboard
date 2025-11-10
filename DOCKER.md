# Docker Setup - Dashboard App

## Build

```bash
docker build -t exams-dashboard .
```

## Run

```bash
docker run -p 8080:8080 exams-dashboard
```

## Access

http://localhost:8080

## Dockerfile Info

- **Base**: Node 20 Alpine
- **Build Tool**: Vite
- **Server**: http-server
- **Port**: 8080
- **Output**: dist/

## Custom Port

```bash
docker run -p 9090:8080 exams-dashboard
# Access: http://localhost:9090
```

## Development vs Production

This Dockerfile is for **production** use. For development, continue using:

```bash
pnpm dev
```
