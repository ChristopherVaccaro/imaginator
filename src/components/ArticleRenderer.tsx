import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, ExternalLink, RefreshCw, ArrowLeft } from 'lucide-react';

interface ArticleRendererProps {
  content: string;
  type: 'article' | 'webpage';
  groundingMetadata?: any;
  onReset: () => void;
}

export function ArticleRenderer({ content, type, groundingMetadata, onReset }: ArticleRendererProps) {
  const [iframeSrc, setIframeSrc] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (type === 'webpage') {
      // Create a blob for the HTML content to display in iframe
      // Clean up the content if it contains markdown code blocks
      let htmlContent = content;
      if (content.startsWith('```html')) {
        htmlContent = content.replace(/^```html\n/, '').replace(/\n```$/, '');
      } else if (content.startsWith('```')) {
        htmlContent = content.replace(/^```\n/, '').replace(/\n```$/, '');
      }

      // Inject sources if available
      if (groundingMetadata?.groundingChunks) {
        const sourcesHtml = `
          <footer style="
            margin-top: 4rem; 
            padding-top: 2rem; 
            border-top: 1px solid rgba(0,0,0,0.1); 
            font-family: system-ui, sans-serif;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
            padding-bottom: 4rem;
          ">
            <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 1rem; opacity: 0.8;">Sources & References</h3>
            <ul style="list-style: none; padding: 0; margin: 0; display: grid; gap: 0.5rem;">
              ${groundingMetadata.groundingChunks.map((chunk: any) => 
                chunk.web?.uri ? `
                  <li>
                    <a href="${chunk.web.uri}" target="_blank" rel="noopener noreferrer" style="color: inherit; opacity: 0.6; text-decoration: none; font-size: 0.9rem; display: flex; gap: 0.5rem; align-items: center;">
                      <span style="opacity: 0.5;">🔗</span>
                      <span style="text-decoration: underline;">${chunk.web.title || chunk.web.uri}</span>
                    </a>
                  </li>
                ` : ''
              ).join('')}
            </ul>
          </footer>
        `;
        
        // Insert before closing body tag if it exists, otherwise append
        if (htmlContent.includes('</body>')) {
          htmlContent = htmlContent.replace('</body>', `${sourcesHtml}</body>`);
        } else {
          htmlContent += sourcesHtml;
        }
      }

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setIframeSrc(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [content, type]);

  const handleDownload = () => {
    const extension = type === 'webpage' ? 'html' : 'md';
    const mimeType = type === 'webpage' ? 'text/html' : 'text/markdown';
    let cleanContent = content;
    
    if (type === 'webpage') {
       if (content.startsWith('```html')) {
        cleanContent = content.replace(/^```html\n/, '').replace(/\n```$/, '');
      } else if (content.startsWith('```')) {
        cleanContent = content.replace(/^```\n/, '').replace(/\n```$/, '');
      }

      // Inject sources for download
      if (groundingMetadata?.groundingChunks) {
        const sourcesHtml = `
          <footer style="
            margin-top: 4rem; 
            padding-top: 2rem; 
            border-top: 1px solid rgba(0,0,0,0.1); 
            font-family: system-ui, sans-serif;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
            padding-bottom: 4rem;
          ">
            <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 1rem; opacity: 0.8;">Sources & References</h3>
            <ul style="list-style: none; padding: 0; margin: 0; display: grid; gap: 0.5rem;">
              ${groundingMetadata.groundingChunks.map((chunk: any) => 
                chunk.web?.uri ? `
                  <li>
                    <a href="${chunk.web.uri}" target="_blank" rel="noopener noreferrer" style="color: inherit; opacity: 0.6; text-decoration: none; font-size: 0.9rem; display: flex; gap: 0.5rem; align-items: center;">
                      <span style="opacity: 0.5;">🔗</span>
                      <span style="text-decoration: underline;">${chunk.web.title || chunk.web.uri}</span>
                    </a>
                  </li>
                ` : ''
              ).join('')}
            </ul>
          </footer>
        `;
        
        if (cleanContent.includes('</body>')) {
          cleanContent = cleanContent.replace('</body>', `${sourcesHtml}</body>`);
        } else {
          cleanContent += sourcesHtml;
        }
      }
    }

    const blob = new Blob([cleanContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-idea.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Input</span>
        </button>
        
        <div className="flex gap-2">
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[60vh]">
        {type === 'article' ? (
          <div className="prose prose-slate prose-lg max-w-none p-8 md:p-12 prose-headings:font-semibold prose-h1:text-4xl prose-h1:mb-8 prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-p:leading-relaxed prose-p:mb-6">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <div className="w-full h-[800px] bg-slate-50">
            <iframe 
              src={iframeSrc || undefined} 
              className="w-full h-full border-0" 
              title="Generated Webpage"
              sandbox="allow-scripts"
            />
          </div>
        )}
      </div>

      {groundingMetadata && groundingMetadata.groundingChunks && (
        <div className="bg-slate-50 rounded-xl p-6 space-y-3">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
            Sources & Grounding
          </h3>
          <div className="grid gap-2">
            {groundingMetadata.groundingChunks.map((chunk: any, i: number) => {
              if (chunk.web?.uri) {
                return (
                  <a 
                    key={i} 
                    href={chunk.web.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-indigo-600 hover:underline truncate"
                  >
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    {chunk.web.title || chunk.web.uri}
                  </a>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
