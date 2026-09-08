import { Link } from 'react-router-dom';

const featuredSkills = [
  { category: 'Design', title: 'UI systems for real products', mentor: 'Nisha', color: 'bg-[#e6e2ff]', accent: 'text-[#5546c9]' },
  { category: 'Engineering', title: 'Build APIs that stay simple', mentor: 'Arjun', color: 'bg-[#d9f2ed]', accent: 'text-[#197d6b]' },
  { category: 'Languages', title: 'Conversational Spanish', mentor: 'Maya', color: 'bg-[#ffe5d5]', accent: 'text-[#c75a2d]' },
];

const Home = () => (
  <main className="min-h-screen overflow-hidden bg-[#fbfaf7] text-slate-900">
    <section className="relative border-b border-slate-200/80">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute right-[-10rem] top-[-12rem] h-[30rem] w-[30rem] rounded-full bg-[#dedbff]/70 blur-3xl" />
        <div className="absolute left-[-12rem] bottom-[-14rem] h-[28rem] w-[28rem] rounded-full bg-[#ffe3d1]/60 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-20 pt-16 lg:grid-cols-[1.08fr_.92fr] lg:px-8 lg:pb-28 lg:pt-24">
        <div className="animate-fadeUp">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-slate-500 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#ff7e5f]" /> Learn in public
          </p>
          <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.04] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Trade what you know for what you want to learn.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
            SkillSwap brings curious people together for practical, human-sized learning exchanges.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link to="/register" className="rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-[#5647d6]">
              Start swapping <span aria-hidden="true">&#8594;</span>
            </Link>
            <Link to="/login" className="rounded-xl border border-slate-300 bg-white/80 px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-[#6c63e8] hover:text-[#5647d6]">
              Sign in
            </Link>
          </div>
          <div className="mt-12 flex items-center gap-4 text-sm text-slate-500">
            <div className="flex -space-x-2" aria-hidden="true">
              {['bg-[#ffb29b]', 'bg-[#b9b3f7]', 'bg-[#9bd9ca]', 'bg-[#f6d28d]'].map((color) => <span key={color} className={`h-8 w-8 rounded-full border-2 border-[#fbfaf7] ${color}`} />)}
            </div>
            <span><strong className="text-slate-800">1:1 learning</strong> with people who get it</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md animate-fadeUp [animation-delay:120ms]">
          <div className="absolute -right-4 top-8 rounded-2xl border border-white/80 bg-white px-4 py-3 shadow-xl shadow-slate-900/10 sm:-right-8">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">This week</p>
            <p className="mt-1 text-sm font-bold text-slate-800">48 new exchanges</p>
          </div>
          <div className="rounded-[2rem] border border-white/80 bg-slate-950 p-4 shadow-2xl shadow-[#5647d6]/20 sm:p-5">
            <div className="rounded-[1.5rem] bg-[#f2f0ff] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#5647d6]">Your next exchange</span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500">2 people</span>
              </div>
              <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <span className="text-2xl">&#127912;</span>
                  <p className="mt-4 text-sm font-bold text-slate-800">You teach</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Product design basics</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5647d6] text-lg text-white">&#8644;</span>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <span className="text-2xl">&#128187;</span>
                  <p className="mt-4 text-sm font-bold text-slate-800">You learn</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">React fundamentals</p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between rounded-xl bg-white/70 px-4 py-3 text-xs">
                <span className="font-semibold text-slate-600">Next session</span>
                <span className="font-bold text-[#5647d6]">Thursday, 6:30 PM</span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-5 rounded-2xl border border-white/80 bg-white px-4 py-3 shadow-xl shadow-slate-900/10 sm:-left-10">
            <p className="text-xs font-bold text-emerald-600">&#10003; Matched for you</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">Based on your goals</p>
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f4633f]">Find your people</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">A skill exchange starts with a spark.</h2>
        </div>
        <Link to="/register" className="text-sm font-bold text-[#5647d6] hover:underline">Create your profile &#8594;</Link>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {featuredSkills.map((skill) => (
          <article key={skill.title} className={`rounded-3xl ${skill.color} p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10`}>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
              <span className={skill.accent}>{skill.category}</span>
              <span className="rounded-full bg-white/70 px-2.5 py-1 text-slate-500">1:1</span>
            </div>
            <h3 className="mt-16 max-w-xs text-2xl font-extrabold leading-tight text-slate-900">{skill.title}</h3>
            <p className="mt-5 text-sm font-semibold text-slate-600">with {skill.mentor}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="border-y border-slate-200/80 bg-white/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#5647d6]">Keep it simple</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">From curious to capable in three steps.</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {[['01', 'Share a skill', 'Tell the community what you can teach and what you want to discover.'], ['02', 'Find a match', 'Browse real people, compare skills, and start a conversation.'], ['03', 'Learn together', 'Plan sessions, share resources, and make steady progress.']].map(([number, title, text]) => (
            <div key={number}>
              <span className="text-sm font-extrabold text-[#ff7e5f]">{number}</span>
              <h3 className="mt-5 text-lg font-extrabold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-6 py-20 text-center lg:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f4633f]">Your next chapter is teachable</p>
      <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">Bring one skill. Leave with another.</h2>
      <Link to="/register" className="mt-8 inline-flex rounded-xl bg-[#5647d6] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#5647d6]/20 transition hover:-translate-y-0.5 hover:bg-[#4636b3]">Join SkillSwap</Link>
    </section>
  </main>
);

export default Home;
