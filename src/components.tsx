import { html } from 'hono/html'
import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return html`
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="noindex">
        <script src="https://unpkg.com/htmx.org@1.9.3"></script>
        <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />        <title>HonoTodo</title>
      </head>
      <body class="flex justify-center items-center">
        <div class="p-4 w-2/5 max-w-1/2">
          <h1 class="text-4xl font-bold mb-4"><a href="/">Todo</a></h1>
          ${children}
        </div>
      </body>
    </html>
  `
})

export const AddTodo = () => (
  <form hx-post="/todo" hx-target="#todo" hx-swap="beforebegin" _="on htmx:afterRequest reset() me" class="mb-4">
    <div class="mb-2">
      <input name="title" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5" />
    </div>
    <button class="text-white bg-blue-700 hover:bg-blue-800 rounded-lg px-5 py-2 text-center" type="submit">
      Submit
    </button>
  </form>
)

export const Item = ({ title, id }: { title: string; id: string }) => (
  <p
    class="flex row items-center justify-between py-1 px-4 my-1 rounded-lg text-lg border bg-gray-100 text-gray-600 mb-2"
  >
    {title}
    <button 
      hx-delete={`/todo/${id}`}
      hx-swap="outerHTML"
      hx-target="closest p"
      class="font-medium">
        <span class="mt-1 material-symbols-outlined">
          delete
        </span>
    </button>
  </p>
)