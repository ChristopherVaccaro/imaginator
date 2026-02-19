import { GoogleGenAI } from "@google/genai";

// Initialize the client
// process.env.GEMINI_API_KEY is injected by the environment
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface GenerateOptions {
  prompt: string;
  url?: string;
  type: 'article' | 'webpage';
}

export async function generateContent(options: GenerateOptions) {
  const { prompt, url, type } = options;

  let finalPrompt = "";
  
  if (type === 'article') {
    finalPrompt = `You are an expert editor and writer. 
    Task: Create a comprehensive, well-structured article based on the following input.
    Input: "${prompt}"
    
    Requirements:
    - Use a professional, engaging tone.
    - Use Markdown formatting (headers, lists, bolding).
    - Structure:
        - Start with a clear H1 Title.
        - Use H2 for main sections and H3 for subsections.
        - Ensure generous whitespace between paragraphs and sections for readability.
        - Use blockquotes for key insights or summaries.
    - Enrich the content with relevant facts, context, and details found via Google Search.
    - If a URL is provided, use it as a primary source but expand on it.
    - Do not include "Here is the article" or similar meta-text. Start directly with the title (H1).`;
  } else {
    finalPrompt = `You are an expert web designer and developer.
    Task: Create a single-file HTML static webpage that acts as a modern, high-quality encyclopedia entry or editorial piece based on the following input.
    Input: "${prompt}"
    
    Requirements:
    - Output ONLY valid HTML code.
    - Design & Theme (Dynamic):
        - Analyze the topic of the input.
        - If Technology/Sci-Fi: Use a sleek, modern aesthetic (e.g., dark mode, monospaced accents, neon or cool blues).
        - If Nature/Environment: Use organic colors (greens, browns, soft creams) and elegant serif typography.
        - If History/Politics/Academic: Use a classic editorial/newspaper aesthetic (clean white/off-white background, strong serif headers, black text).
        - If Art/Creative: Use a bold, gallery-style layout with ample whitespace.
        - ADAPT the color palette, typography, and layout to match the "vibe" of the content.
    - Content:
        - The content should be deep, researched, and substantial (like a Wikipedia feature article or a New Yorker piece).
        - Enrich with facts/details from Google Search.
    - Constraints:
        - NO generic "business" branding (no fake "Company Name" logos).
        - NO generic navigation bars (Home, About, Contact).
        - NO social media footers or "Subscribe" boxes.
        - Focus entirely on the reading experience and content presentation.
    - Navigation (MANDATORY):
        - You MUST include a "Table of Contents" or "On this page" sidebar or floating menu.
        - It MUST link to actual section IDs within the content (e.g., <a href="#history">History</a> -> <h2 id="history">History</h2>).
    - Citations & Links:
        - You MUST hyperlink key terms and facts to their source URLs if provided in the prompt or found via search.
        - If exact URLs are not available for a specific fact, create a [Source] link that anchors to the references section.
    - Interactivity:
        - Include subtle interactions (e.g., scroll progress bar, sticky table of contents, image zoom).
    - Structure:
        - Semantic HTML5.
        - Responsive (mobile-first).
        - Use Google Fonts.
    - Do not use markdown blocks for the HTML. Just return the raw HTML code.`;
  }

  const tools: any[] = [{ googleSearch: {} }];
  
  // If we had a specific URL tool, we would add it here. 
  // For now, we rely on the model's ability to use the URL in the prompt + search.
  // However, the docs mention `urlContext`. Let's use it if a URL is present.
  
  if (url) {
    // Note: urlContext is a specific tool config.
    // Based on docs: tools: [{urlContext: {}}]
    // And we pass the URL in the prompt or let the model know? 
    // The docs say: "By including URLs in your request, the model accesses the content from those pages"
    // It seems we just need to enable the tool.
    // But wait, the docs example: 
    // contents: "Summarize ... based on https://..."
    // config: { tools: [{urlContext: {}}] }
    tools.push({ urlContext: {} });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Good balance of speed and capability
      contents: url ? `${finalPrompt}\n\nSource URL: ${url}` : finalPrompt,
      config: {
        tools: tools,
        systemInstruction: "You are a helpful, creative AI assistant that turns ideas into polished content.",
      },
    });

    return {
      text: response.text,
      groundingMetadata: response.candidates?.[0]?.groundingMetadata
    };
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}
