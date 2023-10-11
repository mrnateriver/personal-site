import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import { inspect } from 'util';

import { OpenAI } from 'openai';
import type { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';

type GPTModels = ChatCompletionCreateParamsBase['model'];

export async function generateCompletion(prompt: string): Promise<string> {
  return await cacheResponse(`completion-${prompt}`, async (openai, model) => {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model,
      n: 1,
    });

    const result = completion.choices[0].message.content;
    if (!result) {
      if (!import.meta.env.PROD) {
        console.log(inspect(completion, true, undefined, true));
      }
      throw new Error('Failed to generate completion');
    }

    return result;
  });
}

export async function callFunction(prompt: string, args: string[]): Promise<Record<string, string>> {
  // TODO: user message -> prompt
  // TODO: functions: `set_result(args[0]: string, args[1]: string...)`
  // TODO: function_call: { name: set_result } to force GPT to use the function
  // TODO: presumably parse JSON for `arguments` property and return it as the end result
}

async function cacheResponse<T>(input: string, cb: (openai: OpenAI, model: GPTModels) => Promise<T>): Promise<T> {
  const token = import.meta.env.OPENAI_API_KEY;
  if (!token) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  const model = (import.meta.env.OPENAI_GPT_MODEL || 'gpt-4') as GPTModels;

  let inputHash: string, cacheFileName: string;
  if (!import.meta.env.PROD) {
    inputHash = crypto.createHash('md5').update(input).digest('hex');
    cacheFileName = `.astro/${inputHash}.txt`;

    try {
      const cached = await fs.readFile(cacheFileName, 'utf-8');
      if (cached) {
        console.debug(`using cached completion: ${cacheFileName}`);
        return JSON.parse(cached);
      }
    } catch {}
  }

  const openai = new OpenAI({
    apiKey: token,
  });

  const result = await cb(openai, model);

  if (!import.meta.env.PROD) {
    console.debug(`writing completion to cache: ${cacheFileName!}`);
    try {
      await fs.writeFile(cacheFileName!, JSON.stringify(result));
    } catch (e) {
      console.error(`failed to write completion to cache: ${cacheFileName!}`);
      console.error(e);
    }
  }

  return result;
}
