# Stage 1: Build the Go binary
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Copy dependencies definitions first
COPY go.mod go.sum* ./
RUN go mod download

# Copy source files
COPY . .

# Build statically compiled binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o server .

# Stage 2: Minimal runtime
FROM alpine:3.19

WORKDIR /app

# Add ca-certificates for secure SSL/TLS connection to Neon
RUN apk --no-cache add ca-certificates

# Copy binary and seed data
COPY --from=builder /app/server .
COPY --from=builder /app/data ./data

ENV PORT=8080
EXPOSE 8080

CMD ["./server"]
