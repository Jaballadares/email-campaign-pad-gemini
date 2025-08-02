'use client';

interface SidePanelProps {
  subject: string;
  setSubject: (subject: string) => void;
  previewText: string;
  setPreviewText: (previewText: string) => void;
}

export default function SidePanel({ subject, setSubject, previewText, setPreviewText }: SidePanelProps) {
  return (
    <div className='bg-card p-6 rounded-lg shadow-lg'>
      <h2 className='text-lg font-bold mb-4 border-b pb-2'>Email Metadata</h2>
      <div className='mb-4'>
        <label htmlFor='subject' className='block mb-2 text-sm font-medium text-muted-foreground'>Subject</label>
        <input
          type='text'
          id='subject'
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className='w-full px-3 py-2 bg-input rounded-md text-sm'
        />
      </div>
      <div>
        <label htmlFor='previewText' className='block mb-2 text-sm font-medium text-muted-foreground'>Preview Text</label>
        <input
          type='text'
          id='previewText'
          value={previewText}
          onChange={(e) => setPreviewText(e.target.value)}
          className='w-full px-3 py-2 bg-input rounded-md text-sm'
        />
      </div>
    </div>
  );
}
