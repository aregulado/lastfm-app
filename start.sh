#!/bin/bash

echo "🚀 Starting Last.fm Application..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create backend .env file if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend .env file from .env.example..."
    cp backend/.env.example backend/.env
    echo "✅ Backend .env file created"
else
    echo "✅ Backend .env file already exists"
fi

# Add Last.fm credentials to backend .env if not already present (BEFORE starting containers)
echo "🔑 Configuring Last.fm API credentials..."
if ! grep -q "LASTFM_API_KEY" backend/.env; then
    echo '' >> backend/.env
    echo 'LASTFM_API_KEY=57268979f6bc6ba3ffa7aab5a38486f6' >> backend/.env
    echo 'LASTFM_SECRET=351d5649297e4d347d83afe48e74fa8c' >> backend/.env
    echo "✅ Last.fm credentials added to .env"
else
    echo "✅ Last.fm credentials already configured"
fi

# APP_KEY generation moved to after Docker containers are started (handled later in this script)

# Start Docker containers
echo "📦 Starting Docker containers..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
MAX_ATTEMPTS=60
ATTEMPT=0
while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if docker-compose exec -T backend php artisan db:show > /dev/null 2>&1; then
        echo "✅ Database is ready!"
        break
    fi
    ATTEMPT=$((ATTEMPT + 1))
    if [ $((ATTEMPT % 10)) -eq 0 ]; then
        echo "   Still waiting... ($ATTEMPT/$MAX_ATTEMPTS)"
    fi
    sleep 2
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo "❌ Database failed to become ready in time"
    exit 1
fi

# Run migrations
echo "🔄 Running migrations..."
docker-compose exec -T backend php artisan migrate --force
echo "✅ Migrations completed"

# Wait a moment for migrations to fully complete
sleep 2

# Seed database
echo "🌱 Seeding database..."
docker-compose exec -T backend php artisan db:seed --force
echo "✅ Database seeded"

# Import artists from Last.fm (after credentials are configured)
echo "🎵 Importing artists from Last.fm..."
docker-compose exec -T backend php artisan lastfm:import
if [ $? -eq 0 ]; then
    echo "✅ Artists imported"
else
    echo "❌ Failed to import artists"
    exit 1
fi

if [ $FRONTEND_TEST_EXIT_CODE -ne 0 ]; then
    echo "❌ Frontend tests failed!"
    echo "⚠️  Application started but tests did not pass."
else
    echo "✅ Frontend tests passed!"
fi

echo ""
echo "✅ Application is ready!"
echo ""
echo "🔌 Laravel Webpage: http://localhost:8000"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "👤 Login credentials:"
echo "   Email: test@example.com"
echo "   Password: password"
echo ""
echo "To stop the application, run: docker-compose down"
