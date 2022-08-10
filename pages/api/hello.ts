// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
  url?: string;
  method?: string;
  query: object;
  body: any;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res
    .status(200)
    .json({ name: 'John Doe', url: req.url, method: req.method, query: req.query, body: req.body });
}
