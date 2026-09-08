import { Link } from 'react-router-dom';

const pathways = [
  { icon: '01', title: 'Set your direction', text: 'Add the skills you can teach and the ones you want to learn.' },
  { icon: '02', title: 'Meet a match', text: 'Browse people with a useful overlap in goals and experience.' },
  { icon: '03', title: 'Make progress', text: 'Message, plan sessions, and keep resources in one workspace.' }
];

const Home = () => (
  <main className="min-h-screen bg-brand-gradient-soft text-gray-900">
    <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
      <Link to="/" className="flex items-center gap-2 text-lg font-display font-extrabold text-brand-700">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-sm text-white shadow-glow">⇄</span>
        SkillSwap
      </Link>
      <div className="flex items-center gap-3 text-sm font-semibold">
        <Link to="/login" className="hidden text-gray-500 transition hover:text-gray-900 sm:inline">Log in</Link>
        <Link to="/register" className="rounded-xl bg-gray-950 px-4 py-2.5 text-white transition hover:bg-brand-600">Create account</Link>
      </div>
    </header>

    <section className="mx-auto max-w-6xl px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:pb-14 lg:pt-10">
      <div className="relative overflow-hidden rounded-3xl bg-gray-950 px-6 py-9 text-white shadow-card sm:px-10 sm:py-12 lg:px-14 lg:py-16">
        <div className="absolute right-[-5rem] top-[-8rem] h-72 w-72 rounded-full bg-brand-600/40 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-[-7rem] right-1/4 h-52 w-52 rounded-full bg-accent-500/30 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-3xl animate-fadeUp">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-brand-200">Learn together. Share what you know.</p>
          <h1 className="max-w-2xl text-4xl font-display font-extrabold leading-tight sm:text-5xl lg:text-6xl">Your next useful conversation starts here.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">SkillSwap helps you find people to teach, learn from, and build momentum with, one practical exchange at a time.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-gray-950 transition hover:bg-brand-50">Join the exchange <span aria-hidden="true">→</span></Link>
            <Link to="/login" className="rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:border-white/50 hover:bg-white/10">I already have an account</Link>
          </div>
        </div>
        <div className="relative mt-10 grid max-w-3xl gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
          <div><p className="text-2xl font-display font-bold">1:1</p><p className="mt-1 text-xs text-gray-400">focused learning</p></div>
          <div><p className="text-2xl font-display font-bold">Live</p><p className="mt-1 text-xs text-gray-400">real conversations</p></div>
          <div><p className="text-2xl font-display font-bold">Your pace</p><p className="mt-1 text-xs text-gray-400">flexible exchanges</p></div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">A better starting point</p>
          <h2 className="mt-3 max-w-xl text-2xl font-display font-extrabold sm:text-3xl">Bring a goal. Leave with a plan.</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">Whether you are changing careers, sharpening a craft, or finally making time for a curiosity, the right exchange makes learning easier to keep.</p>
          <div className="mt-7 flex flex-wrap gap-2">
            {['Design', 'Programming', 'Languages', 'Business', 'Creative skills'].map((topic) => <span key={topic} className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">{topic}</span>)}
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-card sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-600">Built for follow-through</p>
          <div className="mt-5 space-y-4">
            {['Find people, not just content', 'Keep your conversations in one place', 'Share guides and track progress'].map((item) => <div key={item} className="flex items-center gap-3 text-sm font-semibold text-gray-700"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-500/10 text-sm text-accent-600">✓</span>{item}</div>)}
          </div>
        </div>
      </div>
    </section>

    <section className="border-y border-gray-200/80 bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-9 max-w-xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">How it works</p><h2 className="mt-3 text-3xl font-display font-extrabold">Small steps. Real progress.</h2></div>
        <div className="grid gap-5 md:grid-cols-3">
          {pathways.map((pathway) => <article key={pathway.icon} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card"><span className="text-sm font-bold text-accent-600">{pathway.icon}</span><h3 className="mt-8 font-display text-lg font-bold">{pathway.title}</h3><p className="mt-2 text-sm leading-6 text-gray-500">{pathway.text}</p></article>)}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
      <h2 className="text-3xl font-display font-extrabold sm:text-4xl">Ready to make the swap?</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500">Create a profile, share your strengths, and find your next learning partner.</p>
      <Link to="/register" className="mt-7 inline-flex rounded-xl bg-brand-gradient px-6 py-3 text-sm font-bold text-white shadow-glow transition hover:opacity-95">Create your profile</Link>
    </section>
  </main>
);

export default Home;
