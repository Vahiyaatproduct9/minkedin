
'use server';

import {generate} from '@genkit-ai/ai';
import {ai} from '@/ai/genkit';
import {z} from 'zod';

export const suggestTitle = ai.defineFlow(
  {
    name: 'suggestTitle',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (content) => {
    
    const response = await ai.generate({
      prompt: `Generate a concise, compelling, and creative title for the following blog post content. The title should be no more than 70 characters. The tone should be thoughtful and introspective.

      Content:
      ${content}

      Title:`,
      config: {
        temperature: 0.8,
      },
    });

    return response.text;
  }
);

