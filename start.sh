#!/bin/bash

echo "🚀 Starting Last.fm Fullstack Application..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Start Docker containers
echo "📦 Starting Docker containers..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run migrations
echo "🔄 Running database migrations..."
docker-compose exec -T backend php artisan migrate --force

# Seed database
echo "🌱 Seeding database..."
docker-compose exec -T backend php artisan db:seed --force

# Import artists from Last.fm
echo "🎵 Importing artists from Last.fm..."
docker-compose exec -T backend php artisan lastfm:import

echo ""
echo "✅ Application is ready!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:8000"
echo ""
echo "👤 Login credentials:"
echo "   Email: test@example.com"
echo "   Password: password"
echo ""
echo "To stop the application, run: docker-compose down"
