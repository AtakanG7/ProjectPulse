import React from 'react';
import DOMPurify from 'dompurify';
import { FaQuoteLeft } from 'react-icons/fa';

const sanitizeHTML = (html) => {
  return { __html: DOMPurify.sanitize(html) };
};

const middleware = (next) => (block) => {
  if (block.data && block.data.text) {
    block.data.text = DOMPurify.sanitize(block.data.text);
  }
  return next(block);
};

const EditorJSRenderer = ({ data }) => {
  const parseData = (rawData) => {
    try {
      if (typeof rawData === 'string') {
        const parsed = JSON.parse(rawData);
        return parsed.blocks ? parsed : JSON.parse(parsed);
      }
      return rawData;
    } catch (error) {
      console.error('Error parsing EditorJS data:', error);
      return null;
    }
  };

  const parsedData = parseData(data);

  if (!parsedData || !parsedData.blocks || parsedData.blocks.length === 0) {
    return <p className="text-gray-500 italic text-center py-8">No content available.</p>;
  }

  const renderBlock = middleware((block) => {
    switch (block.type) {
      case 'header':
        const HeadingTag = `h${block.data.level}`;
        const headingClasses = {
          h1: "text-4xl font-bold mb-6 text-gray-900 border-b pb-2",
          h2: "text-3xl font-semibold mb-5 text-gray-800",
          h3: "text-2xl font-medium mb-4 text-gray-800",
          h4: "text-xl font-medium mb-3 text-gray-700",
          h5: "text-lg font-medium mb-2 text-gray-700",
          h6: "text-base font-medium mb-2 text-gray-700"
        };
        return <HeadingTag key={block.id} className={headingClasses[HeadingTag]}>{block.data.text}</HeadingTag>;

      case 'paragraph':
        return <p key={block.id} className="text-gray-700 mb-4 leading-relaxed" dangerouslySetInnerHTML={sanitizeHTML(block.data.text)} />;

      case 'list':
        const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
        const listClasses = block.data.style === 'ordered' 
          ? "list-decimal pl-5 space-y-2 mb-4" 
          : "list-disc pl-5 space-y-2 mb-4";

        return (
          <ListTag key={block.id} className={listClasses}>
            {block.data.items.map((item, index) => (
              <li key={`${block.id}-${index}`} className="text-gray-700 pl-2" dangerouslySetInnerHTML={sanitizeHTML(item)} />
            ))}
          </ListTag>
        );

      case 'image':
        return (
          <figure key={block.id} className="mb-6">
            <img src={block.data.file?.url} alt={block.data.caption} className="w-full h-auto rounded-lg shadow-md" />
            {block.data.caption && (
              <figcaption className="text-sm text-gray-600 mt-2 text-center italic">
                {block.data.caption}
              </figcaption>
            )}
          </figure>
        );

      case 'quote':
        return (
          <blockquote key={block.id} className="border-l-4 border-blue-500 pl-4 py-2 mb-6 bg-blue-50 rounded-r-lg">
            <div className="flex items-start">
              <FaQuoteLeft className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <p className="italic text-gray-700 mb-2" dangerouslySetInnerHTML={sanitizeHTML(block.data.text)} />
                {block.data.caption && <footer className="text-sm text-gray-600">— {block.data.caption}</footer>}
              </div>
            </div>
          </blockquote>
        );

      case 'table':
        return (
          <div key={block.id} className="mb-6 overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 bg-white shadow-sm rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  {block.data.content[0].map((header, index) => (
                    <th key={`${block.id}-header-${index}`} className="border border-gray-300 p-2 text-left font-semibold text-gray-700">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.data.content.slice(1).map((row, rowIndex) => (
                  <tr key={`${block.id}-row-${rowIndex}`} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    {row.map((cell, cellIndex) => (
                      <td key={`${block.id}-cell-${rowIndex}-${cellIndex}`} className="border border-gray-300 p-2 text-gray-700" dangerouslySetInnerHTML={sanitizeHTML(cell)} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'code':
        return (
          <pre key={block.id} className="bg-gray-100 p-4 rounded-lg overflow-x-auto border border-gray-300 text-sm mb-6">
            <code className="text-gray-800">{block.data.code}</code>
          </pre>
        );

      default:
        console.warn(`Unsupported block type: ${block.type}`);
        return null;
    }
  });

  return (
    <div className="prose max-w-none lg:prose-xl">
      <div className="container mx-auto px-4 lg:px-0">
        {parsedData.blocks.map(renderBlock)}
      </div>
    </div>
  );
};

export default EditorJSRenderer;