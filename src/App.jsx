import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ShowcaseSection from './components/ShowcaseSection';
import InstallerSection from './components/InstallerSection';
import FeaturesSection from './components/FeaturesSection';
import ArchitectureSection from './components/ArchitectureSection';
import DocsSection from './components/DocsSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';

export default function App() {
  const scrollToInstaller = () => {
    const el = document.getElementById('installer');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDocs = () => {
    const el = document.getElementById('docs');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="lyra-site min-h-screen w-full max-w-full overflow-x-hidden bg-[#000000] text-[#ededed] flex flex-col selection:bg-white selection:text-black">
      <Navbar 
        onScrollToInstaller={scrollToInstaller}
        onOpenDocs={scrollToDocs}
      />

      <main className="flex-grow w-full max-w-full overflow-x-hidden">
        <Hero 
          onScrollToInstaller={scrollToInstaller}
          onOpenDocs={scrollToDocs}
        />

        <ShowcaseSection />

        <FeaturesSection />

        <InstallerSection />

        <ArchitectureSection />

        <DocsSection />

        <FAQSection />
      </main>

      <Footer 
        onScrollToInstaller={scrollToInstaller}
        onOpenDocs={scrollToDocs}
      />
    </div>
  );
}
