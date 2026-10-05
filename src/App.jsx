import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ShowcaseSection from './components/ShowcaseSection';
import InstallerSection from './components/InstallerSection';
import Playground from './components/Playground';
import FeaturesSection from './components/FeaturesSection';
import SoundErasShowcase from './components/SoundErasShowcase';
import ArchitectureSection from './components/ArchitectureSection';
import DocsSection from './components/DocsSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';

export default function App() {
  const scrollToPlayground = () => {
    const el = document.getElementById('playground');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToInstaller = () => {
    const el = document.getElementById('installer');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDocs = () => {
    const el = document.getElementById('docs');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#000000] text-[#ededed] flex flex-col selection:bg-white selection:text-black">
      <Navbar 
        onScrollToPlayground={scrollToPlayground}
        onScrollToInstaller={scrollToInstaller}
        onOpenDocs={scrollToDocs}
      />

      <main className="flex-grow w-full max-w-full overflow-x-hidden">
        <Hero 
          onScrollToPlayground={scrollToPlayground}
          onScrollToInstaller={scrollToInstaller}
          onOpenDocs={scrollToDocs}
        />

        <ShowcaseSection />

        <Playground />

        <FeaturesSection />

        <InstallerSection />

        <SoundErasShowcase />

        <ArchitectureSection />

        <DocsSection />

        <FAQSection />
      </main>

      <Footer 
        onScrollToPlayground={scrollToPlayground}
        onScrollToInstaller={scrollToInstaller}
        onOpenDocs={scrollToDocs}
      />
    </div>
  );
}
