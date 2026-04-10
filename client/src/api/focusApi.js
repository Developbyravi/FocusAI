import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: BASE });

export const analyzeContent = (input, goal, userKeywords) =>
  api.post('/analyze', { input, goal, userKeywords }).then((r) => r.data);

export const analyzeWithKeywords = (videoId, keywords, goal) =>
  api.post('/analyze/keywords', { videoId, keywords, goal }).then((r) => r.data);

export const generateRoadmap = (topic, currentLevel) =>
  api.post('/analyze/roadmap', { topic, currentLevel }).then((r) => r.data);

export const sendFeedback = (data) =>
  api.post('/analyze/feedback', data).then((r) => r.data);

export const sendChatMessage = (messages, context) =>
  api.post('/chat', { messages, context }).then((r) => r.data);

export const createSession = (goal) =>
  api.post('/session/create', { goal }).then((r) => r.data);

export const recordToSession = (sessionId, data) =>
  api.post(`/session/${sessionId}/record`, data).then((r) => r.data);
