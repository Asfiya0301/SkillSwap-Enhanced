import { Link } from 'react-router-dom';

const Home = () => (
  <main className="min-h-screen bg-brand-gradient-soft text-gray-900">
    <header className="border-b border-white/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5 text-base font-display font-extrabold tracking-tight text-brand-700">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-lg text-white shadow-glow">⇄</span>
          Skill<span className="text-accent-600">Swap</span>
        </Link>
        <nav className="flex items-center gap-5 text-xs font-semibold sm:gap-7 sm:text-sm">
          <Link to="/login" className="text-gray-500 transition hover:text-gray-900">Log in</Link>
          <Link to="/register" className="rounded-md bg-brand-600 px-4 py-2.5 text-white shadow-lg shadow-brand-600/20 transition hover:bg-accent-600">Register</Link>
        </nav>
      </div>
    </header>

    <section className="relative flex min-h-[calc(100vh-4.5rem)] items-center justify-center overflow-hidden px-5 py-20 sm:px-8">
      <div className="pointer-events-none absolute left-[-14rem] top-1/4 h-[32rem] w-[32rem] rounded-full bg-brand-200/50 blur-[100px]" aria-hidden="true" />
      <div className="pointer-events-none absolute right-[-16rem] bottom-[-18rem] h-[34rem] w-[34rem] rounded-full bg-pink-200/50 blur-[110px]" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-4xl text-center animate-fadeUp">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-700 sm:text-xs">
          <span className="text-accent-600">⇄</span> Exchange knowledge. Grow together.
        </div>
        <h1 className="mx-auto max-w-4xl text-4xl font-display font-extrabold leading-[1.08] tracking-tight text-gray-950 sm:text-6xl lg:text-[4.4rem]">
          Bridge the gap between <span className="text-brand-600">what you know</span> and <span className="text-accent-600">what you want to learn.</span>
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
          SkillSwap is a peer learning community where people share practical skills, find the right exchange, and make progress together in real time.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/register" className="inline-flex items-center gap-2 rounded-lg bg-brand-gradient px-5 py-3.5 text-sm font-bold text-white shadow-glow transition hover:-translate-y-0.5">Get started today <span aria-hidden="true">→</span></Link>
          <Link to="/login" className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-5 py-3.5 text-sm font-bold text-gray-700 transition hover:border-brand-300 hover:text-brand-700">Sign in</Link>
        </div>
        <div className="mx-auto mt-16 grid max-w-xl grid-cols-3 border-t border-gray-200 pt-6 text-left">
          <div className="border-r border-gray-200 px-3 sm:px-6"><p className="text-lg font-display font-bold text-gray-900">Teach</p><p className="mt-1 text-[11px] text-gray-500">your strengths</p></div>
          <div className="border-r border-gray-200 px-3 text-center sm:px-6"><p className="text-lg font-display font-bold text-brand-600">Match</p><p className="mt-1 text-[11px] text-gray-500">your goals</p></div>
          <div className="px-3 text-right sm:px-6"><p className="text-lg font-display font-bold text-gray-900">Learn</p><p className="mt-1 text-[11px] text-gray-500">at your pace</p></div>
        </div>
      </div>
    </section>
  </main>
);

export default Home;
