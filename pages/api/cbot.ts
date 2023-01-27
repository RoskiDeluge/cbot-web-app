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

  if (prompt.length > 100) {
    return res.status(400).json({error: "Prompt too long"})
  }

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `I am a command line translation tool for MacOS.\n
    Ask me what you want to do and I will tell you how to do it in a unix command.\n
    Q: How do I copy a file\n
    cp filename.txt destination_filename.txt\n
    Q: How do I duplicate a folder?\n
    cp -a source_folder/ destination_folder/\n
    Q: How do display a calendar?\n
    cal\n
    Q: how do I convert a .heic file to jpg?\n
    convert source.heic destination.jpg\n
    Q: navigate to my desktop\n
    cd ~/Desktop/\n
    Q: How do I shutdown the computer?\n
    sudo shutdown -h now\n
    Q: ${prompt}\n`,
    max_tokens: 200,
    temperature: 0.75,
    presence_penalty: 0,
    frequency_penalty: 0,
  })

  const command =  completion.data.choices[0].text;

  res.status(200).json({command})
}
