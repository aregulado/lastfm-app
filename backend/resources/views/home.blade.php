<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Last.fm App - Home</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 60px 40px;
            max-width: 500px;
            width: 100%;
            text-align: center;
        }

        h1 {
            color: #333;
            font-size: 2.5rem;
            margin-bottom: 10px;
        }

        .welcome-text {
            color: #666;
            font-size: 1.1rem;
            margin-bottom: 40px;
        }

        .user-info {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 30px;
        }

        .user-info p {
            color: #555;
            font-size: 1rem;
            margin-bottom: 5px;
        }

        .user-info strong {
            color: #333;
        }

        .button-group {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .btn {
            padding: 15px 30px;
            font-size: 1.1rem;
            font-weight: 600;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
            background: #6c757d;
            color: white;
        }

        .btn-secondary:hover {
            background: #5a6268;
            transform: translateY(-2px);
        }

        .icon {
            margin-right: 8px;
        }

        @media (max-width: 600px) {
            .container {
                padding: 40px 30px;
            }

            h1 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎵 Last.fm App</h1>
        <p class="welcome-text">Welcome back!</p>

        <div class="user-info">
            <p><strong>Name:</strong> {{ $user->name }}</p>
            <p><strong>Email:</strong> {{ $user->email }}</p>
        </div>

        <div class="button-group">
            <button onclick="goToArtists()" class="btn btn-primary">
                <span class="icon">🎸</span>
                View Top Artists
            </button>

            <form action="{{ route('logout') }}" method="POST" style="margin: 0;">
                @csrf
                <button type="submit" class="btn btn-secondary" style="width: 100%;">
                    <span class="icon">🚪</span>
                    Logout
                </button>
            </form>
        </div>
    </div>

    <script>
        function goToArtists() {
            const token = '{{ $token }}';
            const user = {
                name: '{{ $user->name }}',
                email: '{{ $user->email }}',
                id: {{ $user->id }}
            };

            console.log('Setting token:', token);
            console.log('Setting user:', user);

            if (!token || token === '') {
                alert('Error: No token generated. Please refresh the page and try again.');
                return;
            }

            const userJson = encodeURIComponent(JSON.stringify(user));
            window.location.href = `http://localhost:3000?token=${token}&user=${userJson}`;
        }
    </script>
</body>
</html>