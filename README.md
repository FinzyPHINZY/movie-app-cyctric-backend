## Step 1: Set up backend with Express, middlewares, and MongoDB connection

- Configured server with Express
- Set up the following:

```
- Helmet: This is to add various HTTP headers to enhance security by protecting against  web vulnerabilities like XSS, ClickJacking and more.

- Compression: I use this package to compress the HTTP response to reduce the size of data sent to the client, improving performance, especially for larger payloads like the movie images.

- Morgan: I always use this to log information about every incoming request and it's response to the backend. I use a custom log format as opposed to the popular configurations like tiny, dev, custom, e.t.c
```

- I added a /health endpoint for server health check. Render uses this to continuously test the status of the application.
- I connected to MongoDB using Mongoose.
- Set trust proxy for handling proxy headers in production. Not doing this usually leads to errors after deployment on Render
