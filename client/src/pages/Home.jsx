import { Link } from 'react-router-dom';

const Home = () => (
  <main className="min-h-screen bg-[#050817] text-white">
    <header className="border-b border-white/[0.06] bg-[#10182a]/95">
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5 text-base font-display font-extrabold tracking-tight text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#19d3a2]/30 bg-[#0d2d32] text-lg text-[#19d3a2]">⇄</span>
          Skill<span className="text-[#19d3a2]">Swap</span>
        </Link>
        <nav className="flex items-center gap-5 text-xs font-semibold sm:gap-7 sm:text-sm">
          <span className="hidden text-amber-300 sm:inline" aria-hidden="true">☼</span>
          <Link to="/login" className="text-slate-200 transition hover:text-white">Log in</Link>
          <Link to="/register" className="rounded-md bg-[#08a77e] px-4 py-2.5 text-white shadow-lg shadow-[#08a77e]/10 transition hover:bg-[#19c592]">Register</Link>
        </nav>
      </div>
    </header>

    <section className="relative flex min-h-[calc(100vh-4.5rem)] items-center justify-center overflow-hidden px-5 py-20 sm:px-8">
      <div className="pointer-events-none absolute left-[-14rem] top-1/4 h-[32rem] w-[32rem] rounded-full bg-[#064d59]/20 blur-[100px]" aria-hidden="true" />
      <div className="pointer-events-none absolute right-[-16rem] bottom-[-18rem] h-[34rem] w-[34rem] rounded-full bg-[#0b3140]/20 blur-[110px]" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-4xl text-center animate-fadeUp">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#0db58c]/35 bg-[#092c32] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#42e0b7] sm:text-xs">
          <span className="text-[#19d3a2]">⇄</span> Exchange knowledge. Grow together.
        </div>
        <h1 className="mx-auto max-w-4xl text-4xl font-display font-extrabold leading-[1.08] tracking-tight text-slate-50 sm:text-6xl lg:text-[4.4rem]">
          Bridge the gap between <span className="text-[#19d3a2]">what you know</span> and <span className="text-[#19d3a2]">what you want to learn.</span>
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          SkillSwap is a peer learning community where people share practical skills, find the right exchange, and make progress together in real time.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/register" className="inline-flex items-center gap-2 rounded-lg bg-[#08a77e] px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-[#08a77e]/20 transition hover:-translate-y-0.5 hover:bg-[#19c592]">Get started today <span aria-hidden="true">→</span></Link>
          <Link to="/login" className="inline-flex items-center rounded-lg border border-white/10 bg-[#111a2d] px-5 py-3.5 text-sm font-bold text-slate-100 transition hover:border-white/25 hover:bg-[#18233b]">Sign in</Link>
        </div>
        <div className="mx-auto mt-16 grid max-w-xl grid-cols-3 border-t border-white/[0.07] pt-6 text-left">
          <div className="border-r border-white/[0.12] px-3 sm:px-6"><p className="text-lg font-display font-bold text-white">Teach</p><p className="mt-1 text-[11px] text-slate-300">your strengths</p></div>
          <div className="border-r border-white/[0.12] px-3 text-center sm:px-6"><p className="text-lg font-display font-bold text-[#42e0b7]">Match</p><p className="mt-1 text-[11px] text-slate-300">your goals</p></div>
          <div className="px-3 text-right sm:px-6"><p className="text-lg font-display font-bold text-white">Learn</p><p className="mt-1 text-[11px] text-slate-300">at your pace</p></div>
        </div>
      </div>
    </section>
  </main>
);

export default Home;
