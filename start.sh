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

# Append Last.fm credentials to backend .env if not already present
echo "🔑 Configuring Last.fm API credentials..."
if ! docker-compose exec -T backend grep -q "LASTFM_API_KEY" .env; then
    docker-compose exec -T backend bash -c "echo '' >> .env"
    docker-compose exec -T backend bash -c "echo 'LASTFM_API_KEY=57268979f6bc6ba3ffa7aab5a38486f6' >> .env"
    docker-compose exec -T backend bash -c "echo 'LASTFM_SECRET=351d5649297e4d347d83afe48e74fa8c' >> .env"
    echo "✅ Last.fm credentials added to .env"
else
    echo "✅ Last.fm credentials already configured"
fi

# Run backend tests
echo "🧪 Running backend tests..."
docker-compose exec -T backend php artisan test
BACKEND_TEST_EXIT_CODE=$?

if [ $BACKEND_TEST_EXIT_CODE -ne 0 ]; then
    echo "❌ Backend tests failed!"
    echo "⚠️  Application started but tests did not pass."
else
    echo "✅ Backend tests passed!"
fi

# Run frontend tests
echo "🧪 Running frontend tests..."
docker-compose exec -T frontend npm test -- --watchAll=false --passWithNoTests
FRONTEND_TEST_EXIT_CODE=$?

if [ $FRONTEND_TEST_EXIT_CODE -ne 0 ]; then
    echo "❌ Frontend tests failed!"
    echo "⚠️  Application started but tests did not pass."
else
    echo "✅ Frontend tests passed!"
fi

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
