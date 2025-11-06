#!/bin/bash

echo "Waiting for database..."
until php artisan db:show > /dev/null 2>&1; do
    echo "Database not ready, waiting..."
    sleep 2
done
echo "Database is ready!"

echo "Running migrations..."
php artisan migrate --force

echo "Seeding database..."
php artisan db:seed --force

echo "Starting Laravel server..."
php artisan serve --host=0.0.0.0 --port=8000
