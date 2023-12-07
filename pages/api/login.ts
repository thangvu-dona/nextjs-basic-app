// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import httpProxy, { ProxyResCallback } from 'http-proxy'
import Cookies from 'cookies'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string
}

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

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  return new Promise((resolve) => {
    if (req.method !== 'POST') {
      return res.status(404).json({ message: 'method not supported' })
    }

    // dont send cookies to API server
    req.headers.cookie = ''

    const handleLoginResponse: ProxyResCallback = (proxyRes, req, res) => {
      // Read the API's response body from
      // the stream:
      let apiResponseBody = ''
      proxyRes.on('data', (chunk) => {
        apiResponseBody += chunk
      })

      // Once we've read the entire API
      // response body, we're ready to
      // handle it:
      proxyRes.on('end', () => {
        try {
          // Extract the authToken from API's response:
          const { accessToken, expiredAt } = JSON.parse(apiResponseBody)

          // Set the authToken as an HTTP-only cookie.
          // We'll also set the SameSite attribute to
          // 'lax' for some additional CSRF protection.
          const cookies = new Cookies(req, res, { secure: process.env.NODE_ENV !== 'development' })
          cookies.set('access_token', accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(expiredAt),
          })

          // Our response to the client won't contain
          // the actual authToken. This way the auth token
          // never gets exposed to the client.
          ;(res as NextApiResponse).status(200).json({ message: 'Login successfully' })
        } catch (err) {
          ;(res as NextApiResponse).status(500).json({ message: 'Something went wrong!' })
        }

        resolve(true)
      })
    }

    proxy.once('proxyRes', handleLoginResponse)

    proxy.web(req, res, {
      target: process.env.API_URL,
      changeOrigin: true,
      selfHandleResponse: true, // auto handle response
    })
  })
}
