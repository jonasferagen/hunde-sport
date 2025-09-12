import { decode } from "he";
import { parseDocument } from "htmlparser2";

export const cleanHtml = (html: string) => htmlToPlainText(decode(html));


export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const isAllWhitespace = (str: string) => /^\s*$/.test(str);

export const htmlToPlainText = (html: string): string => {
  const dom = parseDocument(html);

  const walk = (nodes: any[]): string => {
    let text = "";
    nodes.forEach((node, _index) => {
      if (node.type === "text") {
        if (!isAllWhitespace(node.data)) {
          text += node.data;
        }
      } else if (node.type === "tag") {
        let childrenText = walk(node.children || []);
        if (node.name === "p" || node.name === "div") {
          // Add double newline after paragraphs or divs, but only if they contain non-whitespace text.
          if (!isAllWhitespace(childrenText)) {
            text += childrenText + "\n\n";
          }
        } else if (node.name === "br") {
          text += "\n";
        } else if (node.name === "strong" || node.name === "b") {
          text += `**${childrenText}**`;
        } else {
          text += childrenText;
        }
      }
    });
    return text;
  };

  // Process and clean up the final text
  let result = walk(dom.children);
  // Trim leading/trailing whitespace and collapse multiple newlines into a maximum of two
  return result.replace(/\n{3,}/g, "\n\n").trim();
};

export const slugKey = (s: unknown) =>
  String(s ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFKD") // split accents
    .replace(/\p{Diacritic}/gu, "") // remove diacritics (ø -> o, å -> a)
    .replace(/[øö]/g, "o") // handle Nordic/Germanic o variants
    .replace(/[æä]/g, "a") // handle a variants
    .replace(/[ß]/g, "ss") // German sharp s
    .replace(/\s+/g, "-");
