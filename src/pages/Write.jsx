import React, { useState, useContext, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { FiCamera, FiPlay, FiCode, FiMoreHorizontal, FiTerminal } from 'react-icons/fi';
import { FaUnsplash } from 'react-icons/fa';
import { imageUpload, PostArticle } from '../services/BackendHandler';
import { useNavigate, useLocation } from 'react-router-dom';
import campusconnect_logo from "../assets/campusconnect_logo_whitebg.jpg";

// ── Converts raw textarea string → structured blocks array ──────────────────
const parseStoryToBlocks = (story, inlineImages = []) => {
    const blocks = [];
    const lines = story.split('\n');
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trim();

        if (!trimmed) { i++; continue; }

        // Heading: ## Some heading
        if (/^#{1,6}\s/.test(trimmed)) {
            const level = trimmed.match(/^(#{1,6})\s/)[1].length;
            const text = trimmed.replace(/^#{1,6}\s/, '').trim();
            blocks.push({ type: 'heading', data: { text, level } });
            i++;
            continue;
        }

        // Quote: > Some quote text
        if (/^>\s/.test(trimmed)) {
            const text = trimmed.replace(/^>\s/, '').trim();
            const author = '';
            blocks.push({ type: 'quote', data: { text, author } });
            i++;
            continue;
        }

        // Code block: ```lang\n...\n```
        if (trimmed.startsWith('```')) {
            const language = trimmed.slice(3).trim() || 'plaintext';
            const codeLines = [];
            i++;
            while (i < lines.length && !lines[i].trim().startsWith('```')) {
                codeLines.push(lines[i]);
                i++;
            }
            blocks.push({ type: 'code', data: { code: codeLines.join('\n'), language } });
            i++; // skip closing ```
            continue;
        }

        // Inline image placeholder: ![Image](url)
        const imgMatch = trimmed.match(/^!\[.*?\]\((.*?)\)$/);
        if (imgMatch) {
            blocks.push({ type: 'image', data: { url: imgMatch[1], caption: '', alt: 'image' } });
            i++;
            continue;
        }

        // Link block: [title](url) — standalone line
        const linkMatch = trimmed.match(/^\[(.+?)\]\((https?:\/\/.+?)\)$/);
        if (linkMatch) {
            blocks.push({ type: 'links', data: { url: linkMatch[2], title: linkMatch[1], description: '' } });
            i++;
            continue;
        }

        // Default: paragraph
        blocks.push({ type: 'paragraph', data: { text: trimmed } });
        i++;
    }

    return blocks;
};

// ── Converts blocks back to editable string (for edit mode) ─────────────────
const blocksToStory = (blocks = []) =>
    blocks.map(block => {
        switch (block.type) {
            case 'heading': return `${'#'.repeat(block.data?.level || 2)} ${block.data?.text || ''}`;
            case 'quote': return `> ${block.data?.text || ''}`;
            case 'code': return `\`\`\`${block.data?.language || ''}\n${block.data?.code || ''}\n\`\`\``;
            case 'image': return `![Image](${block.data?.url || ''})`;
            case 'links': return `[${block.data?.title || 'link'}](${block.data?.url || ''})`;
            case 'paragraph':
            default: return block.data?.text || '';
        }
    }).join('\n\n');

// ── Component ────────────────────────────────────────────────────────────────
const Write = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const editingArticle = location.state?.article || null;

    const [title, setTitle] = useState(() => editingArticle?.title || '');
    const [story, setStory] = useState(() =>
        editingArticle ? blocksToStory(editingArticle.content) : ''
    );
    const [showMenu, setShowMenu] = useState(false);
    const [showTitleMenu, setShowTitleMenu] = useState(false);
    const [focusedField, setFocusedField] = useState('story');
    const [uploadedImage, setUploadedImage] = useState(() => editingArticle?.coverImageUrl || null);
    const [published, setPublished] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const imageInputRef = useRef(null);
    const textareaRef = useRef(null);

    const canPublish = title.trim().length >= 5 && story.trim().length > 50;

    // ── Insert markdown syntax at cursor position ──────────────────────────
    const insertAtCursor = (before, after = '', placeholder = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const sel = story.slice(start, end) || placeholder;
        const newVal = story.slice(0, start) + before + sel + after + story.slice(end);

        setStory(newVal);
        setTimeout(() => {
            textarea.focus();
            const newCursor = start + before.length + sel.length;
            textarea.setSelectionRange(newCursor, newCursor);
        }, 0);
    };

    // ── Toolbar button handlers ────────────────────────────────────────────
    const handleInsertImage = () => imageInputRef.current?.click();

    const handleInsertCodeBlock = () => {
        const newStory = story + '\n\n```plaintext\n// your code here\n```\n';
        setStory(newStory);
        setShowMenu(false);
        setTimeout(() => textareaRef.current?.focus(), 0);
    };

    const handleInsertQuote = () => {
        insertAtCursor('\n> ', '', 'Your quote here');
        setShowMenu(false);
    };

    const handleInsertHeading = () => {
        insertAtCursor('\n## ', '', 'Heading');
        setShowMenu(false);
    };

    const handleInsertLink = () => {
        insertAtCursor('\n[', '](https://)', 'Link title');
        setShowMenu(false);
    };

    // ── Image upload ───────────────────────────────────────────────────────
    // Capture cursor position BEFORE the await
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // ← Capture position synchronously before anything async
        const textarea = textareaRef.current;
        const pos = textarea?.selectionStart ?? story.length;

        if (focusedField === 'title') {
            if (uploadedImage) { alert("Cover image already set."); return; }
            const url = await imageUpload({ data: { file } });
            if (!url) { alert("Image upload failed."); return; }
            setUploadedImage(url);
            return;
        } by

        const url = await imageUpload({ data: { file } });
        if (!url) { alert("Image upload failed."); return; }

        const placeholder = `\n![Image](${url})\n`;
        // ← Use captured pos, not current selectionStart
        setStory(prev => prev.slice(0, pos) + placeholder + prev.slice(pos));
        setShowMenu(false);
    };

    // ── Publish ────────────────────────────────────────────────────────────
    const handlePublishClick = async () => {
        if (!canPublish || isSubmitting) return;
        setIsSubmitting(true);

        const content = parseStoryToBlocks(story);

        const articleData = {
            title,
            content,                          // ← structured blocks array
            coverImageUrl: uploadedImage,
            status: 'published',
        };

        try {
            const response = await PostArticle({
                data: articleData,
                editingArticleId: editingArticle?._id || null,
            });
            if (response) {
                setPublished(true);
                navigate('/new-story');
            } else {
                alert("Failed to publish. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const { user } = useContext(AppContext);
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'G';
    const profileBgColor = user?.profileColor || '#6B7280';

    // ── Shared toolbar buttons ─────────────────────────────────────────────
    const ToolbarButtons = ({ forField }) => (
        <div className="flex items-center gap-2.5 ml-2 animate-fadeInLeft">
            <button onClick={handleInsertImage}
                className="w-9 h-9 border border-[#1a8917] rounded-full flex items-center justify-center text-[#1a8917] hover:bg-green-50 transition-all"
                title="Add image">
                <FiCamera size={18} />
                {forField === focusedField && (
                    <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                )}
            </button>
            <button onClick={handleInsertHeading}
                className="w-9 h-9 border border-[#1a8917] rounded-full flex items-center justify-center text-[#1a8917] hover:bg-green-50 transition-all font-bold text-sm"
                title="Add heading">H</button>
            <button onClick={handleInsertQuote}
                className="w-9 h-9 border border-[#1a8917] rounded-full flex items-center justify-center text-[#1a8917] hover:bg-green-50 transition-all text-lg font-bold"
                title="Add quote">"</button>
            <button onClick={handleInsertCodeBlock}
                className="w-9 h-9 border border-[#1a8917] rounded-full flex items-center justify-center text-[#1a8917] hover:bg-green-50 transition-all"
                title="Add code block">
                <FiTerminal size={18} />
            </button>
            <button onClick={handleInsertLink}
                className="w-9 h-9 border border-[#1a8917] rounded-full flex items-center justify-center text-[#1a8917] hover:bg-green-50 transition-all"
                title="Add link">
                <FiCode size={18} />
            </button>
            <button className="w-9 h-9 border border-[#1a8917] rounded-full flex items-center justify-center text-[#1a8917] hover:bg-green-50 transition-all"
                title="More">
                <FiMoreHorizontal size={20} />
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-white font-serif">

            {/* HEADER */}
            <nav className="flex justify-between h-16 items-center px-4 md:px-10 py-2 w-full bg-white z-50">
                <div className="flex items-center space-x-3">
                    <img src={campusconnect_logo} alt="Campus Connect Logo" className="logo h-60 w-auto -translate-y-23" />
                    <span className="text-sm text-gray-400 mt-1">
                        {published ? 'Published' : editingArticle ? 'Editing' : 'Draft'}
                    </span>
                </div>

                <div className="flex items-center space-x-4 md:space-x-6">
                    <button
                        onClick={handlePublishClick}
                        disabled={!canPublish || isSubmitting}
                        className={`${canPublish && !isSubmitting ? 'bg-green-600 hover:bg-green-700' : 'bg-green-300 cursor-not-allowed'} text-white px-3 py-1 rounded-full text-sm font-medium transition-all`}>
                        {isSubmitting ? 'Publishing...' : 'Publish'}
                    </button>

                    <div style={{ backgroundColor: profileBgColor }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer shadow-sm"
                        title={user?.userName || "Guest"}>
                        {userInitial}
                    </div>
                </div>
            </nav>

            {/* EDITOR */}
            <main className="pt-8 max-w-3xl mx-auto px-4">

                {/* Title */}
                <div className="relative group flex items-start mb-6">
                    {focusedField === 'title' && (
                        <div className="absolute -left-16 top-3 flex items-center gap-3">
                            <button onClick={() => setShowTitleMenu(!showTitleMenu)}
                                className={`w-10 h-10 border rounded-full flex items-center justify-center transition-all bg-white shadow-sm ${showTitleMenu ? 'border-gray-800 text-gray-800 rotate-45' : 'border-gray-500 text-gray-400 hover:text-black hover:border-black'}`}>
                                <span className="text-3xl font-light leading-none">+</span>
                            </button>
                            {showTitleMenu && <ToolbarButtons forField="title" />}
                        </div>
                    )}
                    <input
                        type="text"
                        placeholder="Title"
                        onFocus={() => { setFocusedField('title'); setShowMenu(false); }}
                        className="w-full text-5xl text-gray-800 placeholder-gray-400 outline-none border-none focus:ring-0 bg-transparent font-serif"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* Cover image preview */}
                {uploadedImage && (
                    <div className="relative mb-6">
                        <img src={uploadedImage} alt="Cover" className="max-w-full rounded-lg" />
                        <button
                            onClick={() => setUploadedImage(null)}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg transition-all"
                            aria-label="Remove cover image">
                            ×
                        </button>
                    </div>
                )}

                {/* Story textarea */}
                <div className="relative group flex items-start">
                    {focusedField === 'story' && (
                        <div className="absolute -left-16 top-1 flex items-center gap-3">
                            <button onClick={() => setShowMenu(!showMenu)}
                                className={`w-10 h-10 border rounded-full flex items-center justify-center transition-all bg-white shadow-sm ${showMenu ? 'border-gray-800 text-gray-800 rotate-45' : 'border-gray-500 text-gray-400 hover:text-black hover:border-black'}`}>
                                <span className="text-3xl font-light leading-none">+</span>
                            </button>
                            {showMenu && <ToolbarButtons forField="story" />}
                        </div>
                    )}
                    <textarea
                        ref={textareaRef}
                        onFocus={() => { setFocusedField('story'); setShowTitleMenu(false); }}
                        placeholder={showMenu ? '' : 'Tell your story...\n\nTip: Use ## for headings, > for quotes, ``` for code blocks'}
                        className="w-full text-xl text-gray-700 placeholder-gray-400 outline-none border-none focus:ring-0 min-h-[500px] resize-none leading-relaxed bg-transparent"
                        value={story}
                        onChange={(e) => setStory(e.target.value)}
                    />
                </div>
            </main>

            {/* FOOTER */}
            <footer className="fixed bottom-10 w-full flex justify-center pointer-events-none">
                <div className="flex items-center space-x-6 bg-white border border-gray-200 px-8 py-3 rounded-xl shadow-sm pointer-events-auto">
                    <span className="text-[15px] text-gray-500">
                        Use <code className="bg-gray-100 px-1 rounded">## Heading</code> &nbsp;·&nbsp;
                        <code className="bg-gray-100 px-1 rounded">{"> Quote"}</code> &nbsp;·&nbsp;
                        <code className="bg-gray-100 px-1 rounded">{"```lang"}</code> for code &nbsp;·&nbsp;
                        <code className="bg-gray-100 px-1 rounded">[title](url)</code> for links
                    </span>
                </div>
            </footer>
        </div>
    );
};

export default Write;