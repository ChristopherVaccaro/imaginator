import React from 'react';
import { InputSection } from './components/InputSection';
import { ArticleRenderer } from './components/ArticleRenderer';
import { generateContent } from './lib/gemini';
import { motion, AnimatePresence } from 'motion/react';

function App() {
  const [content, setContent] = React.useState<string | null>(null);
  const [type, setType] = React.useState<'article' | 'webpage'>('webpage');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [groundingMetadata, setGroundingMetadata] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleGenerate = async (prompt: string, url: string, selectedType: 'article' | 'webpage') => {
    setIsGenerating(true);
    setError(null);
    setType(selectedType);
    
    try {
      const result = await generateContent({ prompt, url, type: selectedType });
      setContent(result.text || "No content generated.");
      setGroundingMetadata(result.groundingMetadata);
    } catch (err) {
      console.error(err);
      setError("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setContent(null);
    setGroundingMetadata(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <main className="container mx-auto px-4 py-12 md:py-24">
        <AnimatePresence mode="wait">
          {!content ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <InputSection onGenerate={handleGenerate} isGenerating={isGenerating} />
              {error && (
                <div className="mt-6 text-center text-red-500 bg-red-50 p-4 rounded-xl max-w-2xl mx-auto">
                  {error}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ArticleRenderer 
                content={content} 
                type={type} 
                groundingMetadata={groundingMetadata}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
