import API from './axios';

// ─── AUTH ─────────────────────────────────────
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);

// ─── SKILLS ───────────────────────────────────
export const getAllSkills = (params) => API.get('/skills', { params });
export const getMySkills = () => API.get('/skills/mine');
export const createSkill = (data) => API.post('/skills', data);
export const updateSkill = (id, data) => API.put(`/skills/${id}`, data);
export const deleteSkill = (id) => API.delete(`/skills/${id}`);

// ─── MESSAGES ─────────────────────────────────
export const sendMessage = (data) => API.post('/messages', data);
export const getAllMessages = () => API.get('/messages');
export const getConversationList = () => API.get('/messages/conversations');
export const getConversation = (userId) => API.get(`/messages/${userId}`);

// ─── SWAP REQUESTS ────────────────────────────
export const createSwapRequest = (data) => API.post('/swaps', data);
export const getIncomingSwapRequests = () => API.get('/swaps/incoming');
export const getOutgoingSwapRequests = () => API.get('/swaps/outgoing');
export const updateSwapRequest = (id, status) => API.patch(`/swaps/${id}/status`, { status });
export const paySwapRequest = (id) => API.patch(`/swaps/${id}/pay`);

// ─── BOOKS ────────────────────────────────────
export const getBooks = () => API.get('/books');
