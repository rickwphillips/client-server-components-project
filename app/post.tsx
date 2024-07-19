import sanitizeHtml from "sanitize-html";

export default function Post() {
  return <article>{sanitizeHtml('Post content')}</article>;
}