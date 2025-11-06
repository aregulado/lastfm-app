# Last.fm Application

An application that integrates with the Last.fm API to display top artists. Built with Laravel (REST API + Web Interface) and React (Frontend).

## 📱 Application Flow

1. **User visits Laravel app** → Redirected to login page (`http://localhost:8000/login`)
2. **User logs in** → Authenticated and redirected to Home Page
3. **Home Page displays** → Shows user info and "View Top Artists" button
4. **User clicks button** → Token is generated and stored in localStorage
5. **Redirected to React app** → Opens `http://localhost:3000` with authentication preserved
6. **React app loads** → Fetches artists from Laravel API using the token
7. **Artists displayed** → Shows top 50 artists from Last.fm with images, names, listeners, and URLs

## 📁 Project Structure

```
lastfm-fullstack-app/
├── backend/                    # Laravel Application
│   ├── app/
│   │   ├── Console/
│   │   │   └── Commands/
│   │   │       └── ImportLastFmArtists.php  # Last.fm import command
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Api/
│   │   │   │   │   └── ArtistController.php  # API endpoint for artists
│   │   │   │   ├── AuthController.php        # Web authentication
│   │   │   │   └── HomeController.php        # Home page controller
│   │   │   ├── Middleware/
│   │   │   └── Requests/
│   │   ├── Models/
│   │   │   ├── Artist.php                    # Artist model
│   │   │   └── User.php                      # User model
│   │   ├── Repositories/
│   │   │   └── ArtistRepository.php          # Artist data access layer
│   │   └── Services/
│   │       └── LastFmService.php             # Last.fm API integration
│   ├── bootstrap/
│   ├── config/                                # Laravel configuration files
│   ├── database/
│   │   ├── migrations/                        # Database migrations
│   │   └── seeders/
│   │       └── DatabaseSeeder.php            # Seeds test user
│   ├── public/                                # Public assets
│   ├── resources/
│   │   └── views/
│   │       ├── login.blade.php               # Login page
│   │       └── home.blade.php                # Home page with "View Top Artists" button
│   ├── routes/
│   │   ├── api.php                           # API routes (/api/artists)
│   │   └── web.php                           # Web routes (login, home)
│   ├── storage/                               # Logs and cache
│   ├── tests/                                 # PHPUnit tests
│   ├── .env.example                          # Environment template
│   ├── Dockerfile                            # Backend Docker configuration
│   └── composer.json                         # PHP dependencies
│
├── frontend/                   # React Application
│   ├── public/                                # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   └── PrivateRoute.js               # Protected route wrapper
│   │   ├── pages/
│   │   │   ├── Artists.js                    # Artists display page
│   │   │   └── Login.js                      # React login (fallback)
│   │   ├── services/
│   │   │   └── api.js                        # Axios configuration
│   │   ├── store/
│   │   │   ├── index.js                      # Redux store setup
│   │   │   └── slices/
│   │   │       └── authSlice.js              # Authentication state
│   │   ├── App.js                            # Main app component
│   │   └── index.js                          # React entry point
│   ├── .env.example                          # Environment template
│   ├── Dockerfile                            # Frontend Docker configuration
│   └── package.json                          # Node dependencies
│
├── docker-compose.yml          # Docker orchestration (backend, frontend, db)
├── start.sh                    # Easy startup script
├── LICENSE                     # MIT License
└── README.md                   # This file
```

## 🚀 Quick Start with Docker (Recommended)

### Prerequisites
- Docker and Docker Compose installed
- Last.fm API credentials (only if running manually - not needed for start.sh)

### Setup Steps

1. **Start the application using the startup script**
   ```bash
   ./start.sh
   ```

   **Note:** The start.sh script already includes Last.fm API credentials, so you don't need to configure them separately.

2. **Or run manually** (requires Last.fm credentials):

   First, add Last.fm API credentials to backend/.env:
   - Visit https://www.last.fm/api/account/create
   - Create an API account to get your API Key and Shared Secret
   - Open `backend/.env` file and add your credentials:

   ```env
   LASTFM_API_KEY=your_lastfm_api_key_here
   LASTFM_SECRET=your_lastfm_secret_here
   ```

   Then run:
   ```bash
   # Start containers
   docker-compose up -d --build

   # Wait for database to be ready (10 seconds)
   sleep 10

   # Run migrations
   docker-compose exec -T backend php artisan migrate --force

   # Seed database
   docker-compose exec -T backend php artisan db:seed --force

   # Import artists from Last.fm
   docker-compose exec -T backend php artisan lastfm:import
   ```

   **Note for Linux/Unix users**: If you get a "cannot execute: required file not found" error, convert the line endings:
   ```bash
   sed -i 's/\r$//' start.sh
   chmod +x start.sh
   ./start.sh
   ```

3. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend**: http://localhost:8000
   - **Database**: localhost:3306

4. **Login with default credentials**
   - **Email**: test@example.com
   - **Password**: password

## ✅ What's Included

After running the setup:
- ✅ All 3 Docker containers running (backend, frontend, database)
- ✅ Database migrations completed
- ✅ Test user created
- ✅ 50 top artists imported from Last.fm API

## 🛠️ Manual Setup (Without Docker)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   composer install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Add Last.fm API credentials to .env**

   You need to obtain Last.fm API credentials:
   - Visit https://www.last.fm/api/account/create
   - Create an API account to get your API Key and Shared Secret
   - Copy these credentials to your `.env` file:

   ```env
   LASTFM_API_KEY=your_lastfm_api_key_here
   LASTFM_SECRET=your_lastfm_secret_here
   ```

5. **Update database configuration in .env**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=lastfm
   DB_USERNAME=your_username
   DB_PASSWORD=your_password

   SANCTUM_STATEFUL_DOMAINS=localhost:3000
   SESSION_DOMAIN=localhost
   ```

6. **Run migrations and seed**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

7. **Import artists**
   ```bash
   php artisan lastfm:import
   ```

8. **Start the server**
   ```bash
   php artisan serve
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env`:
   ```env
   REACT_APP_API_URL=http://localhost:8000
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

## 📝 Useful Commands

### Docker Commands

```bash
# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Stop the application
docker-compose down

# Stop and remove volumes (complete cleanup)
docker-compose down -v

# Restart the application
docker-compose up -d

# Rebuild containers
docker-compose up -d --build

# Access backend container
docker-compose exec backend bash

# Access frontend container
docker-compose exec frontend sh

# Access database
docker-compose exec db mysql -u lastfm_user -plastfm_password lastfm
```

### Backend Commands

```bash
# Run migrations
docker-compose exec backend php artisan migrate

# Seed database
docker-compose exec backend php artisan db:seed

# Import artists from Last.fm
docker-compose exec backend php artisan lastfm:import

# Clear cache
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear

# Fresh migration (reset database)
docker-compose exec backend php artisan migrate:fresh --seed
```

### Frontend Commands

```bash
# Install new package
docker-compose exec frontend npm install package-name

# Build for production
docker-compose exec frontend npm run build

# Run tests
docker-compose exec frontend npm test
```

## 🔌 API Endpoints & Routes

### Web Routes (Laravel)
- `GET /` - Redirects to login page
- `GET /login` - Login page (web interface)
- `POST /login` - Process login credentials
- `POST /logout` - Logout and clear session
- `GET /home` - Home page with "View Top Artists" button (requires authentication)

### API Routes (Laravel)

**Authentication**
- `POST /api/login` - API login and get token
  ```json
  {
    "email": "test@example.com",
    "password": "password"
  }
  ```
  Response:
  ```json
  {
    "token": "1|abc123...",
    "user": {
      "id": 1,
      "name": "Test User",
      "email": "test@example.com"
    }
  }
  ```

- `POST /api/logout` - API logout (requires authentication)
- `GET /api/user` - Get authenticated user (requires authentication)

**Artists**
- `GET /api/artists` - Get all artists (requires authentication)
  ```json
  [
    {
      "id": 1,
      "name": "The Beatles",
      "mbid": "b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d",
      "url": "https://www.last.fm/music/The+Beatles",
      "image_url": "https://lastfm.freetls.fastly.net/i/u/300x300/...",
      "listeners": 5000000,
      "playcount": 500000000
    }
  ]
  ```

### Testing API with cURL

```bash
# Get API info (redirects to login)
curl http://localhost:8000

# API Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Get artists (replace YOUR_TOKEN with the token from login)
curl http://localhost:8000/api/artists \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get authenticated user
curl http://localhost:8000/api/user \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔧 Troubleshooting

### Backend Issues

**1. Container not starting**
```bash
# Check logs
docker-compose logs backend

# Rebuild container
docker-compose up -d --build backend
```

**2. Database connection error**
```bash
# Ensure database is running
docker-compose ps

# Check database logs
docker-compose logs db

# Wait for database to be ready
sleep 10
docker-compose exec backend php artisan migrate
```

**3. CORS errors**
- Verify `SANCTUM_STATEFUL_DOMAINS=localhost:3000` in `backend/.env`
- Check `config/cors.php` has `supports_credentials => true`

**4. Class not found errors**
```bash
# Clear cache and regenerate autoload
docker-compose exec backend composer dump-autoload
docker-compose exec backend php artisan config:clear
```

### Frontend Issues

**1. Container not starting**
```bash
# Check logs
docker-compose logs frontend

# Rebuild container
docker-compose up -d --build frontend
```

**2. API connection error**
- Verify `REACT_APP_API_URL=http://localhost:8000` in `frontend/.env`
- Ensure backend is running: `curl http://localhost:8000`
- Check browser console for errors

**3. Authentication not working**
- Clear browser localStorage
- Check if token is being sent in requests (Network tab in DevTools)
- Verify CORS settings in backend

**4. Module not found errors**
```bash
# Reinstall dependencies
docker-compose exec frontend npm install
```

### Database Issues

**1. Connection refused**
```bash
# Check if database is running
docker-compose ps

# Restart database
docker-compose restart db

# Wait longer for database to initialize
sleep 15
```

**2. Reset database**
```bash
# Complete reset
docker-compose down -v
docker-compose up -d
sleep 10
docker-compose exec backend php artisan migrate:fresh --seed
docker-compose exec backend php artisan lastfm:import
```

### General Issues

**1. Port already in use**
```bash
# Check what's using the port
lsof -i :8000  # Backend
lsof -i :3000  # Frontend
lsof -i :3306  # Database

# Kill the process or change ports in docker-compose.yml
```

**2. Clear everything and start fresh**
```bash
# Stop and remove everything
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Rebuild from scratch
docker-compose up -d --build

# Run setup again
sleep 10
docker-compose exec -T backend php artisan migrate --force
docker-compose exec -T backend php artisan db:seed --force
docker-compose exec -T backend php artisan lastfm:import
```

**3. start.sh execution error**
```bash
# If you get "cannot execute: required file not found"
# This is due to Windows-style line endings (CRLF)

# Fix line endings
sed -i 's/\r$//' start.sh

# Make executable
chmod +x start.sh

# Run again
./start.sh
```

## 🔐 Security Features

- Token-based authentication with Laravel Sanctum
- CORS protection
- CSRF protection
- Password hashing with bcrypt
- Environment variables for sensitive data
- API rate limiting

## 📊 Database Schema

### Users Table
- id
- name
- email (unique)
- password (hashed)
- timestamps

### Artists Table
- id
- name
- mbid (MusicBrainz ID)
- url
- image_url
- listeners
- playcount
- timestamps

## 📄 License

This project is open-source and available under the MIT License.
