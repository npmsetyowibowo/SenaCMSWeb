'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Code2,
  Undo,
  Redo,
  Eraser,
  Eye,
  Palette,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Mulai tulis konten artikel berkualitas di sini...',
  minHeight = '360px',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [sourceCode, setSourceCode] = useState(value);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [linkData, setLinkData] = useState({ url: '', text: '' });
  const [imageData, setImageData] = useState({ url: '', alt: '' });
  const [isBoldActive, setIsBoldActive] = useState(false);
  const [isItalicActive, setIsItalicActive] = useState(false);
  const [isUnderlineActive, setIsUnderlineActive] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Check active text formatting states
  const updateActiveStates = () => {
    if (isSourceMode) return;
    try {
      setIsBoldActive(document.queryCommandState('bold'));
      setIsItalicActive(document.queryCommandState('italic'));
      setIsUnderlineActive(document.queryCommandState('underline'));
    } catch {
      // ignore
    }
  };

  // Sync incoming value to editor content if external changes happen
  useEffect(() => {
    if (!isSourceMode && editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
    setSourceCode(value);
  }, [value, isSourceMode]);

  const exec = (command: string, arg: string | undefined = undefined) => {
    if (isSourceMode) return;
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
      setSourceCode(html);
    }
    updateActiveStates();
  };

  const handleBoldClick = () => {
    exec('bold');
    // If we just activated bold, update states immediately
    setTimeout(() => {
      updateActiveStates();
    }, 50);
  };

  const handleApplyColor = (colorHex: string) => {
    exec('foreColor', colorHex);
    setShowColorPicker(false);
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
      setSourceCode(html);
    }
  };

  const toggleSourceMode = () => {
    if (isSourceMode) {
      // Switching from source to visual
      onChange(sourceCode);
      if (editorRef.current) {
        editorRef.current.innerHTML = sourceCode;
      }
      setIsSourceMode(false);
    } else {
      // Switching to source
      setSourceCode(value);
      setIsSourceMode(true);
    }
  };

  const handleInsertLink = () => {
    if (!linkData.url) return;
    const url = linkData.url.startsWith('http') || linkData.url.startsWith('/') ? linkData.url : `https://${linkData.url}`;
    const text = linkData.text || linkData.url;
    const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">${text}</a>`;
    exec('insertHTML', linkHtml);
    setShowLinkModal(false);
    setLinkData({ url: '', text: '' });
  };

  const handleInsertImage = () => {
    if (!imageData.url) return;
    const alt = imageData.alt ? `alt="${imageData.alt}"` : 'alt="Gambar Artikel"';
    const imgHtml = `<figure class="my-4"><img src="${imageData.url}" ${alt} class="rounded-xl max-w-full h-auto mx-auto shadow-md" /><figcaption class="text-xs text-center text-slate-500 mt-1">${imageData.alt || ''}</figcaption></figure>`;
    exec('insertHTML', imgHtml);
    setShowImageModal(false);
    setImageData({ url: '', alt: '' });
  };

  const handleInsertTable = () => {
    const tableHtml = `
      <div class="overflow-x-auto my-4">
        <table class="min-w-full border border-slate-300 dark:border-slate-700 text-sm">
          <thead>
            <tr class="bg-slate-100 dark:bg-slate-800">
              <th class="border border-slate-300 dark:border-slate-700 px-3 py-2 text-left">Fitur</th>
              <th class="border border-slate-300 dark:border-slate-700 px-3 py-2 text-left">Deskripsi</th>
              <th class="border border-slate-300 dark:border-slate-700 px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-slate-300 dark:border-slate-700 px-3 py-2">Fitur 1</td>
              <td class="border border-slate-300 dark:border-slate-700 px-3 py-2">Keterangan...</td>
              <td class="border border-slate-300 dark:border-slate-700 px-3 py-2">Tersedia</td>
            </tr>
            <tr>
              <td class="border border-slate-300 dark:border-slate-700 px-3 py-2">Fitur 2</td>
              <td class="border border-slate-300 dark:border-slate-700 px-3 py-2">Keterangan...</td>
              <td class="border border-slate-300 dark:border-slate-700 px-3 py-2">Tersedia</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
    exec('insertHTML', tableHtml);
  };

  return (
    <div className="rounded-2xl neu-flat border border-slate-200/80 dark:border-slate-800 overflow-hidden">
      {/* Toolbar */}
      <div className="p-2.5 bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center gap-1.5 text-slate-700 dark:text-slate-300">
        {/* Headings */}
        <button
          type="button"
          onClick={() => exec('formatBlock', '<h2>')}
          className="p-1.5 rounded-lg neu-button hover:text-blue-600"
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('formatBlock', '<h3>')}
          className="p-1.5 rounded-lg neu-button hover:text-blue-600"
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('formatBlock', '<p>')}
          className="px-2 py-1 text-xs font-semibold rounded-lg neu-button hover:text-blue-600"
          title="Normal Paragraph"
        >
          P
        </button>

        <span className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1" />

        {/* Text Styles */}
        <button
          type="button"
          onClick={handleBoldClick}
          className={`p-1.5 rounded-lg transition-all flex items-center gap-1 ${
            isBoldActive
              ? 'bg-blue-600 text-white font-extrabold shadow-md ring-2 ring-blue-400 neu-pressed'
              : 'neu-button text-slate-700 dark:text-slate-300 hover:text-blue-600'
          }`}
          title={isBoldActive ? 'Bold Sedang Aktif (Teks Berwarna Tebal)' : 'Tebalkan Teks / Bold (Ctrl+B)'}
        >
          <Bold className="w-4 h-4" />
          {isBoldActive && <span className="text-[10px] uppercase font-bold tracking-wider hidden sm:inline">Tebal</span>}
        </button>
        <button
          type="button"
          onClick={() => exec('italic')}
          className={`p-1.5 rounded-lg transition-all ${
            isItalicActive
              ? 'neu-pressed text-blue-600 font-bold border border-blue-400'
              : 'neu-button hover:text-blue-600'
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('underline')}
          className={`p-1.5 rounded-lg transition-all ${
            isUnderlineActive
              ? 'neu-pressed text-blue-600 font-bold border border-blue-400'
              : 'neu-button hover:text-blue-600'
          }`}
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('strikeThrough')}
          className="p-1.5 rounded-lg neu-button hover:text-blue-600"
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        {/* Color Picker Palette */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className={`p-1.5 rounded-lg neu-button hover:text-blue-600 flex items-center gap-1 ${
              showColorPicker ? 'neu-pressed text-blue-600 border border-blue-400' : ''
            }`}
            title="Pilih Warna Teks"
          >
            <Palette className="w-4 h-4 text-blue-500" />
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1.5 z-30 neu-flat p-2 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 bg-[#eef2f6] dark:bg-[#121824] shadow-xl">
              {[
                { name: 'Biru Utama', color: '#2563eb' },
                { name: 'Indigo Ungu', color: '#4f46e5' },
                { name: 'Hijau Emerald', color: '#10b981' },
                { name: 'Oranye Amber', color: '#f59e0b' },
                { name: 'Merah Rose', color: '#e11d48' },
                { name: 'Gelap Standar', color: '#1e293b' },
              ].map((c) => (
                <button
                  key={c.color}
                  type="button"
                  onClick={() => handleApplyColor(c.color)}
                  className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-700 hover:scale-125 transition-transform shadow-sm"
                  style={{ backgroundColor: c.color }}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>

        <span className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1" />

        {/* Lists & Quotes */}
        <button
          type="button"
          onClick={() => exec('insertUnorderedList')}
          className="p-1.5 rounded-lg neu-button hover:text-blue-600"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('insertOrderedList')}
          className="p-1.5 rounded-lg neu-button hover:text-blue-600"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('formatBlock', '<blockquote>')}
          className="p-1.5 rounded-lg neu-button hover:text-blue-600"
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('formatBlock', '<pre>')}
          className="p-1.5 rounded-lg neu-button hover:text-blue-600"
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1" />

        {/* Inserts: Link, Image, Table */}
        <button
          type="button"
          onClick={() => setShowLinkModal(true)}
          className="p-1.5 rounded-lg neu-button hover:text-blue-600"
          title="Sisipkan Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setShowImageModal(true)}
          className="p-1.5 rounded-lg neu-button hover:text-blue-600"
          title="Sisipkan Gambar"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleInsertTable}
          className="p-1.5 rounded-lg neu-button hover:text-blue-600"
          title="Sisipkan Tabel"
        >
          <TableIcon className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1" />

        {/* Undo, Redo, Clear */}
        <button
          type="button"
          onClick={() => exec('undo')}
          className="p-1.5 rounded-lg neu-button hover:text-blue-600"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('redo')}
          className="p-1.5 rounded-lg neu-button hover:text-blue-600"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('removeFormat')}
          className="p-1.5 rounded-lg neu-button hover:text-rose-600"
          title="Hapus Format"
        >
          <Eraser className="w-4 h-4" />
        </button>

        {/* Source Mode Toggle */}
        <div className="ml-auto">
          <button
            type="button"
            onClick={toggleSourceMode}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
              isSourceMode
                ? 'neu-pressed text-blue-600 dark:text-blue-400 font-bold border border-blue-400'
                : 'neu-button text-slate-700 dark:text-slate-300 hover:text-blue-600'
            }`}
            title="Toggle Source HTML"
          >
            {isSourceMode ? <Eye className="w-3.5 h-3.5" /> : <Code2 className="w-3.5 h-3.5" />}
            <span>{isSourceMode ? 'Visual Mode' : 'Source Code'}</span>
          </button>
        </div>
      </div>

      {/* Editor Surface */}
      {isSourceMode ? (
        <textarea
          value={sourceCode}
          onChange={(e) => {
            setSourceCode(e.target.value);
            onChange(e.target.value);
          }}
          className="w-full p-4 font-mono text-xs sm:text-sm bg-slate-900 text-emerald-400 outline-none resize-y"
          style={{ minHeight }}
          spellCheck={false}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onMouseUp={updateActiveStates}
          onKeyUp={updateActiveStates}
          onSelect={updateActiveStates}
          className="p-5 neu-pressed-sm outline-none overflow-y-auto prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed focus:ring-0 editor-bold-colored"
          style={{ minHeight }}
          data-placeholder={placeholder}
        />
      )}

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="neu-flat p-6 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="font-bold text-base text-slate-800 dark:text-slate-100">Sisipkan Tautan (Link)</h4>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Teks Tautan</label>
              <input
                type="text"
                placeholder="Contoh: Baca panduan lengkap"
                value={linkData.text}
                onChange={(e) => setLinkData({ ...linkData, text: e.target.value })}
                className="w-full neu-pressed px-3 py-2 text-sm rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">URL Target *</label>
              <input
                type="text"
                placeholder="https://... atau /layanan"
                value={linkData.url}
                onChange={(e) => setLinkData({ ...linkData, url: e.target.value })}
                className="w-full neu-pressed px-3 py-2 text-sm rounded-xl outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="neu-button px-4 py-2 text-xs rounded-xl text-slate-600 dark:text-slate-400"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                className="neu-accent-btn px-4 py-2 text-xs rounded-xl font-semibold"
              >
                Sisipkan Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="neu-flat p-6 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="font-bold text-base text-slate-800 dark:text-slate-100">Sisipkan Gambar URL</h4>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">URL Gambar *</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={imageData.url}
                onChange={(e) => setImageData({ ...imageData, url: e.target.value })}
                className="w-full neu-pressed px-3 py-2 text-sm rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Deskripsi Alternatif (Alt Text SEO) *</label>
              <input
                type="text"
                placeholder="Contoh: Ilustrasi desain website responsif SenaWeb"
                value={imageData.alt}
                onChange={(e) => setImageData({ ...imageData, alt: e.target.value })}
                className="w-full neu-pressed px-3 py-2 text-sm rounded-xl outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">Penting untuk skor Image SEO & aksesibilitas!</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="neu-button px-4 py-2 text-xs rounded-xl text-slate-600 dark:text-slate-400"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleInsertImage}
                className="neu-accent-btn px-4 py-2 text-xs rounded-xl font-semibold"
              >
                Sisipkan Gambar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
