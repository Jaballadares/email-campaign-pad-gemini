
'use client';

import { createEditor, Descendant, Editor as SlateEditor, Transforms } from 'slate';
import { Slate, Editable, withReact, useSlate } from 'slate-react';
import { useCallback, useMemo, useState } from 'react';
import { CustomElement, CustomText } from './custom-types';
import { slateToHtml } from '@slate-serializers/html';

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
];

const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  return <span {...attributes}>{children}</span>;
};

const MarkButton = ({ format, children }: { format: keyof Omit<CustomText, 'text'>, children: React.ReactNode }) => {
  const editor = useSlate();
  return (
    <button
      className='p-2 border rounded'
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {children}
    </button>
  );
};

const toggleMark = (editor: SlateEditor, format: keyof Omit<CustomText, 'text'>) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    SlateEditor.removeMark(editor, format);
  } else {
    SlateEditor.addMark(editor, format, true);
  }
};

const isMarkActive = (editor: SlateEditor, format: keyof Omit<CustomText, 'text'>) => {
  const marks = SlateEditor.marks(editor);
  return marks ? marks[format] === true : false;
};

export default function Editor() {
  const editor = useMemo(() => withReact(createEditor()), []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const [value, setValue] = useState<Descendant[]>(initialValue);

  const handlePublish = async () => {
    const html = slateToHtml(value as any);
    await fetch('/api/braze/templates', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: html }),
    });
  };

  return (
    <Slate editor={editor} initialValue={value} onChange={setValue}>
      <div className='flex justify-between items-center mb-2'>
        <div className='flex gap-2'>
          <MarkButton format="bold">Bold</MarkButton>
          <MarkButton format="italic">Italic</MarkButton>
        </div>
        <button onClick={handlePublish} className='p-2 border rounded bg-blue-500 text-white'>
          Publish to Braze
        </button>
      </div>
      <div className='p-4 border rounded'>
        <Editable renderLeaf={renderLeaf} />
      </div>
    </Slate>
  );
}
