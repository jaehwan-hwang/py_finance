import katex from "katex";

/** 같은 수식을 여러 번 그리지 않도록 결과를 재사용한다. */
const cache = new Map<string, string>();

export function tex(src: string, display = false): string {
  const key = (display ? "D:" : "I:") + src;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;

  let html: string;
  try {
    html = katex.renderToString(src, {
      displayMode: display,
      throwOnError: false,
      output: "html",
      strict: false,
    });
  } catch {
    html = src;
  }
  cache.set(key, html);
  return html;
}

/** 문장 속 `$...$` 를 수식으로 바꾼다. `$`가 없으면 원문 그대로 돌려준다. */
export function withMath(s: string): string {
  if (!s.includes("$")) return s;
  return s.replace(/\$([^$\n]+)\$/g, (_, body: string) => tex(body, false));
}
