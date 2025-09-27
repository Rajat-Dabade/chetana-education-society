import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo
} from 'lucide-react'
import { useState } from 'react'
import { uploadApi } from '@/lib/api'
import toast from 'react-hot-toast'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function RichTextEditor({ content, onChange, placeholder = "Start writing..." }: RichTextEditorProps) {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [uploading, setUploading] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-600 hover:text-primary-700 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
      },
    },
  })

  if (!editor) {
    return null
  }

  const handleAddLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl('')
      setIsLinkModalOpen(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const response = await uploadApi.uploadFile(file)
      editor.chain().focus().setImage({ src: response.data.url }).run()
      toast.success('Image uploaded successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const ToolbarButton = ({ onClick, isActive, disabled, children, title }: any) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-md transition-colors ${
        isActive
          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  )

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 p-2">
        <div className="flex items-center space-x-1 flex-wrap">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Ordered List"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          <ToolbarButton
            onClick={() => setIsLinkModalOpen(true)}
            isActive={editor.isActive('link')}
            title="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => document.getElementById('image-upload')?.click()}
            disabled={uploading}
            title={uploading ? 'Uploading...' : 'Add Image'}
          >
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>

          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white dark:bg-navy-900 min-h-[200px]">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none dark:prose-invert"
        />
        {editor.isEmpty && (
          <p className="absolute top-16 left-4 text-gray-400 pointer-events-none">
            {placeholder}
          </p>
        )}
      </div>

      {/* Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-navy-900 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add Link
            </h3>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="form-input mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsLinkModalOpen(false)
                  setLinkUrl('')
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLink}
                className="btn-primary"
              >
                Add Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
