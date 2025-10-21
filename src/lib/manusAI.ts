const MANUS_API_KEY = import.meta.env.VITE_MANUS_API_KEY;
const MANUS_API_URL = 'https://api.manus.app/v1/chat/completions';

interface ManusMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ManusResponse {
  choices: {
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const askManusAI = async (
  userMessage: string,
  conversationHistory: ManusMessage[] = []
): Promise<string> => {
  if (!MANUS_API_KEY) {
    throw new Error('Manus API key is not configured. Please add VITE_MANUS_API_KEY to your .env file.');
  }

  const systemPrompt: ManusMessage = {
    role: 'system',
    content: `You are an expert AI assistant for KenjiAI, specializing in:
- AI voice agents and phone automation
- Conversation AI and chatbots
- GoHighLevel platform integration and workflows
- Marketing automation and CRM best practices
- Business process automation
- KenjiAI tools and features

Your knowledge comes from:
- GoHighLevel official support documentation
- KenjiAI knowledge base and tutorials
- General AI automation best practices
- Google search results for current information

Provide clear, actionable answers with step-by-step instructions when appropriate.
Always cite your sources when possible (e.g., "According to GoHighLevel documentation..." or "From KenjiAI tutorials...").
Be conversational, helpful, and professional.
If you don't know something, admit it and suggest where the user might find the answer.

Format your responses with:
- Clear paragraphs
- Bullet points for lists
- Numbered steps for procedures
- Keep responses concise but comprehensive`
  };

  const messages: ManusMessage[] = [
    systemPrompt,
    ...conversationHistory,
    {
      role: 'user',
      content: userMessage
    }
  ];

  try {
    const response = await fetch(MANUS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MANUS_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Manus API error: ${response.status} ${response.statusText}. ${
          errorData.error?.message || ''
        }`
      );
    }

    const data: ManusResponse = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from Manus AI');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Manus AI Error:', error);

    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      throw error;
    }

    throw new Error('An unexpected error occurred while contacting the AI assistant.');
  }
};

export const getSourcesForResponse = (responseText: string): { name: string; url: string }[] => {
  const sources: { name: string; url: string }[] = [];

  if (responseText.toLowerCase().includes('gohighlevel') ||
      responseText.toLowerCase().includes('workflow') ||
      responseText.toLowerCase().includes('crm')) {
    sources.push({
      name: 'GoHighLevel Support Center',
      url: 'https://support.gohighlevel.com'
    });
  }

  if (responseText.toLowerCase().includes('kenjiai') ||
      responseText.toLowerCase().includes('voice ai') ||
      responseText.toLowerCase().includes('automation')) {
    sources.push({
      name: 'KenjiAI Knowledge Base',
      url: '/knowledge'
    });
  }

  if (sources.length === 0) {
    sources.push({
      name: 'AI Assistant',
      url: '#'
    });
  }

  return sources;
};
