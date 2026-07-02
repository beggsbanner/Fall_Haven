const { createServer } = require("http")
const { readFileSync, existsSync } = require("fs")
const { join, extname } = require("path")

const PUBLIC_DIR = join(process.cwd(), "public")
const PORT = process.env.PORT || 3000

const mimeTypes = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
}

const server = createServer((req, res) => {
  const path = req.url === "/" ? "/book.html" : req.url
  const filePath = join(PUBLIC_DIR, decodeURIComponent(path))

  if (!existsSync(filePath)) {
    res.writeHead(404, { "Content-Type": "text/plain" })
    res.end("Not found")
    return
  }

  const data = readFileSync(filePath)
  const contentType = mimeTypes[extname(filePath)] || "application/octet-stream"
  res.writeHead(200, { "Content-Type": contentType })
  res.end(data)
})

server.listen(PORT, () => {
  console.log(`Book viewer server running at http://localhost:${PORT}`)
})
