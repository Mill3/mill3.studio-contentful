import React from 'react';
import { Link as GatsbyLink } from 'gatsby';
import * as deepmerge from 'deepmerge';

import { INLINES, BLOCKS, MARKS } from '@contentful/rich-text-types';
import { documentToJSX } from './documentToJSX';

const Link = ({ children, to, activeClassName, ...other }) => {
  const internal = /^\/(?!\/)/.test(to);
  // To do: add test for public path (for absolute links that are still internal)

  // Use Gatsby Link for internal links, and <a> for others
  if (internal) {
    return (
      <GatsbyLink to={to} activeClassName={activeClassName} {...other}>
        {children}
      </GatsbyLink>
    )
  }
  return (
    <a href={to} {...other}>
      {children}
    </a>
  )
}

const renderComponent = (node, next) => {
  const {
    data: {
      target: {
        fields,
        sys: {
          id,
          linkType,
          type,
        },
      },
    },
  } = node;

  // Add custom components here
  switch (id) {
    case 'column':
      return <div {...fields} />;
    default:
      return <span />;
  }
};

const renderAsset = (node, next) => {
  const {
    data: {
      target: {
        fields: {
          file,
          title
        }
      },
    },
  } = node;

  if (file['en'].contentType.includes('image')) {
    return <img className="img-fluid" src={file['en'].url} alt={title} />
  }
  return <span />
};

// Override-able via options prop
const options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, next) => (
      <p>{next(node.content)}</p>
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node, next) => renderAsset(node, next),
    [BLOCKS.EMBEDDED_ENTRY]: (node, next) => renderComponent(node, next),
    [INLINES.ENTRY_HYPERLINK]: (node, next) => (
      <GatsbyLink
        to={node.data.target.fields ? node.data.target.fields.slug['en-US'] : '/404'}>
        {next(node.content)}
      </GatsbyLink>
    ),
    [INLINES.HYPERLINK]: (node, next) => {
      return (
        <Link className="spectrum-Link" to={node.data.uri}>
          {next(node.content)}
        </Link>
      );
    }
  },
  locale: `en-US`
};

class RichTextRenderer extends React.Component {
  getOptions = () => {
    if (this.props.options) {
      return deepmerge(options, this.props.options);
    }
    return options;
  };
  render() {
    const { content } = this.props;
    const JSONContent = JSON.parse(content);
    const renderOpts = this.getOptions();
    // console.log(renderOpts);

    const JSX = documentToJSX(JSONContent, renderOpts);

    return JSX;
  }
}

export default RichTextRenderer;