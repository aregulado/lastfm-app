FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    default-mysql-client

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy composer files first to leverage Docker layer caching
COPY composer.json composer.lock ./

# Install PHP dependencies (including dev) without running scripts or generating autoloader yet
RUN composer install --no-scripts --no-autoloader --no-interaction --prefer-dist

# Copy application source after dependencies are installed
COPY . .

# Generate optimized autoloader
RUN composer dump-autoload --optimize

# Set permissions only for necessary runtime directories
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

EXPOSE 8000

CMD php artisan serve --host=0.0.0.0 --port=8000

CMD php artisan serve --host=0.0.0.0 --port=8000
