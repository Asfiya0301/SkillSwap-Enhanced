import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import * as api from '../api/services';
import { openSkillPdf } from '../utils/skillPdf';

const currency = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
}).format(value);

const Dashboard = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [booksError, setBooksError] = useState('');
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('skillswap-saved-guides') || '[]');
    } catch {
      return [];
    }
  });
  const [purchased, setPurchased] = useState([]);
  const [swapped, setSwapped] = useState([]);

  useEffect(() => {
    localStorage.setItem('skillswap-saved-guides', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    api.getBooks()
      .then(({ data }) => {
        setBooks(data.map((book) => ({ ...book, id: book._id })));
      })
      .catch(() => setBooksError('Learning guides are temporarily unavailable. Please try again shortly.'))
      .finally(() => setBooksLoading(false));
  }, []);

  const addToCart = (book) => {
    setCart((prev) => {
      const item = prev.find((entry) => entry.id === book.id);
      if (item) {
        return prev.map((entry) =>
          entry.id === book.id ? { ...entry, quantity: entry.quantity + 1 } : entry
        );
      }
      return [...prev, { ...book, quantity: 1 }];
    });
  };

  const updateCartQty = (bookId, change) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === bookId ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (bookId) => {
    setCart((prev) => prev.filter((item) => item.id !== bookId));
  };

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const purchaseCart = () => {
    if (!cart.length) return;

    const purchasedItems = [...cart];
    setPurchased((prev) => [...purchasedItems, ...prev]);
    setCart([]);
    window.alert('Purchase successful. Your books are ready in your dashboard.');
  };

  const viewGuide = (book) => {
    openSkillPdf({
      title: book.title,
      category: book.category,
      description: book.description,
      user: { name: book.author },
      tags: [book.category, 'learning guide'],
      syllabus: book.syllabus,
      roadmap: book.roadmap,
      readingNotes: book.readingNotes
    });
  };

  const requestSwap = (book) => {
    navigate('/browse', {
      state: {
        search: book.title.split(' ')[0],
        message: `Find a community member to exchange ${book.title}.`
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-600 font-semibold">Your exchange desk</p>
        <h1 className="text-3xl font-display font-extrabold mt-2">Learn, contribute, and keep the conversation moving</h1>
        <p className="text-gray-500 mt-2 max-w-2xl">Track the skills you are offering, the topics you want to explore, and the people you can learn with.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-card">
          <p className="text-sm text-gray-500">Saved resources</p>
          <h3 className="text-3xl font-bold mt-2">{cart.reduce((sum, item) => sum + item.quantity, 0)}</h3>
          <p className="text-xs text-gray-400 mt-2">Guides ready for your learning journey</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-card">
          <p className="text-sm text-gray-500">Learning resources</p>
          <h3 className="text-3xl font-bold mt-2">{purchased.length}</h3>
          <p className="text-xs text-gray-400 mt-2">Resources you have unlocked</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-card">
          <p className="text-sm text-gray-500">Exchange requests</p>
          <h3 className="text-3xl font-bold mt-2">{swapped.length}</h3>
          <p className="text-xs text-gray-400 mt-2">People you have invited to learn together</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-5 mb-8">
        <section className="rounded-2xl bg-gray-950 text-white p-6 shadow-card">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-200 font-semibold">Your exchange plan</p>
          <h2 className="text-2xl font-display font-bold mt-2">Make every interaction useful</h2>
          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <div className="border-l-2 border-brand-300 pl-3">
              <p className="text-sm font-semibold">Offer</p>
              <p className="text-xs text-gray-400 mt-1">Share what you know with clarity.</p>
            </div>
            <div className="border-l-2 border-emerald-300 pl-3">
              <p className="text-sm font-semibold">Exchange</p>
              <p className="text-xs text-gray-400 mt-1">Find a fair way to learn together.</p>
            </div>
            <div className="border-l-2 border-amber-300 pl-3">
              <p className="text-sm font-semibold">Reflect</p>
              <p className="text-xs text-gray-400 mt-1">Share thoughts and keep improving.</p>
            </div>
          </div>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-card">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-600 font-semibold">Keep exploring</p>
          <h2 className="text-xl font-display font-bold mt-2">Ready for a new perspective?</h2>
          <p className="text-sm text-gray-500 mt-2 leading-6">Browse the community, find a compatible learning goal, and start with a message before you request a swap.</p>
          <Link to="/browse" className="inline-flex mt-5 bg-brand-gradient text-white font-semibold px-4 py-2.5 rounded-xl shadow-glow hover:opacity-95 transition-all">Browse exchanges</Link>
        </section>
      </div>

      <div className="grid xl:grid-cols-[1.6fr_0.8fr] gap-6">
        <div className="space-y-5">
          <div className="mb-1">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-semibold">Supporting resources</p>
            <h2 className="text-2xl font-display font-bold mt-1 mb-4">Guides for your next exchange</h2>
          </div>
          {booksLoading && <p className="text-sm text-gray-400">Loading learning guides...</p>}
          {booksError && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-4">{booksError}</p>}
          {!booksLoading && !booksError && books.length === 0 && (
            <p className="text-sm text-gray-400">No learning guides are available yet.</p>
          )}
          {!booksLoading && !booksError && books.map((book) => (
            <div key={book.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-card">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-brand-50 text-brand-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {book.category}
                    </span>
                    <span className="text-xs text-gray-400">Conversation starter guide</span>
                  </div>
                  <h2 className="text-xl font-display font-bold">{book.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">by {book.author}</p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-brand-700">{currency(book.price)}</p>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-600">{book.description}</p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => addToCart(book)}
                  className={`font-semibold px-5 py-2.5 rounded-xl shadow-glow hover:opacity-95 transition-all ${cart.some((item) => item.id === book.id) ? 'bg-emerald-600 text-white' : 'bg-brand-gradient text-white'}`}
                >
                  {cart.some((item) => item.id === book.id) ? 'Saved to guides' : 'Save guide'}
                </button>

                <button
                  onClick={() => viewGuide(book)}
                  className="border border-gray-200 text-gray-700 font-semibold px-5 py-2.5 rounded-xl hover:border-brand-400 hover:text-brand-700 transition-all"
                >
                  Read learning guide
                </button>

                <button
                  onClick={() => requestSwap(book)}
                  className="px-5 py-2.5 rounded-xl font-semibold transition-all bg-gray-100 text-gray-800 hover:bg-gray-200"
                >
                  Find a swap partner
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="bg-white border border-gray-100 rounded-2xl p-5 shadow-card h-fit">
          <h2 className="text-xl font-display font-bold mb-1">Saved learning guides</h2>
          <p className="text-sm text-gray-500 mb-4">Keep useful material close while you plan an exchange.</p>

          {cart.length === 0 ? (
            <p className="text-gray-500 text-sm">No guides saved yet. Add one to support your next conversation.</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="border border-gray-100 rounded-xl p-3">
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p className="text-xs text-gray-500">{currency(item.price)} each</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateCartQty(item.id, -1)}
                        className="w-8 h-8 text-lg text-gray-600 hover:bg-gray-100"
                        aria-label={`Decrease quantity for ${item.title}`}
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQty(item.id, 1)}
                        className="w-8 h-8 text-lg text-gray-600 hover:bg-gray-100"
                        aria-label={`Increase quantity for ${item.title}`}
                      >
                        +
                      </button>
                    </div>

                    <p className="font-semibold text-sm">{currency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{currency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
                <div className="flex items-center justify-between font-bold text-lg mt-4">
                  <span>Total</span>
                  <span>{currency(subtotal)}</span>
                </div>
              </div>

              <button
                onClick={purchaseCart}
                className="w-full mt-5 bg-brand-gradient text-white font-semibold py-3 rounded-xl shadow-glow hover:opacity-95 transition-all"
              >
                Unlock guides
              </button>
            </div>
          )}

          {purchased.length > 0 && (
            <div className="mt-8 border-t border-gray-200 pt-5">
              <h3 className="font-display font-bold text-lg mb-3">Unlocked guides</h3>
              <div className="space-y-2">
                {purchased.map((item) => (
                  <div key={`${item.id}-purchased`} className="text-sm text-gray-600 flex justify-between gap-3">
                    <span>{item.title}</span>
                    <span>{currency(item.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
