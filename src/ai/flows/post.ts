import { generate } from '@genkit-ai/ai';
import { defineFlow } from '@genkit-ai/flow';
import { z } from 'zod';
import { ai } from '../genkit';
import { next } from '@genkit-ai/next';

export const suggestTitle = defineFlow(
  {
    name: 'suggestTitle',
    inputSchema: z.string(),
    outputSchema: z.string(),
    middleware: [
      next({
        // This is a client-side flow.
        // You can add auth guards here.
      }),
    ],
  },
  async (content) => {
    const llm = ai.llm('googleai/gemini-2.0-flash');
    const response = await generate({
      model: llm,
      prompt: `Generate a concise, compelling, and creative title for the following blog post content. The title should be no more than 70 characters. The tone should be thoughtful and introspective.

      Content:
      ${content}

      Title:`,
      config: {
        temperature: 0.8,
      },
    });

    return response.text();
  }
);
