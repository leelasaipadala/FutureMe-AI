"use client";

import { useState } from "react";
import { Plus, Search, FileText, Sparkles, Folder } from "lucide-react";

export default function NotesPage() {
  const [activeNote, setActiveNote] = useState(0);

  const [notes, setNotes] = useState([
    {
      title: "React Concepts Review",
      date: "Oct 18",
      category: "Education",
      content: "Hooks to review deeply: useEffect, useMemo, useCallback. Remember that useCallback is for referential equality of functions passed to children components.",
    },
    {
      title: "Budget Planning 2027",
      date: "Oct 15",
      category: "Finance",
      content: "Need to cut down on eating out to hit the ₹10,00,000 emergency fund. Goal: Cook at home 5 nights a week. Transfer ₹50,000 directly on payday.",
    },
    {
      title: "Book Notes: Atomic Habits",
      date: "Oct 10",
      category: "Personal",
      content: "Make it obvious, attractive, easy, and satisfying. If I want to read more, put the book on the pillow every morning.",
    }
  ]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedNotes = [...notes];
    updatedNotes[activeNote] = { ...updatedNotes[activeNote], title: e.target.value };
    setNotes(updatedNotes);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedNotes = [...notes];
    updatedNotes[activeNote] = { ...updatedNotes[activeNote], content: e.target.value };
    setNotes(updatedNotes);
  };

  const handleAddNote = () => {
    const newNote = {
      title: "New Note",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      category: "Personal",
      content: "",
    };
    setNotes([newNote, ...notes]);
    setActiveNote(0);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-fade-up max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Notes & Journal</h1>
        <p className="text-sm text-muted-foreground mt-1">Document your thoughts and track your learning.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Sidebar: Note List */}
        <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-4 min-h-0">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="search" 
                placeholder="Search notes..." 
                className="w-full h-11 pl-9 pr-4 bg-white border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-sm"
              />
            </div>
            <button onClick={handleAddNote} className="w-11 h-11 shrink-0 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-sm flex items-center justify-center transition-colors">
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {notes.map((note, i) => (
              <div 
                key={i} 
                className={`cursor-pointer transition-all p-4 rounded-2xl border ${
                  activeNote === i 
                    ? 'bg-primary/5 border-primary/30 shadow-sm' 
                    : 'bg-white border-border hover:border-primary/20 hover:shadow-sm'
                }`}
                onClick={() => setActiveNote(i)}
              >
                <h4 className="font-bold text-sm truncate text-foreground">{note.title}</h4>
                <div className="flex justify-between items-center mt-2.5">
                  <span className="text-xs text-muted-foreground font-semibold">{note.date}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded-md">
                    {note.category}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-emerald-50 border border-primary/20 rounded-2xl p-4 shadow-sm shrink-0">
            <div className="flex items-center gap-1.5 text-primary font-bold text-sm mb-2">
              <Sparkles className="w-4 h-4" /> AI Summary
            </div>
            <p className="text-xs text-primary/80 leading-relaxed font-medium">
              You frequently take notes on React and Finance. The AI suggests linking your budget notes to your Emergency Fund goal directly.
            </p>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="md:col-span-7 lg:col-span-8 bg-white rounded-3xl border border-border shadow-sm flex flex-col min-h-0 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-emerald-400" />
          
          <div className="p-6 md:p-8 border-b border-border shrink-0">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-muted px-2.5 py-1 rounded-md border border-border">
                <Folder className="w-3.5 h-3.5" />
                {notes[activeNote].category}
              </div>
              <span className="text-sm font-semibold text-muted-foreground">{notes[activeNote].date}</span>
            </div>
            <input 
              value={notes[activeNote].title} 
              onChange={handleTitleChange}
              className="w-full text-2xl md:text-3xl font-extrabold bg-transparent outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-b focus:border-primary/30 pb-1" 
              placeholder="Note Title..."
            />
          </div>
          
          <div className="flex-1 overflow-hidden flex flex-col p-6 md:p-8">
            <textarea 
              value={notes[activeNote].content} 
              onChange={handleContentChange}
              className="flex-1 w-full h-full bg-transparent outline-none resize-none text-base leading-relaxed text-muted-foreground placeholder:text-muted-foreground/30 custom-scrollbar" 
              placeholder="Start writing..."
            />
          </div>
        </div>

      </div>
    </div>
  );
}
