import escape from 'escape-html';
import React from 'react';

import {
  Document,
  Mark,
  Text,
  BLOCKS,
  MARKS,
  INLINES,
  Block,
  Inline,
  helpers,
} from '@contentful/rich-text-types';

let NODE_KEY_I = 0;

const defaultNodeRenderers = {
  [BLOCKS.PARAGRAPH]: (node, next) => <p>{next(node.content)}</p>,
  [BLOCKS.HEADING_1]: (node, next) => <h1>{next(node.content)}</h1>,
  [BLOCKS.HEADING_2]: (node, next) => <h2>{next(node.content)}</h2>,
  [BLOCKS.HEADING_3]: (node, next) => <h3>{next(node.content)}</h3>,
  [BLOCKS.HEADING_4]: (node, next) => <h4>{next(node.content)}</h4>,
  [BLOCKS.HEADING_5]: (node, next) => <h5>{next(node.content)}</h5>,
  [BLOCKS.HEADING_6]: (node, next) => <h6>{next(node.content)}</h6>,
  [BLOCKS.EMBEDDED_ENTRY]: (node, next) => <div>{next(node.content)}</div>,
  [BLOCKS.EMBEDDED_ASSET]: (node, next) => <div>{next(node.content)}</div>,
  [BLOCKS.UL_LIST]: (node, next) => <ul>{next(node.content)}</ul>,
  [BLOCKS.OL_LIST]: (node, next) => <ol>{next(node.content)}</ol>,
  [BLOCKS.LIST_ITEM]: (node, next) => <li>{next(node.content)}</li>,
  [BLOCKS.QUOTE]: (node, next) => <blockquote>{next(node.content)}</blockquote>,
  [BLOCKS.HR]: () => <hr />,
  [INLINES.ASSET_HYPERLINK]: node =>
    defaultInline(INLINES.ASSET_HYPERLINK, node),
  [INLINES.ENTRY_HYPERLINK]: (node, next) => (
    <a href={node.data.target.sys.id}>{next(node.content)}</a>
  ),
  [INLINES.EMBEDDED_ENTRY]: node => defaultInline(INLINES.EMBEDDED_ENTRY, node),
  [INLINES.HYPERLINK]: (node, next) => (
    <a href={node.data.uri}>{next(node.content)}</a>
  ),
};

const defaultMarkRenderers = {
  [MARKS.BOLD]: text => <b>{text}</b>,
  [MARKS.ITALIC]: text => <i>{text}</i>,
  [MARKS.UNDERLINE]: text => <u>{text}</u>,
  [MARKS.CODE]: text => <code>{text}</code>,
};

const defaultInline = (type, node) => (
  <span>
    type: {type} id: {node.data.target.sys.id}
  </span>
);

/**
 * Serialize a Contentful Rich Text `document` to JSX.
 */
export function documentToJSX(richTextDocument, options = {}) {
  NODE_KEY_I = 0;
  return nodeListToJSX(richTextDocument.content, {
    renderNode: {
      ...defaultNodeRenderers,
      ...options.renderNode,
    },
    renderMark: {
      ...defaultMarkRenderers,
      ...options.renderMark,
    },
  });
}

function nodeListToJSX(nodes, { renderNode, renderMark }) {
  return nodes.map(node => nodeToJSX(node, { renderNode, renderMark }));
}

function nodeToJSX(node, { renderNode, renderMark }) {
  // console.log(node);

  if (helpers.isText(node)) {
    const nodeValue = escape(node.value);
    if (node.marks.length > 0) {
      return node.marks.reduce((value, mark) => {
        if (!renderMark[mark.type]) {
          return value;
        }
        return {
          ...renderMark[mark.type](value),
          key: NODE_KEY_I++
        };
      }, nodeValue);
    }

    return nodeValue;
  } else {

    const nextNode = nodes => nodeListToJSX(nodes, { renderMark, renderNode });
    if (!node.nodeType || !renderNode[node.nodeType]) {
      return <span />;
    }
    return {
      ...renderNode[node.nodeType](node, nextNode),
      key: NODE_KEY_I++
    };
  }
}