import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const FullScreenEditor = ({ initialData, onSave, onBack, saving }) => {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);

  useEffect(() => {
    if (!editorInstanceRef.current) {
      initEditor();
    }
    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, []);

  const initEditor = () => {
    const editor = new EditorJS({
      holder: editorRef.current,
      tools: {
        header: Header,
        list: List,
        image: {
          class: Image,
          config: {
            endpoints: {
              byFile: 'http://localhost:8008/uploadFile', // Replace with your image upload endpoint
              byUrl: 'http://localhost:8008/fetchUrl',  // Replace with your image fetch endpoint
            }
          }
        }
      },
      data: {
        blocks: [
          {
            type: "header",
            data: {
              text: initialData.title,
              level: 1
            }
          },
          {
            type: "paragraph",
            data: {
              text: initialData.description || "Start writing your project description..."
            }
          }
        ]
      },
      placeholder: 'Let\'s write an awesome project description!',
    });

    editorInstanceRef.current = editor;
  };

  const handleSave = async () => {
    if (editorInstanceRef.current) {
      const editorData = await editorInstanceRef.current.save();
      const projectData = {
        title: editorData.blocks.find(block => block.type === 'header')?.data.text || initialData.title,
        description: editorData.blocks
          .filter(block => block.type !== 'header')
          .map(block => block.data.text)
          .join('\n\n')
      };
      onSave(projectData);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Back to Settings
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center"
        >
          <FaSave className="mr-2" />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
      <div ref={editorRef} className="flex-grow overflow-auto p-8 bg-gray-50" />
    </div>
  );
};

export default FullScreenEditor;