export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

export function countWords(str: string): number {
  return str.trim().replaceAll(/\W/g, ' ').split(/\s+/).filter(Boolean).length;
}

export function countCodeBlocks(str: string): number {
  const codeBlockRegex = /```[\s\S]*?```/g;
  const matches = str.match(codeBlockRegex);
  return matches ? matches.length : 0;
}

export function countImages(str: string): number {
  const imageRegex = /!\[.*?\]\((.*?)\)/g;
  const matches = str.match(imageRegex);
  return matches ? matches.length : 0;
}

export function calculateReadTime(str: string, wordsPerMinute = 200): number {
  const wordCount = countWords(str);
  return Math.ceil(wordCount / wordsPerMinute);
}
