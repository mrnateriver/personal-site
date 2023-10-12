import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import { inspect } from 'util';

import { OpenAI } from 'openai';
import type { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';

type GPTModels = ChatCompletionCreateParamsBase['model'];

export interface FunctionCallRequestArgument {
  name: string;
  description?: string;
}

export async function generateAICompletion(prompt: string, temperature = 0): Promise<string> {
  return await cacheResponse(`completion-${prompt}`, async (openai, model) => {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      temperature,
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

export async function callAIFunction(
  prompt: string,
  args: FunctionCallRequestArgument[],
  temperature = 0,
): Promise<Record<string, string>> {
  if (args.some((arg) => !/^[\w_]+$/.test(arg.name))) {
    throw new Error(
      'Argument names must only contain letters, numbers, and underscores for consistency with the response',
    );
  }

  return await cacheResponse(
    `function-${prompt}-${args.map((arg) => `${arg.name}-${arg.description ?? 'no-desc'}`).join('-')}`,
    async (openai, model) => {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: 'You must use function `set_result` in response.' },
          { role: 'user', content: prompt },
        ],
        functions: [
          {
            name: 'set_result',
            parameters: {
              type: 'object',
              properties: Object.fromEntries(
                args.map((arg) => [arg.name, { type: 'string', description: arg.description }]),
              ),
              required: args.map((arg) => arg.name),
            },
          },
        ],
        function_call: { name: 'set_result' },
        temperature,
        model,
        n: 1,
      });

      const result = completion.choices[0].message.function_call;
      if (!result) {
        if (!import.meta.env.PROD) {
          console.log(inspect(completion, true, undefined, true));
        }
        throw new Error('Failed to generate completion, or the model failed to call the function');
      }

      if (result.name !== 'set_result') {
        throw new Error(`Unexpected function call: ${result.name}`);
      }

      let decodedArguments: Record<string, string>;
      try {
        decodedArguments = JSON.parse(result.arguments);
      } catch (e) {
        throw new Error(`Failed to parse arguments: ${result.arguments}`);
      }

      if (args.some((arg) => !(arg.name in decodedArguments))) {
        throw new Error(
          `Missing arguments in completion: ${args.filter((arg) => !(arg.name in decodedArguments)).join(', ')}`,
        );
      }

      return decodedArguments;
    },
  );
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
