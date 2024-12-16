"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import slangData from "../data/slang.json";
import { FiSearch } from 'react-icons/fi';
import { LuShare2 } from 'react-icons/lu';
import toast, { Toaster } from 'react-hot-toast';
import { useSearchParams } from "next/navigation";

const SUGGESTION_INTERVAL = 10000; // 10 seconds

// Custom component to render markdown with proper styling
const MarkdownContent = ({ content }: { content: string }) => (
  <ReactMarkdown
    components={{
      p: ({ children }) => <p className="text-white/90">{children}</p>,
      a: ({ href, children }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-300 hover:text-blue-200 underline transition-colors"
        >
          {children}
        </a>
      ),
      strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
      em: ({ children }) => <em className="text-white/80 italic">{children}</em>,
    }}
  >
    {content}
  </ReactMarkdown>
);

const SuggestionBox = ({ onSelect }: { onSelect: (term: string) => void }) => {
  const [suggestions, setSuggestions] = useState<(typeof slangData.slangs)[0][]>([]);
  const [key, setKey] = useState(0); // Key to force animation restart

  useEffect(() => {
    const updateSuggestions = () => {
      const allTerms = [...slangData.slangs];
      const selectedTerms: (typeof slangData.slangs)[0][] = [];

      // Get 4 random terms
      for (let i = 0; i < 4; i++) {
        if (allTerms.length === 0) break;
        const randomIndex = Math.floor(Math.random() * allTerms.length);
        selectedTerms.push(allTerms[randomIndex]);
        allTerms.splice(randomIndex, 1);
      }

      setSuggestions(selectedTerms);
      setKey(prev => prev + 1); // Update key to restart animation
    };

    updateSuggestions();
    const interval = setInterval(updateSuggestions, SUGGESTION_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-8 p-6 bg-white/5 backdrop-blur-lg rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-xl font-semibold">Trending Slangs 🔥</h3>
        <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            key={key}
            className="h-full bg-white/60 rounded-full origin-left"
            style={{
              animation: `progressSlider ${SUGGESTION_INTERVAL}ms linear`,
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            onClick={() => onSelect(suggestion.term)}
            className="p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-all duration-300 border border-white/5"
          >
            <p className="text-white font-bold text-lg mb-1">{suggestion.term}</p>
            <div className="text-sm line-clamp-2">
              <MarkdownContent content={suggestion.meaning} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = `
  @keyframes progressSlider {
    from {
      transform: scaleX(0);
      -webkit-transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
      -webkit-transform: scaleX(1);
    }
  }

  @keyframes gradientFlow {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @-webkit-keyframes gradientFlow {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .dynamic-bg {
    background: linear-gradient(
      -45deg,
      #1a1b26,
      #292e42,
      #1e3a8a,
      #312e81,
      #4c1d95,
      #1e1b4b,
      #1a1b26
    );
    background-size: 400% 400%;
    -webkit-animation: gradientFlow 30s ease infinite;
    animation: gradientFlow 30s ease infinite;
  }

  .content-container {
    background: linear-gradient(
      to bottom,
      rgba(26, 27, 38, 0.95),
      rgba(26, 27, 38, 0.98)
    );
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
  }

  @supports not (backdrop-filter: blur(12px)) {
    .content-container {
      background: linear-gradient(
        to bottom,
        rgba(26, 27, 38, 0.98),
        rgba(26, 27, 38, 0.99)
      );
    }
  }

  .noise-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.04;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E");
  }

  .glow-text {
    text-shadow: 0 0 30px rgba(255, 255, 255, 0.15);
  }

  /* Safari-specific styles */
  @supports (-webkit-touch-callout: none) {
    .content-container {
      background: linear-gradient(
        to bottom,
        rgba(26, 27, 38, 0.98),
        rgba(26, 27, 38, 0.99)
      );
    }
  }
`;

export default function Home() {
  const params = useSearchParams();
  const initialTerm = params.get("term");
  const [searchTerm, setSearchTerm] = useState(initialTerm || "");
  const [closestMatch, setClosestMatch] = useState<(typeof slangData.slangs)[0] | null>(null);
  const [result, setResult] = useState<{
    term?: string;
    meaning?: string;
    examples?: string[];
  } | null>(null);
  const [matches, setMatches] = useState<(typeof slangData.slangs)[0][]>([]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setClosestMatch(null);
      setResult(null);
      setMatches([]);
      return;
    }

    // Normalize the search term: remove apostrophes and convert to lowercase
    const normalizedSearchTerm = searchTerm.toLowerCase().replace(/[']/g, '');
    
    // Filter slangs based on normalized terms
    const matchedSlangs = slangData.slangs.filter((slang) => {
      // Normalize the slang term
      const normalizedSlangTerm = slang.term.toLowerCase().replace(/[']/g, '');
      
      // Split into words and filter out empty strings
      const searchWords = normalizedSearchTerm.split(/\s+/).filter(Boolean);
      const slangWords = normalizedSlangTerm.split(/\s+/).filter(Boolean);
      
      // Check if all search words are included in any of the slang words
      return searchWords.every((word) =>
        slangWords.some((slangWord) => slangWord.includes(word))
      );
    });

    setMatches(matchedSlangs);

    if (matchedSlangs.length > 0) {
      // Check for exact match (ignoring case and apostrophes)
      const exactMatch = matchedSlangs.find(
        (slang) => slang.term.toLowerCase().replace(/[']/g, '') === normalizedSearchTerm
      );
      
      if (exactMatch) {
        setClosestMatch(exactMatch);
        setResult(exactMatch);
      } else {
        // Sort matches by similarity
        const sortedMatches = [...matchedSlangs].sort((a, b) => {
          const aDiff = Math.abs(a.term.toLowerCase().replace(/[']/g, '').length - normalizedSearchTerm.length);
          const bDiff = Math.abs(b.term.toLowerCase().replace(/[']/g, '').length - normalizedSearchTerm.length);
          if (aDiff === bDiff) {
            // If lengths are equal, prioritize terms that start with the search term
            const aStartsWith = a.term.toLowerCase().replace(/[']/g, '').startsWith(normalizedSearchTerm);
            const bStartsWith = b.term.toLowerCase().replace(/[']/g, '').startsWith(normalizedSearchTerm);
            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;
          }
          return aDiff - bDiff;
        });
        
        setClosestMatch(sortedMatches[0]);
        setResult(sortedMatches[0]);
      }
    } else {
      setClosestMatch(null);
      setResult(null);
    }
  }, [searchTerm]);

  const handleSuggestionSelect = (term: string) => {
    setSearchTerm(term);
    const slang = slangData.slangs.find(s => s.term === term);
    if (slang) {
      setClosestMatch(slang);
      setResult(slang);
    }
  };

  const handleShare = async (term: string) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?term=${encodeURIComponent(term)}`;

    try {
      // Check if it's a mobile device
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      // Only use share sheet on mobile devices
      if (isMobile && navigator.share) {
        await navigator.share({
          title: 'GenZ Slang Dictionary',
          text: `Check out the meaning of "${term}" in the GenZ Slang Dictionary!`,
          url: shareUrl
        });
        toast.success('Shared successfully!');
        return;
      }

      // For desktop or if share API is not available, try clipboard API first
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
        return;
      } catch (clipboardError) {
        // If clipboard API fails, try execCommand
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          const successful = document.execCommand('copy');
          textArea.remove();
          
          if (successful) {
            toast.success('Link copied to clipboard!');
            return;
          }
          throw new Error('execCommand failed');
        } catch (execCommandError) {
          textArea.remove();
          throw execCommandError;
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Unable to share. Please try copying the URL manually.');
    }
  };

  return (
    <>
      <Toaster />
      <style>{styles}</style>
      <main className="min-h-screen dynamic-bg relative overflow-hidden">
        <div className="noise-overlay" />
        <div className="content-container min-h-screen flex flex-col">
          <div className="container mx-auto px-4 py-16 flex-grow">
            <h1 className="text-4xl font-bold text-center text-white mb-8 glow-text">
              GenZ Slang Dictionary
            </h1>
            <div className="max-w-2xl mx-auto">
              <div className="relative max-w-md mx-auto mb-8">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search slang..."
                    className="w-full px-4 py-3 pl-12 pr-10 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                  />
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 text-lg" />
                </div>
              </div>

              {result && (
                <>
                  <div className="mt-4 text-left bg-white/5 backdrop-blur-lg rounded-xl p-6 animate-fade-in border border-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-2xl font-bold text-white">
                        {result.term}
                      </h2>
                      <button
                        onClick={() => handleShare(result.term ?? '')}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
                        title="Share this slang"
                      >
                        <LuShare2 className="w-5 h-5 text-white/70 hover:text-white" />
                      </button>
                    </div>
                    <div className="text-lg mb-4">
                      <MarkdownContent content={result.meaning ?? ''} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-white font-semibold">Examples:</h3>
                      {result.examples?.map((example, i) => (
                        <div key={i} className="text-white/80 italic">
                          <MarkdownContent content={example} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Similar Slangs Pills */}
                  {matches.length > 1 && (
                    <div className="mt-4 mb-6 animate-fade-in">
                      <h3 className="text-white/80 text-sm mb-2">Similar Slangs:</h3>
                      <div className="flex flex-wrap gap-2">
                        {matches
                          .filter(match => match.term !== result.term)
                          .slice(0, 3)
                          .map((match, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionSelect(match.term)}
                              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-sm text-white/90 
                                        border border-white/10 transition-all duration-200 hover:border-white/20
                                        backdrop-blur-sm"
                            >
                              {match.term}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {searchTerm && !result && (
                <p className="mt-4 text-white/80">
                  No slang found for "{searchTerm}". Try another term!
                </p>
              )}

              <SuggestionBox onSelect={handleSuggestionSelect} />
            </div>
          </div>

          {/* Footer */}
          <footer className="w-full py-8 px-4">
            <div className="max-w-2xl mx-auto flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <a
                  href="https://forms.gle/QNs6juDmg8rzxN2Z9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10"
                >
                  <span>Know a slang we missed?</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>

              <div className="text-white/60 text-sm">
                Made with ❤️ by{' '}
                <a
                  href="https://linkedin.com/in/krshubham1708"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white underline transition-colors"
                >
                  Kumar Shubham
                </a>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
