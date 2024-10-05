import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const EditorJS = dynamic(() => import('@editorjs/editorjs'), { ssr: false });
const Header = dynamic(() => import('@editorjs/header'), { ssr: false });
const List = dynamic(() => import('@editorjs/list'), { ssr: false });
const Image = dynamic(() => import('@editorjs/image'), { ssr: false });

const FullScreenEditor = ({ initialData, onSave, saving, onClose, projectId }) => {
  const editorRef = useRef(null);
  const [editorInstance, setEditorInstance] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !editorInstance) {
      initEditor();
    }
    return () => {
      if (editorInstance) {
        editorInstance.destroy();
      }
    };
  }, [editorInstance]);

  const initEditor = async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default;
    const Header = (await import('@editorjs/header')).default;
    const List = (await import('@editorjs/list')).default;
    const Image = (await import('@editorjs/image')).default;

    let editorData;
    if (typeof initialData === 'string') {
      try {
        editorData = JSON.parse(initialData);
      } catch (error) {
        console.error('Error parsing initial data:', error);
        editorData = null;
      }
    } else if (initialData && typeof initialData === 'object') {
      editorData = initialData;
    }

    const editor = new EditorJS({
      holder: editorRef.current,
      tools: {
        header: Header,
        list: List,
        image: {
          class: Image,
          config: {
            uploader: {
              uploadByFile: async (file) => {
                const formData = new FormData();
                formData.append('image', file);
                formData.append('projectId', projectId);

                try {
                  const response = await fetch('/api/projects/images', {
                    method: 'POST',
                    body: formData,
                  });

                  if (!response.ok) {
                    throw new Error('Image upload failed');
                  }

                  const data = await response.json();

                  return {
                    success: 1,
                    file: {
                      url: data.imageUrl,
                    }
                  };
                } catch (error) {
                  console.error('Error uploading image:', error);
                  return {
                    success: 0,
                    file: {
                      url: null,
                    }
                  };
                }
              }
            }
          }
        }
      },
      data: editorData || {
        blocks: [
          {
            type: "header",
            data: {
              text: "Start writing your project description...",
              level: 1
            }
          },
          {
            type: "paragraph",
            data: {
              text: "Add your content here."
            }
          }
        ]
      },
      placeholder: 'Let\'s write an awesome project description!',
    });

    setEditorInstance(editor);
  };

  const handleSave = async () => {
    if (editorInstance) {
      const editorData = await editorInstance.save();
      console.log('Editor data to be saved:', editorData);
      onSave(editorData);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Back
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
      <div ref={editorRef} className="flex-grow overflow-auto py-8 px-4 bg-gray-50" />
    </div>
  );
};

export default FullScreenEditor;