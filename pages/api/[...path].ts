// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import httpProxy from 'http-proxy'
import type { NextApiRequest, NextApiResponse } from 'next'

// type Data = {
//   name: string
// }

const proxy = httpProxy.createProxyServer()

// You can export a config variable from any API route in Next.js.
// We'll use this to disable the bodyParser, otherwise Next.js
// would read and parse the entire request body before we
// can forward the request to the API. By skipping the bodyParser,
// we can just stream all requests through to the actual API.
export const config = {
  api: {
    bodyParser: false,
  },
}

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  // dont send cookies to API server
  req.headers.cookie = ''

  // /api/students/
  // https://js-post-api.herokuapp.com/api/students

  proxy.web(req, res, {
    target: process.env.API_URL,
    changeOrigin: true,
    selfHandleResponse: false,
  })

  // res.status(200).json({ name: 'PATH - Match all here' })
}
