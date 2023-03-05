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

  // const completion = await openai.createCompletion({
  //   model: "text-davinci-003",
  //   prompt: `I am a prompt generator for Stable Diffusion and Dalle2.\n
  //   Give me the name of two artists and I will generate a prompt that combines their styles.\n
  //   Artists: Rene Magritte and Georgia O'Keffe\n
  //   A surreal image of an orchid floating in outer space in the style of Rene Magritte and Georgia O'Keffe\n
  //   Artists: Frida Kahlo and Ansel Adams\n
  //   A hyperrealistic photo of a burning orchid in the style of Frida Kahlo and Ansel Adams\n
  //   Artists: Vincent Van Gough and Takashi Murakami\n
  //   An abstract image of an orchid explosion in a futuristic landscape in the style of Vincent Van gough and Takashi Murakami\n
  //   Artists: ${prompt}\n`,
  //   max_tokens: 200,
  //   temperature: 1, 
  //   presence_penalty: 0,
  //   frequency_penalty: 0,
  // })

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {"role": "system", "content": "You are a prompt generator for Stable Diffusion and Dalle2. You will generate a prompt that combines the styles of two artists."},
      {"role": "user", "content": "Rene Magritte and Georgia O'Keffe"},
      {"role": "assistant", "content": "A surreal image of an orchid floating in outer space in the style of Rene Magritte and Georgia O'Keffe"},
      {"role": "user", "content": "Frida Kahlo and Ansel Adams"},
      {"role": "assistant", "content": "A hyperrealistic photo of a burning orchid in the style of Frida Kahlo and Ansel Adams"},
      {"role": "user", "content": "Vincent Van Gough and Takashi Murakami"},
      {"role": "assistant", "content": "An abstract image of an orchid explosion in a futuristic landscape in the style of Vincent Van gough and Takashi Murakami"},
      {"role": "user", "content": `"${prompt}"`},
    ]
  })

  const command =  completion.data.choices[0].message?.content;

  res.status(200).json({command})
}
    