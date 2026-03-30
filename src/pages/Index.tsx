import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const TRACKS = [
  { id: 1, title: "Гостиница Сновидений", album: "Гостиница Сновидений", year: "2025", duration: 214 },
  { id: 2, title: "Зов далёких звёзд", album: "Зов далёких звёзд", year: "2025", duration: 198 },
  { id: 3, title: "Ночи в Париже", album: "Ночи в Париже", year: "2025", duration: 237 },
];

const GALLERY = [
  { id: 1, src: "https://cdn.poehali.dev/projects/08cf3404-1c1f-4f8b-bcb4-9a2d60e53895/files/e8637f85-e362-4878-a574-ff0e639fde8f.jpg", caption: "На сцене, 1989" },
  { id: 2, src: "https://cdn.poehali.dev/projects/08cf3404-1c1f-4f8b-bcb4-9a2d60e53895/files/e8637f85-e362-4878-a574-ff0e639fde8f.jpg", caption: "Студийная запись, 1991" },
  { id: 3, src: "https://cdn.poehali.dev/projects/08cf3404-1c1f-4f8b-bcb4-9a2d60e53895/files/e8637f85-e362-4878-a574-ff0e639fde8f.jpg", caption: "Концерт в Ленинграде, 1993" },
];

const BLOG_POSTS = [
  {
    id: 1,
    date: "12 марта 2026",
    title: "Как рождается песня: от первой строчки до записи",
    excerpt: "Иногда достаточно одного слова, случайно услышанного в разговоре, чтобы вся история развернулась сама...",
    tag: "Творчество",
  },
  {
    id: 2,
    date: "28 февраля 2026",
    title: "О важности тишины в музыке",
    excerpt: "Паузы — это не молчание. Это дыхание музыки. Я учился этому годами, пока не понял...",
    tag: "Мысли",
  },
  {
    id: 3,
    date: "10 февраля 2026",
    title: "Гастроли 1988: дорога, холод и гитара",
    excerpt: "Мы ехали на автобусе шесть часов. Отопление не работало. Но зал был полным...",
    tag: "Воспоминания",
  },
];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const track = TRACKS[currentTrack];

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          if (next >= track.duration) {
            setIsPlaying(false);
            return 0;
          }
          setProgress((next / track.duration) * 100);
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, track.duration]);

  const playTrack = (idx: number) => {
    if (idx === currentTrack) {
      setIsPlaying((p) => !p);
    } else {
      setCurrentTrack(idx);
      setIsPlaying(true);
      setElapsed(0);
      setProgress(0);
    }
  };

  const prevTrack = () => {
    setCurrentTrack((p) => (p - 1 + TRACKS.length) % TRACKS.length);
    setElapsed(0); setProgress(0);
  };

  const nextTrack = () => {
    setCurrentTrack((p) => (p + 1) % TRACKS.length);
    setElapsed(0); setProgress(0);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) return;
    setFormStatus("sending");
    try {
      const res = await fetch("https://functions.poehali.dev/67060553-72c6-4cdd-a221-4ce44ff4af1d", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormStatus("sent");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navItems = [
    { id: "home", label: "Главная" },
    { id: "music", label: "Музыка" },
    { id: "about", label: "Об авторе" },
    { id: "gallery", label: "Галерея" },
    { id: "blog", label: "Блог" },
    { id: "contact", label: "Контакты" },
  ];

  return (
    <div className="min-h-screen bg-background font-cormorant">

      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-oswald text-lg tracking-[0.2em] uppercase text-foreground">
            AGVMusic
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`nav-link font-oswald text-xs tracking-[0.15em] uppercase transition-colors ${
                  activeSection === item.id
                    ? "text-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden vintage-card border-t border-border px-6 py-4 flex flex-col gap-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="font-oswald text-xs tracking-[0.15em] uppercase text-left text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(https://cdn.poehali.dev/projects/08cf3404-1c1f-4f8b-bcb4-9a2d60e53895/files/e8637f85-e362-4878-a574-ff0e639fde8f.jpg)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-caveat text-accent text-xl mb-3 fade-up-delay-1">автор песен</p>
            <h1 className="font-cormorant text-6xl md:text-8xl font-light leading-[0.9] text-foreground fade-up-delay-2">
              Алексей<br />
              <span className="italic font-light">Васильченко</span>
            </h1>
            <div className="ornament my-8 fade-up-delay-3">
              <span className="text-xs font-oswald tracking-[0.3em] uppercase text-muted-foreground">с 2025 года</span>
            </div>
            <p className="text-foreground/70 text-xl font-light leading-relaxed fade-up-delay-4 max-w-md">
              Песни о дорогах, которые мы выбираем. О людях, которых помним. О времени, которое не возвращается.
            </p>
            <div className="flex gap-4 mt-10 fade-up-delay-4">
              <button
                onClick={() => scrollTo("music")}
                className="font-oswald text-xs tracking-[0.2em] uppercase px-8 py-3 bg-primary text-primary-foreground hover:bg-accent transition-colors"
              >
                Слушать
              </button>
              <button
                onClick={() => scrollTo("about")}
                className="font-oswald text-xs tracking-[0.2em] uppercase px-8 py-3 border border-border text-foreground hover:border-accent hover:text-accent transition-colors"
              >
                Об авторе
              </button>
            </div>
          </div>

          {/* Vinyl */}
          <div className="hidden md:flex justify-center items-center">
            <div className="relative w-72 h-72">
              <div
                className={`w-full h-full rounded-full shadow-2xl ${isPlaying ? "vinyl-spin" : ""}`}
                style={{
                  background: "radial-gradient(circle at 35% 35%, #3a3a3a, #1a1a1a 60%, #0d0d0d)",
                  boxShadow: "0 0 0 2px hsl(30 20% 60%), 0 20px 60px rgba(0,0,0,0.4)"
                }}
              >
                {[40, 70, 100, 130].map((r) => (
                  <div key={r} className="absolute rounded-full border border-white/5"
                    style={{ top: `${r}px`, left: `${r}px`, right: `${r}px`, bottom: `${r}px` }} />
                ))}
                <div className="absolute inset-[90px] rounded-full flex flex-col items-center justify-center text-center"
                  style={{ background: "hsl(35 30% 82%)", border: "1px solid hsl(30 25% 68%)" }}>
                  <p className="font-oswald text-[8px] tracking-[0.15em] uppercase text-muted-foreground">А. Васильченко</p>
                  <p className="font-cormorant italic text-[10px] text-foreground leading-tight mt-0.5">
                    {track.title}
                  </p>
                  <div className="w-3 h-3 rounded-full mt-1" style={{ background: "#1a1a1a" }} />
                </div>
              </div>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 hover:opacity-100 transition-opacity bg-black/20"
              >
                <Icon name={isPlaying ? "Pause" : "Play"} size={40} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground animate-bounce">
          <Icon name="ChevronDown" size={20} />
        </div>
      </section>

      {/* PLAYER BAR */}
      <div className="sticky top-16 z-40 vintage-card border-y border-border px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button onClick={prevTrack} className="text-muted-foreground hover:text-foreground transition-colors">
              <Icon name="SkipBack" size={16} />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-accent transition-colors"
            >
              <Icon name={isPlaying ? "Pause" : "Play"} size={14} />
            </button>
            <button onClick={nextTrack} className="text-muted-foreground hover:text-foreground transition-colors">
              <Icon name="SkipForward" size={16} />
            </button>
          </div>

          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="min-w-0">
              <p className="font-cormorant text-sm font-medium truncate">{track.title}</p>
              <p className="font-oswald text-[10px] tracking-widest uppercase text-muted-foreground truncate">{track.album}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1">
            <span className="font-oswald text-xs text-muted-foreground w-10 text-right">{formatTime(elapsed)}</span>
            <div className="progress-track flex-1" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              const newElapsed = Math.floor(pct * track.duration);
              setElapsed(newElapsed);
              setProgress(pct * 100);
            }}>
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="font-oswald text-xs text-muted-foreground w-10">{formatTime(track.duration)}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <Icon name="Volume2" size={14} className="text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* MUSIC */}
      <section id="music" className="py-24 max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <p className="font-caveat text-accent text-lg mb-1">слушать</p>
          <h2 className="font-cormorant text-5xl font-light">Музыка</h2>
          <div className="ornament mt-4">
            <span className="text-xs font-oswald tracking-[0.3em] uppercase text-muted-foreground">дискография</span>
          </div>
        </div>

        <div className="space-y-1">
          {TRACKS.map((t, idx) => (
            <div
              key={t.id}
              onClick={() => playTrack(idx)}
              className={`flex items-center gap-6 px-5 py-4 cursor-pointer transition-all group ${
                currentTrack === idx
                  ? "vintage-card"
                  : "hover:bg-secondary/50 border border-transparent"
              }`}
            >
              <div className="w-8 text-center">
                {currentTrack === idx && isPlaying ? (
                  <div className="flex gap-0.5 items-end h-4 justify-center">
                    {[3, 5, 4].map((h, i) => (
                      <div key={i} className="w-0.5 bg-accent rounded-full animate-bounce"
                        style={{ height: `${h * 3}px`, animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                ) : (
                  <>
                    <span className="font-oswald text-xs text-muted-foreground group-hover:hidden">{idx + 1}</span>
                    <Icon name="Play" size={12} className="text-accent hidden group-hover:block mx-auto" />
                  </>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-cormorant text-lg ${currentTrack === idx ? "text-accent" : "text-foreground"}`}>
                  {t.title}
                </p>
                <p className="font-oswald text-[10px] tracking-widest uppercase text-muted-foreground">{t.album}</p>
              </div>
              <span className="font-oswald text-xs text-muted-foreground">{t.year}</span>
              <span className="font-oswald text-xs text-muted-foreground">{formatTime(t.duration)}</span>
            </div>
          ))}
        </div>

        <div className="mt-10 vintage-card px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-oswald text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">Доступно на всех площадках</p>
            <p className="font-cormorant text-lg text-foreground">Слушайте в Яндекс Музыке, ВКонтакте, Spotify и других сервисах</p>
          </div>
          <div className="flex gap-3 shrink-0">
            {["Яндекс", "VK", "Spotify"].map((s) => (
              <button key={s} className="font-oswald text-[10px] tracking-[0.15em] uppercase px-4 py-2 border border-border hover:border-accent hover:text-accent transition-colors text-muted-foreground">
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 bg-card/40">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img
              src="https://cdn.poehali.dev/projects/08cf3404-1c1f-4f8b-bcb4-9a2d60e53895/files/e8637f85-e362-4878-a574-ff0e639fde8f.jpg"
              alt="Алексей Васильченко"
              className="w-full aspect-[3/4] object-cover vintage-border"
              style={{ filter: "sepia(40%) contrast(1.05)" }}
            />
            <div className="absolute -bottom-4 -right-4 vintage-card px-5 py-3">
              <p className="font-caveat text-accent text-lg">«Слова — это ноты для души»</p>
            </div>
          </div>

          <div>
            <p className="font-caveat text-accent text-lg mb-1">история</p>
            <h2 className="font-cormorant text-5xl font-light mb-6">Об авторе</h2>
            <div className="ornament mb-8">
              <span className="text-xs font-oswald tracking-[0.3em] uppercase text-muted-foreground">2025 — наши дни</span>
            </div>
            <div className="space-y-4 text-foreground/80 text-lg leading-relaxed">
              <p>
                Музыка и поэзия — моя стихия: пишу стихи, сочиняю песни, объединяя слово и звук
                в единое целое.
              </p>
              <p>
                Литература: создаю рассказы в разных форматах — от притчей до современной прозы.
              </p>
              <p>
                Стихи и тексты песен — эксперименты в разных стилях. Музыка — здесь мои тексты
                оживают в «кружевах звука».
              </p>
            </div>

            <div className="vintage-card px-5 py-4 mt-6 flex items-center gap-3">
              <Icon name="Award" size={16} className="text-accent shrink-0" />
              <p className="font-oswald text-xs tracking-[0.15em] uppercase text-foreground">
                Член Союза Писателей России
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-8">
              {[
                { num: "3", label: "альбома" },
                { num: "∞", label: "стилей" },
                { num: "2025", label: "старт" },
              ].map((stat) => (
                <div key={stat.label} className="text-center vintage-card p-4">
                  <p className="font-cormorant text-4xl font-light text-accent">{stat.num}</p>
                  <p className="font-oswald text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-24 max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <p className="font-caveat text-accent text-lg mb-1">архив</p>
          <h2 className="font-cormorant text-5xl font-light">Галерея</h2>
          <div className="ornament mt-4">
            <span className="text-xs font-oswald tracking-[0.3em] uppercase text-muted-foreground">фотографии</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GALLERY.map((item) => (
            <div key={item.id} className="group relative overflow-hidden vintage-border cursor-pointer">
              <img
                src={item.src}
                alt={item.caption}
                className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ filter: "sepia(50%) contrast(1.1) brightness(0.95)" }}
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors duration-300 flex items-end">
                <p className="font-caveat text-primary-foreground text-lg p-4 translate-y-8 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BLOG */}
      <section id="blog" className="py-24 bg-card/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <p className="font-caveat text-accent text-lg mb-1">записки</p>
            <h2 className="font-cormorant text-5xl font-light">Блог</h2>
            <div className="ornament mt-4">
              <span className="text-xs font-oswald tracking-[0.3em] uppercase text-muted-foreground">мысли автора</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post) => (
              <article key={post.id} className="vintage-card blog-card p-6 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-oswald text-[10px] tracking-[0.2em] uppercase text-accent border border-accent px-2 py-0.5">
                    {post.tag}
                  </span>
                  <span className="font-oswald text-xs text-muted-foreground">{post.date}</span>
                </div>
                <h3 className="font-cormorant text-xl font-medium text-foreground leading-snug mb-3">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                <button className="mt-5 font-oswald text-[10px] tracking-[0.2em] uppercase text-accent hover:text-foreground transition-colors flex items-center gap-2">
                  Читать <Icon name="ArrowRight" size={10} />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 max-w-6xl mx-auto px-6">
        <div className="max-w-lg mx-auto text-center">
          <p className="font-caveat text-accent text-lg mb-1">связаться</p>
          <h2 className="font-cormorant text-5xl font-light mb-4">Контакты</h2>
          <div className="ornament mb-10">
            <span className="text-xs font-oswald tracking-[0.3em] uppercase text-muted-foreground">написать автору</span>
          </div>

          <div className="vintage-card p-8 text-left space-y-5">
            {formStatus === "sent" ? (
              <div className="py-10 text-center">
                <Icon name="CheckCircle" size={36} className="text-accent mx-auto mb-4" />
                <p className="font-cormorant text-2xl text-foreground mb-2">Письмо отправлено!</p>
                <p className="font-oswald text-xs tracking-widest uppercase text-muted-foreground">Алексей ответит вам в ближайшее время</p>
                <button onClick={() => setFormStatus("idle")} className="mt-6 font-oswald text-[10px] tracking-[0.2em] uppercase text-accent hover:text-foreground transition-colors">
                  Написать ещё
                </button>
              </div>
            ) : (
              <>
                <div>
                  <label className="font-oswald text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-2">
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    placeholder="Иван Петров"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    className="w-full bg-background border border-border px-4 py-3 font-cormorant text-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="font-oswald text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-2">
                    Электронная почта
                  </label>
                  <input
                    type="email"
                    placeholder="ivan@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    className="w-full bg-background border border-border px-4 py-3 font-cormorant text-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="font-oswald text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-2">
                    Сообщение
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Ваше сообщение..."
                    value={formData.message}
                    onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                    className="w-full bg-background border border-border px-4 py-3 font-cormorant text-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent transition-colors resize-none"
                  />
                </div>
                {formStatus === "error" && (
                  <p className="font-oswald text-[10px] tracking-widest uppercase text-destructive">
                    Ошибка отправки. Попробуйте позже.
                  </p>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={formStatus === "sending"}
                  className="w-full font-oswald text-xs tracking-[0.25em] uppercase py-4 bg-primary text-primary-foreground hover:bg-accent transition-colors disabled:opacity-50"
                >
                  {formStatus === "sending" ? "Отправляю..." : "Отправить письмо"}
                </button>
              </>
            )}
          </div>

          <div className="vintage-card px-6 py-4 mt-8 flex items-center gap-3">
            <Icon name="Mail" size={14} className="text-accent shrink-0" />
            <a href="mailto:alex.shaman1313@gmail.com" className="font-cormorant text-lg text-foreground hover:text-accent transition-colors">
              alex.shaman1313@gmail.com
            </a>
          </div>

          <div className="flex justify-center gap-8 mt-8">
            {[
              { icon: "Music", label: "ВКонтакте" },
              { icon: "Youtube", label: "YouTube" },
              { icon: "Mail", label: "Email" },
            ].map((s) => (
              <button key={s.label} className="flex flex-col items-center gap-2 text-muted-foreground hover:text-accent transition-colors group">
                <div className="w-10 h-10 border border-border group-hover:border-accent rounded-full flex items-center justify-center transition-colors">
                  <Icon name={s.icon} fallback="Music" size={14} />
                </div>
                <span className="font-oswald text-[9px] tracking-[0.2em] uppercase">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-oswald text-xs tracking-[0.2em] uppercase text-muted-foreground">
            © 2026 AGVMusic
          </p>
          <div className="ornament flex-1 mx-8 hidden md:flex">
            <span />
          </div>
          <p className="font-caveat text-muted-foreground text-sm">
            Музыка живёт, пока её помнят
          </p>
        </div>
      </footer>
    </div>
  );
}