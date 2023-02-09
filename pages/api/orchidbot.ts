// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({error: "Prompt missing"})
  }

  if (prompt.length > 200) {
    return res.status(400).json({error: "Prompt too long"})
  }

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `I am a prompt generator for Stable Diffusion and Dalle2.\n
    Give me the name of two artists and I will generate a prompt that combines their styles.\n
    Artists: Rene Magritte and Georgia O'Keffe\n
    Prompt: A surreal image of an orchid floating in outer space in the style of Rene Magritte and Georgia O'Keffe\n
    Artists: Frida Kahlo and Ansel Adams\n
    Prompt: A hyperrealistic photo of a burning orchid in the style of Frida Kahlo and Ansel Adams\n
    Artists: Vincent Van Gough and Takashi Murakami\n
    Prompt: An abstract image of an orchid explosion in a futuristic landscape in the style of Vincent Van gough and Takashi Murakami\n
    Artists: ${prompt}\n`,
    max_tokens: 200,
    temperature: 1, 
    presence_penalty: 0,
    frequency_penalty: 0,
  })

  const command =  completion.data.choices[0].text;

  res.status(200).json({command})
}
    