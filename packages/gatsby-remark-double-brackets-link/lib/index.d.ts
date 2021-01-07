import { Node } from "unist";
declare const addDoubleBracketsLinks: ({ markdownAST }: {
    markdownAST: Node;
}, options?: {
    titleToURLPath?: string | undefined;
    stripBrackets?: boolean | undefined;
} | undefined) => void;
export default addDoubleBracketsLinks;
