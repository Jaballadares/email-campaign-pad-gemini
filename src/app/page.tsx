'use client';

import Editor from '@/components/editor';
import SidePanel from '@/components/side-panel';
import { useState } from 'react';

export default function Home() {
  const [subject, setSubject] = useState('');
  const [previewText, setPreviewText] = useState('');

  return (
    <main className="min-h-screen flex flex-row items-start justify-center p-12 bg-background text-foreground">
      <div className="container mx-auto flex flex-row gap-8">
        <div className="w-2/3">
          <Editor 
            subject={subject} 
            previewText={previewText} 
            setSubject={setSubject} 
            setPreviewText={setPreviewText} 
          />
        </div>
        <div className="w-1/3">
          <SidePanel 
            subject={subject} 
            previewText={previewText} 
            setSubject={setSubject} 
            setPreviewText={setPreviewText} 
          />
        </div>
      </div>
    </main>
  );
}

