# Last.fm Fullstack Application

A fullstack application that integrates with the Last.fm API to display top artists. Built with Laravel (REST API + Web Interface) and React (Frontend).

## 🎯 Features

### Backend (Laravel)
- **Web Authentication**: Login page with session-based authentication
- **Home Page**: Authenticated users can access a home page with a "View Top Artists" button
- **RESTful API**: Secure API endpoints with Laravel Sanctum token authentication
- **Repository Pattern**: Clean data management architecture
- **Last.fm API Integration**: Fetch and store artist data from Last.fm
- **MySQL Database**: Persistent storage for users and artists
- **Console Command**: Manual import of artists via `php artisan lastfm:import`

### Frontend (React)
- **Redux Toolkit**: Centralized state management for artists and authentication
- **React Router**: Client-side navigation
- **Axios**: HTTP client for API calls
- **Responsive Design**: Beautiful CSS Grid layout that works on all devices
- **Token-based Authentication**: Secure API access with Bearer tokens
- **Protected Routes**: Only authenticated users can access artist data
- **Artist Display**: Shows artist image, name, listener count, and Last.fm URL

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
├── backend/              # Laravel Application
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── Api/           # API Controllers
│   │   │   ├── AuthController.php  # Web Authentication
│   │   │   └── HomeController.php  # Home Page
│   │   ├── Models/
│   │   ├── Repositories/
│   │   └── Console/Commands/
│   ├── resources/views/
│   │   ├── login.blade.php    # Login Page
│   │   └── home.blade.php     # Home Page with "Top Artists" button
│   ├── routes/
│   │   ├── web.php           # Web routes (login, home)
│   │   └── api.php           # API routes (artists endpoint)
│   ├── Dockerfile
│   └── .env
├── frontend/            # React Application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js      # React login (fallback)
│   │   │   └── Artists.js    # Artists display page
│   │   ├── store/
│   │   │   ├── index.js      # Redux store
│   │   │   └── slices/       # Redux slices
│   │   ├── services/
│   │   │   └── api.js        # Axios configuration
│   │   └── components/
│   │       └── PrivateRoute.js
│   ├── Dockerfile
│   └── .env
├── docker-compose.yml   # Docker orchestration
├── start.sh            # Easy startup script
└── README.md           # This file
```

## 🚀 Quick Start with Docker (Recommended)

### Prerequisites
- Docker and Docker Compose installed
- Last.fm API Key (get it from https://www.last.fm/api/account/create)

### Setup Steps

1. **Configure Last.fm API Key**
   
   Edit `backend/.env` and add your Last.fm credentials:
   ```env
   LASTFM_API_KEY=your_lastfm_api_key_here
   LASTFM_SECRET=your_lastfm_secret_here
   ```

2. **Start the application using the startup script**
   ```bash
   ./start.sh
   ```

   Or manually:
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

   # --- Quick Start: Additional guidance for web flow ---
   # After the commands above complete, you can access and exercise the full user flow:
   #
   # Laravel (backend) web interface:
   #   - Login page:     http://localhost:8000/login
   #   - Home page:      http://localhost:8000/home  (available after login)
   #
   # React (frontend) app:
   #   - Frontend UI:    http://localhost:3000
   #     (Open the React app via the "View Top Artists" button on the Laravel Home page to preserve auth/session.)
   #
   # API endpoint:
   #   - Artists API:    http://localhost:8000/api/artists
   #
   # Default test user:
   #   - Email:    test@example.com
   #   - Password: password
   #
   # Recommended quick user flow:
   #   1. Visit the Laravel login page: http://localhost:8000/login
   #   2. Sign in with the test credentials above.
   #   3. After successful login you'll be redirected to the Laravel Home page.
   #   4. Click the "View Top Artists" button on the Home page to open the React app with authentication preserved.
   #   5. Browse the top 50 Last.fm artists fetched during setup.
   #
   # Optional: Print quick access summary when running this script
   echo ""
   echo "Application started. Quick access:"
   echo "  Laravel Login : http://localhost:8000/login"
   echo "  Laravel Home  : http://localhost:8000/home"
   echo "  React App     : http://localhost:3000"
   echo "  API Endpoint  : http://localhost:8000/api/artists"
   echo ""
   echo "Default credentials: test@example.com / password"
   echo "Complete user flow: login -> Home -> View Top Artists (opens React app)"
   ```

3. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000
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

4. **Update .env file**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=lastfm
   DB_USERNAME=your_username
   DB_PASSWORD=your_password

   LASTFM_API_KEY=your_lastfm_api_key_here
   LASTFM_SECRET=your_lastfm_secret_here

   SANCTUM_STATEFUL_DOMAINS=localhost:3000
   SESSION_DOMAIN=localhost
   ```

5. **Run migrations and seed**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

6. **Import artists**
   ```bash
   php artisan lastfm:import
   ```

7. **Start the server**
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

## 🎨 Technologies Used

### Backend
- **Laravel 11** - PHP Framework
- **Laravel Sanctum** - API Authentication
- **MySQL 8.0** - Database
- **Guzzle HTTP Client** - API requests
- **Repository Pattern** - Data abstraction

### Frontend
- **React 18** - UI Library
- **Redux Toolkit** - State Management
- **React Router DOM** - Navigation
- **Axios** - HTTP Client
- **CSS3** - Responsive Design with Grid

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **PHP 8.2-FPM** - PHP runtime
- **Node 18-Alpine** - Node.js runtime

## 📱 Application Features

### Authentication Flow
1. User enters credentials on login page
2. Frontend sends POST request to `/api/login`
3. Backend validates and returns token
4. Token stored in Redux and localStorage
5. Token sent with all subsequent requests
6. Protected routes check for valid token

### Artist Display
- Responsive grid layout (1-4 columns based on screen size)
- Artist cards with images and names
- Smooth loading states
- Error handling with user-friendly messages
- Logout functionality

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

## 🚦 Development Workflow

1. **Make changes to backend**
   - Edit files in `backend/` directory
   - Changes are reflected immediately (volume mounted)
   - Check logs: `docker-compose logs -f backend`

2. **Make changes to frontend**
   - Edit files in `frontend/src/` directory
   - Hot reload enabled (changes appear automatically)
   - Check logs: `docker-compose logs -f frontend`

3. **Database changes**
   - Create migration: `docker-compose exec backend php artisan make:migration migration_name`
   - Run migration: `docker-compose exec backend php artisan migrate`

## 📄 License

This project is open-source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 💬 Support

For issues and questions, please open an issue on the GitHub repository.

## 🎵 Enjoy!

Your Last.fm fullstack application is ready to use. Browse top artists, explore their profiles, and enjoy the responsive design across all devices!
