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
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <title>HonoTodo</title>
      </head>
      <body class="flex justify-center items-center">
        <div class="p-4 w-4/5 max-w-1/2">
          ${children}
        </div>
      </body>
      <script>
        document.addEventListener('htmx:beforeRequest', function(event) {
          if (event.target.getAttribute('data-action') === 'delete') {
            event.target.querySelector('.indicator').textContent = 'pending';
          }
        });
        document.getElementById('customTextarea').addEventListener('keydown', function(event) {
          // Shift + Enterが押されたか確認
          if (event.shiftKey && event.keyCode == 13) {
            event.preventDefault(); // デフォルトの改行挙動を阻止
            this.form.requestSubmit(); // フォームを送信
          }
        });
        document.body.addEventListener('htmx:afterRequest', function() {
          // テキストエリアの高さをリセット
          var textarea = document.getElementById('customTextarea');
          textarea.style.height = 'auto';
          textarea.style.height = textarea.scrollHeight + 'px';
        });
        function autoResizeTextarea(textarea) {
          // スタイルを一時的に変更してスクロール高さを取得
          textarea.style.height = 'auto';
          textarea.style.height = textarea.scrollHeight + 'px';
        }
        function copyTextToClipboard(button) {
          // ボタンの親要素（ここでは<p>タグ）内のテキストを取得
          const textToCopy = button.closest('p').querySelector('.title-text').textContent.trim();
          // クリップボードAPIを使用してテキストをクリップボードにコピー
          navigator.clipboard.writeText(textToCopy).then(function() {
            console.log('Copying to clipboard was successful!');
            const icon = button.querySelector('.copy-icon');
            icon.textContent = 'done'; // アイコンを"done"に変更
            setTimeout(() => {
              icon.textContent = 'content_copy';
            }, 400);
          }, function(err) {
            console.error('Could not copy text: ', err);
          });
        }
      </script>
    </html>
  `
})

export const AddTodo = () => (
  <form hx-post="/todo" hx-target="#todo" hx-swap="beforebegin" _="on htmx:afterRequest reset() me" class="mb-4">
    <div class="mb-2">
      <textarea 
        name="title"
        id="customTextarea"
        rows={2}
        oninput="autoResizeTextarea(this)"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 w-full"
      ></textarea>
    </div>
  </form>
)

export const Item = ({ title, id }: { title: string; id: string }) => (
  <p
    class="flex row items-center justify-between py-1 px-4 rounded-lg border bg-gray-100 text-gray-900 mb-1 text-sm"
  >
    <span class="title-text flex-grow whitespace-pre-wrap">{title}</span>
    <button
      onclick="copyTextToClipboard(this)"
      data-action="copy"
    >
      <span class="mt-2 material-symbols-outlined copy-icon">content_copy</span>
    </button>
    <button
      hx-delete={`/todo/${id}`}
      hx-swap="outerHTML"
      hx-target="closest p"
      hx-trigger="click"
      hx-indicator=".indicator"
      data-action="delete"
    >
      <span class="mt-2 material-symbols-outlined indicator">delete</span>
    </button>
  </p>
)