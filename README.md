# FocusAI - Intelligent Content Filtering System

FocusAI is an intelligent content filtering system designed to solve information overload by analyzing content from various platforms (YouTube, Instagram, blogs, online courses) and helping users focus on meaningful and productive information.

## Features

- **AI-Powered Content Analysis**: Advanced algorithms analyze content and provide usefulness scores
- **Smart Summarization**: Generate concise summaries of lengthy content
- **Productivity Tracking**: Track content consumption and productivity metrics
- **Focus Mode**: Pomodoro timer and distraction blocking functionality
- **Personalized Recommendations**: AI-based content suggestions
- **Modern UI**: Premium SaaS-style interface with dark theme and glassmorphism effects

## Architecture

The application follows a microservices architecture:

- **Frontend**: React.js with Tailwind CSS and Framer Motion
- **Backend**: Node.js/Express.js with MongoDB
- **AI Service**: Python Flask with NLP processing
- **Database**: MongoDB for data persistence

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd focusai-content-filtering
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Install and start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7.0
   
   # Or install locally following MongoDB documentation
   ```

4. **Set up the backend server**
   ```bash
   cd server
   npm install
   npm run dev
   ```

5. **Set up the AI service**
   ```bash
   cd ai-service
   pip install -r requirements.txt
   python app.py
   ```

6. **Set up the frontend**
   ```bash
   cd client
   npm install
   npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - AI Service: http://localhost:5001

### Using Docker Compose

For a complete setup with all services:

```bash
docker-compose up -d
```

This will start all services including MongoDB, backend, AI service, and frontend.

## Development

### Project Structure

```
focusai-content-filtering/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── ...
│   └── package.json
├── server/                 # Express.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── server.js
├── ai-service/             # Python Flask AI service
│   ├── services/           # AI processing modules
│   ├── app.py
│   └── requirements.txt
└── docker-compose.yml
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

#### Content Analysis
- `POST /api/analyze` - Analyze content
- `GET /api/analyze/history` - Get analysis history
- `GET /api/analyze/:id` - Get specific analysis

#### Analytics
- `GET /api/analytics/dashboard` - Dashboard data
- `GET /api/analytics/productivity-score` - Productivity metrics
- `GET /api/analytics/time-tracking` - Time tracking data

#### AI Service
- `POST /ai/analyze-text` - Analyze text content
- `POST /ai/analyze-youtube` - Analyze YouTube videos
- `POST /ai/summarize` - Generate summaries
- `POST /ai/classify` - Classify content

### Testing

```bash
# Backend tests
cd server
npm test

# AI service tests
cd ai-service
pytest

# Frontend tests
cd client
npm test
```

## Configuration

### Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `AI_SERVICE_URL`: URL of the AI service
- `CLIENT_URL`: Frontend URL for CORS
- `PORT`: Server port (default: 5000)

### AI Service Configuration

The AI service uses NLTK for natural language processing. On first run, it will download required language models automatically.

## Deployment

### Production Deployment

1. **Build the frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Set production environment variables**
   ```bash
   export NODE_ENV=production
   export MONGODB_URI=your-production-mongodb-uri
   export JWT_SECRET=your-production-jwt-secret
   ```

3. **Start services**
   ```bash
   # Start AI service
   cd ai-service
   gunicorn -w 4 -b 0.0.0.0:5001 app:app
   
   # Start backend
   cd server
   npm start
   ```

### Docker Deployment

```bash
docker-compose -f docker-compose.yml up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.