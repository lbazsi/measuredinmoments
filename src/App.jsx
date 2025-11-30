import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import ProjectsPage from './components/ProjectsPage';

function Navigation({ currentPage, setCurrentPage, language, setLanguage, t, isScrolled }) {
  return (
    <nav 
      className={`fixed top-0 w-full transition-all duration-300 z-50 ${
        isScrolled 
          ? 'bg-beige-50 shadow-lg' 
          : 'bg-white/95 backdrop-blur-sm shadow-sm'
      }`}
    >
      <div className="w-full px-6 py-4 flex justify-between items-center">
        {/* LEFT: logo + nav links */}
        <div className="flex items-center gap-8">
          {/* Logo – site icon, not a button */}
          <img
            src="/logo.png"
            alt="Measured in Moments logo"
            className="w-10 h-10 object-contain"
          />

          {/* Nav links group */}
          <div className="flex gap-6">
            <button 
              onClick={() => setCurrentPage('home')} 
              className={`text-base font-medium px-3 py-2 rounded-md transition-all ${
                currentPage === 'home'
                  ? isScrolled
                    ? 'text-beige-900 bg-beige-200'
                    : 'text-beige-900 bg-beige-100'
                  : isScrolled 
                    ? 'text-beige-800 hover:text-beige-900 hover:bg-beige-100' 
                    : 'text-beige-800 hover:text-beige-900 hover:bg-beige-50'
              }`}
            >
              {t.nav.why}
            </button>
            <button 
              onClick={() => setCurrentPage('resources')} 
              className={`text-base font-medium px-3 py-2 rounded-md transition-all ${
                currentPage === 'resources'
                  ? isScrolled
                    ? 'text-beige-900 bg-beige-200'
                    : 'text-beige-900 bg-beige-100'
                  : isScrolled 
                    ? 'text-beige-800 hover:text-beige-900 hover:bg-beige-100' 
                    : 'text-beige-800 hover:text-beige-900 hover:bg-beige-50'
              }`}
            >
              {t.nav.resources}
            </button>
            <button 
              onClick={() => setCurrentPage('projects')} 
              className={`text-base font-medium px-3 py-2 rounded-md transition-all ${
                currentPage === 'projects'
                  ? isScrolled
                    ? 'text-beige-900 bg-beige-200'
                    : 'text-beige-900 bg-beige-100'
                  : isScrolled 
                    ? 'text-beige-800 hover:text-beige-900 hover:bg-beige-100' 
                    : 'text-beige-800 hover:text-beige-900 hover:bg-beige-50'
              }`}
            >
              {t.nav.projects}
            </button>
            <button 
              onClick={() => setCurrentPage('community')} 
              className={`text-base font-medium px-3 py-2 rounded-md transition-all ${
                currentPage === 'community'
                  ? isScrolled
                    ? 'text-beige-900 bg-beige-200'
                    : 'text-beige-900 bg-beige-100'
                  : isScrolled 
                    ? 'text-beige-800 hover:text-beige-900 hover:bg-beige-100' 
                    : 'text-beige-800 hover:text-beige-900 hover:bg-beige-50'
              }`}
            >
              {t.nav.thoughts}
            </button>
          </div>
        </div>
        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={`text-sm rounded-md px-3 py-1 pr-8 cursor-pointer transition-all appearance-none focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              isScrolled
                ? 'bg-beige-100 border border-beige-300 text-beige-900 hover:bg-beige-200 hover:border-beige-400 focus:ring-beige-400'
                : 'bg-beige-50 border border-beige-300 text-beige-900 hover:bg-beige-100 hover:border-beige-400 focus:ring-beige-400'
            }`}
          >
            <option value="en" className="text-beige-900 bg-white">English</option>
            <option value="de" className="text-beige-900 bg-white">German</option>
            <option value="hu" className="text-beige-900 bg-white">Hungarian</option>
          </select>
          <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${
            isScrolled ? 'text-beige-700' : 'text-beige-700'
          }`} />
        </div>
      </div>
    </nav>
  );
}

function Footer({ t }) {
  return (
    <footer className="bg-beige-50 py-12 mt-24">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-sm text-beige-700 mb-4">{t.footer}</p>
        <p className="text-xs text-beige-600">
          This work is licensed under a{' '}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-beige-800"
          >
            Creative Commons Attribution–NonCommercial–ShareAlike 4.0 International License
          </a>
          .
        </p>
      </div>
    </footer>
  );
}

function HomePage({ language, t }) {
  const [beforeReflection, setBeforeReflection] = useState('');
  const [afterReflection, setAfterReflection] = useState('');
  const [showBeforeSuccess, setShowBeforeSuccess] = useState(false);
  const [showAfterSuccess, setShowAfterSuccess] = useState(false);
  const [showMoreIntro, setShowMoreIntro] = useState(false);

  const handleBeforeSubmit = () => {
    if (beforeReflection.trim()) {
      localStorage.setItem('beforeReflection', beforeReflection);
      setShowBeforeSuccess(true);
      setTimeout(() => setShowBeforeSuccess(false), 3000);
    }
  };

  const handleAfterSubmit = () => {
    if (afterReflection.trim()) {
      localStorage.setItem('afterReflection', afterReflection);
      const stored = localStorage.getItem('publicReflections');
      const existing = stored ? JSON.parse(stored) : [];
      const newReflection = {
        text: afterReflection,
        timestamp: Date.now()
      };
      const updated = [...existing, newReflection];
      localStorage.setItem('publicReflections', JSON.stringify(updated));
      setShowAfterSuccess(true);
      setTimeout(() => setShowAfterSuccess(false), 3000);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/background.png)',
            backgroundColor: '#1a1a1a'
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-wide">
            {t.hero.title}
          </h1>
          <p className="text-xl md:text-2xl font-light opacity-90">
            {t.hero.subtitle}
          </p>
        </div>
      </header>

      {/* Introduction Section */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-light mb-8 text-beige-900">{t.intro.title}</h2>
        <div className="text-lg leading-relaxed text-beige-700 space-y-4 text-left">
          {t.intro.text.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
          {showMoreIntro && (
            <p>{t.intro.moreText}</p>
          )}
        </div>
        <button
          onClick={() => setShowMoreIntro(!showMoreIntro)}
          className="mt-6 text-beige-700 hover:text-beige-900 underline text-base transition-colors"
        >
          {showMoreIntro ? t.intro.readLess : t.intro.readMore}
        </button>
      </section>

      {/* Before Reflection */}
      <section className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-beige-50 rounded-2xl p-12 shadow-sm">
          <h3 className="text-2xl font-light mb-8 text-center text-beige-900">
            {t.beforeQuestion}
          </h3>
          <textarea
            value={beforeReflection}
            onChange={(e) => setBeforeReflection(e.target.value)}
            className="w-full h-32 p-4 border border-beige-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-beige-400 transition-all bg-white"
            placeholder="Share your thoughts..."
          />
          <button
            onClick={handleBeforeSubmit}
            className="mt-6 w-full bg-beige-700 text-white py-3 rounded-lg hover:bg-beige-800 transition-colors"
          >
            {t.submit}
          </button>
          {showBeforeSuccess && (
            <p className="mt-4 text-center text-green-600 text-sm">
              Thank you for sharing your reflection.
            </p>
          )}
        </div>
      </section>

      {/* Video Section */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-light mb-12 text-center text-beige-900">
          {t.video.title}
        </h2>
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <video
            controls
            className="w-full"
            style={{ aspectRatio: '16/9' }}
          >
            <source src="/public/measuredinmoments.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* Post-Animation Content */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center space-y-12">
        <div>
          <h2 className="text-3xl font-light mb-8 text-beige-900">
            {t.postAnimation.title}
          </h2>
          <p className="text-lg leading-relaxed text-beige-700 mb-8">
            {t.postAnimation.danger}
          </p>
          <p className="text-lg leading-relaxed text-beige-700 mb-8">
            {t.postAnimation.what}
          </p>
          <p className="text-lg leading-relaxed text-beige-700">
            {t.postAnimation.essay.split('Keep The Future Human').map((part, idx, arr) => 
              idx < arr.length - 1 ? (
                <React.Fragment key={idx}>
                  {part}
                  <a 
                    href="https://keepthefuturehuman.ai/essay/docs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-beige-900 underline hover:text-beige-700"
                  >
                    Keep The Future Human
                  </a>
                </React.Fragment>
              ) : part
            )}
          </p>
        </div>
      </section>

      {/* After Reflection */}
      <section className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-beige-50 rounded-2xl p-12 shadow-sm">
          <h3 className="text-2xl font-light mb-8 text-center text-beige-900">
            {t.afterQuestion}
          </h3>
          <textarea
            value={afterReflection}
            onChange={(e) => setAfterReflection(e.target.value)}
            className="w-full h-32 p-4 border border-beige-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-beige-400 transition-all bg-white"
            placeholder="Share your updated thoughts..."
          />
          <button
            onClick={handleAfterSubmit}
            className="mt-6 w-full bg-beige-700 text-white py-3 rounded-lg hover:bg-beige-800 transition-colors"
          >
            {t.submit}
          </button>
          {showAfterSuccess && (
            <p className="mt-4 text-center text-green-600 text-sm">
              Your reflection has been added to the community section.
            </p>
          )}
        </div>
      </section>
    </>
  );
}

function ResourcesPage({ t }) {
  return (
    <div className="pt-24">
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-light mb-12 text-beige-900">
          {t.resources.title}
        </h2>
        <div className="space-y-4">
          {t.resources.links.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-lg text-beige-700 hover:text-beige-900 underline decoration-1 underline-offset-4 transition-colors"
            >
              {link.text}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function CommunityPage({ t }) {
  const [publicReflections, setPublicReflections] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('publicReflections');
    if (stored) {
      setPublicReflections(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="pt-24">
      <section className="max-w-4xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-light mb-12 text-center text-beige-900">
          {t.reflections.title}
        </h2>
        {publicReflections.length === 0 ? (
          <p className="text-center text-beige-600">{t.reflections.empty}</p>
        ) : (
          <div className="space-y-6">
            {publicReflections.map((reflection, idx) => (
              <div
                key={idx}
                className="bg-beige-50 rounded-xl p-8 shadow-sm"
              >
                <p className="text-beige-800 leading-relaxed">{reflection.text}</p>
                <p className="text-sm text-beige-600 mt-4">
                  {new Date(reflection.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function MeasuredInMoments() {
  const [language, setLanguage] = useState('en');
  const [currentPage, setCurrentPage] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const content = {
    en: {
      nav: { why: 'Home', resources: 'Get involved', projects: 'Projects', thoughts: 'Community' },
      hero: {
        title: 'Measured in Moments',
        subtitle: 'AI evolves fast, we need to act faster'
      },
      intro: {
        title: 'Introduction',
        text: 'Let us imagine a world where we are getting alarmingly close to achieving AGI (Artificial General Intelligence). You work as an AI development researcher, pushing the frontiers of AI day by day. This field moves with unprecedented speed, breakthroughs happen every day, new methodologies, new datasets, new models and discoveries are released at a rate beyond what we can keep in mind.\n\nSo, when encountering some small warning messages in your system logs, you barely notice them. A strange output, an unexplained action, a few seemingly wrong parameters… nothing unusual. So, you treat them as such, just a few bumps on the way to AGI, but they return, they repeat, and go beyond your capabilities way before you could act. AGI might have already been created.\n\nWhat would you do if this happened to you?',
        moreText: 'This world isn’t any different from where we currently are. Humanity has always been developing tools to propel technological development and advance our kind. But why is AI so different? Why do we need AI Safety? The reason is simple; it comes down to how humanity handles emerging technologies. The tendency shows that when a new tool, development appears, our first intention is to use it in welfare, use it as a weapon. And the capabilities of AI and opportunities presented by it are basically endless, the role of humans in everyday life, at jobs, at manufacturing companies, in education and even in healthcare is going to change fundamentally. The opportunities are just as vast for terrorists, for malicious actors, cyber terrorists, or militaries all around the world.',
        readMore: 'Read more',
        readLess: 'Read less'
      },
      beforeQuestion: 'What would you do if you discovered something was wrong with the AI system you built?',
      submit: 'Submit',
      video: {
        title: 'A possible future',
        description: 'Watch the story unfold.'
      },
      postAnimation: {
        title: 'What is AI Safety?',
        danger: 'AI Safety is a research field dedicated to understanding how advanced artificial intelligence systems behave, generalize, and interact with the world. It studies how models form internal representations, how they respond under distribution shift, and how their objectives can be reliably aligned with human intentions. The field combines insights from computer science, machine learning, cognitive science, interpretability, and security to develop frameworks that make AI systems predictable, transparent, and controllable as they grow more capable.',
        what: 'Researchers in AI Safety investigate topics such as alignment, robustness, interpretability, evaluation, multi-agent dynamics, and long-term governance. They design methods for ensuring models follow intended goals, build tools to reveal hidden reasoning processes, create benchmarks that expose failure modes, and develop oversight mechanisms that remain effective even at high capability levels. In practice, AI Safety provides the methodologies, standards, and technical foundations needed to guide the development of increasingly powerful systems in a structured and disciplined way.',
        essay: 'The essay Keep The Future Human warns that progress without direction risks shaping a future where human agency gradually erodes. It argues that the true danger is not sudden domination, but the slow drift of power from people to opaque systems and unaccountable institutions. Through this lens, AI development becomes not only a technical challenge but a societal responsibility: to design, regulate, and question these systems before they outpace our ability to guide them. The essay calls for intentionality—to ensure that our technologies amplify human purpose, rather than replace it—and invites us to reflect on what kind of future we want to build before it becomes inevitable.'
      },
      afterQuestion: 'What would you do differently after knowing the consequences and possibilities?',
      resources: {
        title: 'Get involved',
        links: [
          { text: 'AI Safety Fundamentals', url: 'https://aisafetyfundamentals.com/' },
          { text: 'Center for AI Safety', url: 'https://safe.ai/' },
          { text: 'Anthropic Safety Research', url: 'https://www.anthropic.com/safety' }
        ]
      },
      reflections: {
        title: 'Community Reflections',
        empty: 'No reflections yet. Be the first to share your thoughts.'
      },
      projects: {
        title: 'Projects',
        featuredTitle: 'Featured Project',
        featuredName: 'Measured in Moments',
        featuredDescription: 'An animated exploration of AI safety and the responsibilities we face in developing artificial intelligence.',
        watchAnimation: 'Watch the animation',
        formTitle: 'Submit Your Project',
        formDescription: 'Share your project with the community. All submissions are welcome.',
        formTitleLabel: 'Project Title',
        formDescriptionLabel: 'Description',
        formLinkLabel: 'External Link',
        formAttachmentsLabel: 'Attachments',
        optional: 'optional',
        submit: 'Submit Project',
        submitSuccess: 'Project submitted successfully!',
        listTitle: 'Community Projects',
        empty: 'No projects yet. Be the first to share your project!',
        viewLink: 'View Project',
        attachments: 'Attachments'
      },
      footer: '© 2025 Measured in Moments – A project for a safe future. Licensed under CC BY-NC-SA 4.0.'
    }
  };

  const t = content[language] || content.en;

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navigation 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        language={language} 
        setLanguage={setLanguage} 
        t={t}
        isScrolled={isScrolled}
      />
      
      {currentPage === 'home' && <HomePage language={language} t={t} />}
      {currentPage === 'resources' && <ResourcesPage t={t} />}
      {currentPage === 'projects' && <ProjectsPage t={t} />}
      {currentPage === 'community' && <CommunityPage t={t} />}
      
      <Footer t={t} />
    </div>
  );
}
