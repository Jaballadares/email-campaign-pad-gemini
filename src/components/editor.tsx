"use client";

import {
  createEditor,
  Descendant,
  Editor as SlateEditor,
  Transforms,
} from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import { useCallback, useMemo, useState, useEffect } from "react";
import { CustomElement, CustomText } from "./custom-types";
import { slateToHtml, htmlToSlate } from "@slate-serializers/html";

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "Loading content from Braze..." }],
  },
];

interface EditorProps {
  subject: string;
  setSubject: (subject: string) => void;
  previewText: string;
  setPreviewText: (previewText: string) => void;
}

const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  return <span {...attributes}>{children}</span>;
};

const Element = (props: any) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case "heading-one":
      return (
        <h1 {...attributes} className="text-3xl font-bold mb-4">
          {children}
        </h1>
      );
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return (
        <ol {...attributes} className="list-decimal list-inside">
          {children}
        </ol>
      );
    case "bulleted-list":
      return (
        <ul {...attributes} className="list-disc list-inside">
          {children}
        </ul>
      );
    default:
      return (
        <p {...attributes} className="mb-4">
          {children}
        </p>
      );
  }
};

const MarkButton = ({
  format,
  children,
}: {
  format: keyof Omit<CustomText, "text">;
  children: React.ReactNode;
}) => {
  const editor = useSlate();
  return (
    <button
      className="px-3 py-1 text-sm font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {children}
    </button>
  );
};

const BlockButton = ({
  format,
  children,
}: {
  format: string;
  children: React.ReactNode;
}) => {
  const editor = useSlate();
  return (
    <button
      className="px-3 py-1 text-sm font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {children}
    </button>
  );
};

const toggleMark = (
  editor: SlateEditor,
  format: keyof Omit<CustomText, "text">
) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    SlateEditor.removeMark(editor, format);
  } else {
    SlateEditor.addMark(editor, format, true);
  }
};

const toggleBlock = (editor: SlateEditor, format: string) => {
  const isActive = isBlockActive(editor, format);
  const isList = ["numbered-list", "bulleted-list"].includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) => ["numbered-list", "bulleted-list"].includes(n.type as string),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive ? "paragraph" : isList ? "list-item" : format,
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const isMarkActive = (
  editor: SlateEditor,
  format: keyof Omit<CustomText, "text">
) => {
  const marks = SlateEditor.marks(editor);
  return marks ? marks[format] === true : false;
};

const isBlockActive = (editor: SlateEditor, format: string) => {
  const [match] = SlateEditor.nodes(editor, {
    match: (n) => n.type === format,
  });

  return !!match;
};

export default function Editor({
  subject,
  setSubject,
  previewText,
  setPreviewText,
}: EditorProps) {
  const editor = useMemo(() => withReact(createEditor()), []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const [validationStatus, setValidationStatus] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchContent = async () => {
  //     const response = await fetch('/api/braze/templates');
  //     const data = await response.json();
  //     if (data.success) {
  //       const slateContent = htmlToSlate(data.content);
  //       setValue(slateContent as Descendant[]);
  //       setSubject(data.subject);
  //       setPreviewText(data.preview_text);
  //     }
  //   };

  //   fetchContent();
  // }, [setSubject, setPreviewText]);
  useEffect(() => {
    // Dummy data to simulate a successful response from the Braze API
    const dummyData = {
      success: true,
      content:
        "<p>This is some <strong>dummy</strong> content loaded successfully!</p>",
      subject: "Dummy Subject",
      preview_text: "Dummy preview text",
    };

    // Simulate a network delay (optional)
    const timer = setTimeout(() => {
      const slateContent = htmlToSlate(dummyData.content);
      setValue(slateContent as Descendant[]);
      setSubject(dummyData.subject);
      setPreviewText(dummyData.preview_text);
    }, 1000); // 1 second delay

    // Clear the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, [setSubject, setPreviewText]);

  const handlePublish = async () => {
    const html = slateToHtml(value as any);

    const validationResponse = await fetch("/api/liquid/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: html }),
    });

    const validationData = await validationResponse.json();

    if (!validationData.success) {
      setValidationStatus(`Liquid Error: ${validationData.error}`);
      return;
    }

    setValidationStatus("Liquid syntax is valid!");

    await fetch("/api/braze/templates", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: html, subject, previewText }),
    });
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-lg">
      <Slate editor={editor} initialValue={value} onChange={setValue}>
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <div className="flex gap-2">
            <MarkButton format="bold">Bold</MarkButton>
            <MarkButton format="italic">Italic</MarkButton>
            <BlockButton format="heading-one">H1</BlockButton>
            <BlockButton format="numbered-list">OL</BlockButton>
            <BlockButton format="bulleted-list">UL</BlockButton>
          </div>
          <div className="flex items-center gap-2">
            {validationStatus && (
              <div className="text-sm text-muted-foreground">
                {validationStatus}
              </div>
            )}
            <button
              onClick={handlePublish}
              className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Publish to Braze
            </button>
          </div>
        </div>
        <div className="p-4 border rounded-md bg-background">
          <Editable renderElement={renderElement} renderLeaf={renderLeaf} />
        </div>
      </Slate>
    </div>
  );
}
