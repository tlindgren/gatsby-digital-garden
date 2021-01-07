"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const unist_util_visit_1 = __importDefault(require("unist-util-visit"));
const slugify_1 = __importDefault(require("slugify"));
const addDoubleBracketsLinks = ({ markdownAST }, options) => {
    const titleToURL = (options === null || options === void 0 ? void 0 : options.titleToURLPath) ? require(options.titleToURLPath)
        : (title) => `/${slugify_1.default(title)}`;
    const definitions = {};
    unist_util_visit_1.default(markdownAST, `definition`, (node) => {
        if (!node.identifier || typeof node.identifier !== "string") {
            return;
        }
        definitions[node.identifier] = true;
    });
    unist_util_visit_1.default(markdownAST, `linkReference`, (node, index, parent) => {
        if (node.referenceType !== "shortcut" ||
            (typeof node.identifier === "string" && definitions[node.identifier])) {
            return;
        }
        const siblings = parent.children;
        if (!siblings || !Array.isArray(siblings)) {
            return;
        }
        const previous = siblings[index - 1];
        const next = siblings[index + 1];
        if (!previous || !next) {
            return;
        }
        if (previous.type !== "text" ||
            previous.value[previous.value.length - 1] !== "[" ||
            next.type !== "text" ||
            next.value[0] !== "]") {
            return;
        }
        previous.value = previous.value.replace(/\[$/, "");
        next.value = next.value.replace(/^\]/, "");
        node.type = "link";
        node.url = titleToURL(node.label);
        node.title = node.label;
        if (!(options === null || options === void 0 ? void 0 : options.stripBrackets) && Array.isArray(node.children)) {
            node.children[0].value = `[[${node.children[0].value}]]`;
        }
        delete node.label;
        delete node.referenceType;
        delete node.identifier;
    });
};
exports.default = addDoubleBracketsLinks;
