import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import * as api from '../api/services';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const downloadAttachment = (attachment) => {
  if (!attachment?.url) return;

  const link = document.createElement('a');
  link.href = attachment.url;
  link.download = attachment.name || 'shared-document.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const Messages = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();
  const currentUserId = user ? String(user.id || user._id) : null;

  const [conversations, setConversations] = useState([]);
  const [thread, setThread] = useState([]);
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingThread, setLoadingThread] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  const activeSkill = location.state?.skillId
    ? { id: location.state.skillId, title: location.state.skillTitle }
    : null;

  const loadConversations = async () => {
    const { data } = await api.getConversationList();
    setConversations(data);
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (!userId) {
      setThread([]);
      return;
    }
    setLoadingThread(true);
    api
      .getConversation(userId)
      .then(({ data }) => setThread(data))
      .finally(() => setLoadingThread(false));
  }, [userId]);

  useEffect(() => {
    if (!socket) return;
    const handler = (msg) => {
      const otherId = String(msg.from._id) === currentUserId ? String(msg.to._id) : String(msg.from._id);
      if (otherId === userId) {
        setThread((prev) => (prev.some((item) => item._id === msg._id) ? prev : [...prev, msg]));
      }
      loadConversations();
    };
    socket.on('newMessage', handler);
    return () => socket.off('newMessage', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, userId, currentUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  const handleFileSelect = (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      window.alert('Please choose a PDF file to share.');
      return;
    }
    setSelectedFile(file);
  };

  const onInputChange = (event) => {
    handleFileSelect(event.target.files?.[0]);
    event.target.value = '';
  };

  const onDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFileSelect(event.dataTransfer.files?.[0]);
  };

  const send = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!userId || (!trimmed && !selectedFile)) return;

    let attachment = null;
    if (selectedFile) {
      const fileData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });
      attachment = {
        name: selectedFile.name,
        mimeType: selectedFile.type,
        url: fileData
      };
    }

    setText('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    try {
      const { data } = await api.sendMessage({
        to: userId,
        text: trimmed,
        attachment,
        skill: activeSkill?.id
      });
      setThread((prev) => (prev.some((item) => item._id === data._id) ? prev : [...prev, data]));
      loadConversations();
    } catch (err) {
      // silently drop — user can retry
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6 animate-fadeUp">
        <h1 className="text-3xl font-display font-extrabold mb-1">Messages</h1>
        <p className="text-gray-500">Chat with people about the skills they've posted.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden" style={{ minHeight: '520px' }}>
        <div className="border-r border-gray-100 overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="text-sm text-gray-400 p-5">
              No conversations yet — message someone from the Browse page.
            </p>
          ) : (
            conversations.map((c) => (
              <button
                key={c.user._id}
                onClick={() => navigate(`/messages/${c.user._id}`)}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 transition-colors ${
                  userId === c.user._id ? 'bg-brand-50' : ''
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-brand-gradient text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {c.user.name?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{c.user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{c.lastMessage}</p>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="md:col-span-2 flex flex-col">
          {!userId ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Select a conversation to start chatting
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeSkill && (
                  <p className="text-xs text-center text-gray-400 bg-gray-50 rounded-full py-1.5 px-3 w-fit mx-auto">
                    Re: {activeSkill.title}
                  </p>
                )}
                {loadingThread ? (
                  <p className="text-sm text-gray-400 text-center">Loading...</p>
                ) : thread.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center mt-10">No messages yet — say hello 👋</p>
                ) : (
                  thread.map((m) => {
                    const mine = String(m.from._id) === currentUserId;
                    return (
                      <div key={m._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                            mine ? 'bg-brand-gradient text-white' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {m.text && <p className="whitespace-pre-wrap break-words">{m.text}</p>}
                          {m.attachment?.url && (
                            <div className={`mt-2 rounded-xl border px-3 py-2 ${mine ? 'border-white/30 bg-white/10 text-white' : 'border-gray-200 bg-white text-gray-700'}`}>
                              <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                                <span className="flex items-center gap-2">📄 {m.attachment.name || 'Shared PDF'}</span>
                                <button
                                  type="button"
                                  onClick={() => window.open(m.attachment.url, '_blank', 'noopener,noreferrer')}
                                  className="underline underline-offset-2"
                                >
                                  Open
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => downloadAttachment(m.attachment)}
                                className={`mt-2 w-full rounded-lg px-2 py-1.5 text-xs font-semibold ${mine ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-700'}`}
                              >
                                Download attachment
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              <form onSubmit={send} className="p-4 border-t border-gray-100">
                {selectedFile && (
                  <div className="mb-3 flex items-center justify-between rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-xs text-brand-700">
                    <span>📄 {selectedFile.name}</span>
                    <button type="button" onClick={() => setSelectedFile(null)} className="font-semibold">Remove</button>
                  </div>
                )}

                <div
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={onDrop}
                  className={`mb-3 rounded-2xl border-2 border-dashed p-3 text-center text-xs transition ${
                    isDragging ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-200 bg-gray-50 text-gray-500'
                  }`}
                >
                  Drag and drop a PDF here, or use the button below
                </div>

                <div className="flex gap-2">
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message or share a PDF..."
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={onInputChange}
                    className="hidden"
                    aria-label="Upload a PDF"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-gray-300 text-gray-700 px-3 py-2 rounded-xl text-sm font-semibold"
                  >
                    Share PDF
                  </button>
                  <button className="bg-brand-gradient text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-glow">
                    Send
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
