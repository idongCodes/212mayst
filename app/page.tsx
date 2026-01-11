/**
 * file: app/page.tsx
 * description: Fixed Date/Button overlap by adding padding to the header.
 */

"use client"; 

import React, { useState, useEffect, useRef } from "react"; 
import Link from "next/link";
import { MessageCircle, Calendar, ClipboardList, User, Send, Bug, Lightbulb, Lock, Star, Trash2, Pencil, Check, X } from "lucide-react";
import { getPraises, addPraise, addFeedback, deletePraise, editPraise, Praise } from "./actions";
import gitData from "./git-updates.json";

function FadeInSection({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) setIsVisible(true); }); });
    const currentElement = domRef.current;
    if (currentElement) observer.observe(currentElement);
    return () => { if (currentElement) observer.unobserve(currentElement); };
  }, []);
  return <div ref={domRef} className={`fade-in-section ${isVisible ? 'is-visible' : ''}`} style={{ width: '100%' }}>{children}</div>;
}

export default function Home() {
  const [praises, setPraises] = useState<Praise[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null); 
  const [isAdmin, setIsAdmin] = useState(false); 

  const [praiseForm, setPraiseForm] = useState({ name: "", role: "Tenant", subject: "", message: "" });
  const [feedbackForm, setFeedbackForm] = useState({ name: "", role: "Tenant", subject: "", message: "" });
  const [feedbackStatus, setFeedbackStatus] = useState("idle"); 

  // --- ADMIN STATE ---
  const [userPhone, setUserPhone] = useState(""); 
  const [editingPraiseId, setEditingPraiseId] = useState<number | null>(null);
  const [editPraiseData, setEditPraiseData] = useState({ subject: "", message: "" });

  // 1. Add state for the summary
const [aiUpdates, setAiUpdates] = useState<string[]>([]);
const [loadingUpdates, setLoadingUpdates] = useState(true);

// 2. Add this useEffect to fetch the AI summary
useEffect(() => {
  const fetchAiUpdates = async () => {
    try {
      // 2. Use the imported data directly
      const rawUpdates = gitData.commits; 

      const res = await fetch('/api/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawUpdates }),
      });

      const data = await res.json();
      if (data.summary) {
        setAiUpdates(data.summary);
      }
    } catch (e) {
      console.error("Failed to fetch AI updates", e);
    } finally {
      setLoadingUpdates(false);
    }
  };

  fetchAiUpdates();
}, []);

  useEffect(() => {
    const loadData = async () => {
      const data = await getPraises();
      setPraises(data);
      setLoading(false);

      const storedUser = sessionStorage.getItem('212user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setUserPhone(parsedUser.phone); // Capture Phone
        
        // Admin Check
        if (parsedUser.isAdmin || parsedUser.alias === 'idongcodes') setIsAdmin(true);
        
        setPraiseForm(prev => ({ ...prev, name: parsedUser.firstName, role: parsedUser.role }));
        setFeedbackForm(prev => ({ ...prev, name: parsedUser.firstName, role: parsedUser.role }));
      }
    };
    loadData();
  }, []);

  const handlePraiseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPraiseForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFeedbackForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePraiseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!praiseForm.name || !praiseForm.message) return;
    const newPraise = { id: Date.now(), ...praiseForm, submittedAt: new Date().toISOString() };
    setPraises([newPraise, ...praises]); 
    setPraiseForm({ name: user?.firstName || "", role: user?.role || "Tenant", subject: "", message: "" });
    await addPraise(newPraise);
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackForm.name || !feedbackForm.message) return;
    setFeedbackStatus("submitting");
    const newFeedback = { id: Date.now(), ...feedbackForm, submittedAt: new Date().toISOString() };
    await addFeedback(newFeedback);
    setFeedbackForm({ name: user?.firstName || "", role: user?.role || "Tenant", subject: "", message: "" });
    setFeedbackStatus("success");
    setTimeout(() => setFeedbackStatus("idle"), 3000);
  };

  // --- ADMIN HANDLERS ---
  const handleDeletePraise = async (id: number) => {
    if (!confirm("Admin: Delete this testimonial?")) return;
    setPraises(praises.filter(p => p.id !== id));
    await deletePraise(id, userPhone);
  };

  const startEditing = (p: Praise) => {
    setEditingPraiseId(p.id);
    setEditPraiseData({ subject: p.subject, message: p.message });
  };

  const cancelEditing = () => {
    setEditingPraiseId(null);
    setEditPraiseData({ subject: "", message: "" });
  };

  const saveEdit = async (id: number) => {
    if (!editPraiseData.message.trim()) return;
    setPraises(praises.map(p => p.id === id ? { ...p, ...editPraiseData } : p));
    setEditingPraiseId(null);
    await editPraise(id, editPraiseData.subject, editPraiseData.message, userPhone);
  };

  // HELPER: Date Formatter
  const formatDate = (isoString?: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ', ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* HERO & FEATURES (Unchanged) */}
      <FadeInSection>
        <section style={{ position: 'relative', height: '70vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', overflow: 'hidden', padding: '0 2rem' }}>
          <div className="animate-fade-in" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
            <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}><source src="/heroVid.mov" /></video>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle, rgba(0,0,0,0) 25%, var(--sky-blue) 100%)', opacity: 0.8 }} /> 
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(to top, var(--sky-blue) 15%, transparent 100%)' }} />
          </div>
          <div className="animate-slide-in" style={{ position: 'relative', zIndex: 10, maxWidth: '600px', textAlign: 'left' }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem', textShadow: '0 5px 5px rgba(0,0,0,0.5)' }}>212 May Street</h1>
            <p style={{ fontSize: '1.25rem', fontWeight: '500', color: 'white', marginBottom: '2rem', textShadow: '0 3px 3px rgba(0,0,0,0.5)' }}>Welcome to 212 May Street's...companion web app? Like Home Sweet Home... but from your phone or computer, ha!</p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <Link href="/login" className="hero-btn btn-login">Login</Link>
              <Link href="/join" className="hero-btn btn-join">Join 212 May St</Link>
            </div>
          </div>
        </section>
      </FadeInSection>

      <FadeInSection>
        <section style={{ backgroundColor: 'var(--sky-blue)', padding: '4rem 2rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '2rem', flex: '1 1 300px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div style={{ color: 'var(--sandy-brown)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}><MessageCircle size={48} /></div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#171717' }}>House Chat</h3>
              <p style={{ color: 'gray' }}>Stay connected with everyone. Coordinate plans, share updates, or just say hi.</p>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '2rem', flex: '1 1 300px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div style={{ color: 'var(--sandy-brown)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}><Calendar size={48} /></div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#171717' }}>Events & Plans</h3>
              <p style={{ color: 'gray' }}>Never miss a house dinner or movie night. check the calendar and join in.</p>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '2rem', flex: '1 1 300px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div style={{ color: 'var(--sandy-brown)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}><ClipboardList size={48} /></div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#171717' }}>Tasks & Chores</h3>
              <p style={{ color: 'gray' }}>Keep the house running smoothly. See what needs doing and lend a hand.</p>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* PRAISE SECTION */}
      <FadeInSection>
        <section style={{ backgroundColor: '#f9fafb', padding: '4rem 1.5rem' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            
            {(praises.length > 0 || loading) && (
              <div style={{ marginBottom: '4rem', background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', padding: '2rem', borderRadius: '20px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                <h2 style={{ textAlign: 'center', color: 'var(--sandy-brown)', fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>House Love <span style={{fontSize: '1.5rem'}}>🫶</span></h2>
                {loading ? <p style={{ textAlign: 'center', color: '#0369a1' }}>Loading love...</p> : (
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {praises.map((p) => (
                      <div key={p.id} style={{ position: 'relative', backgroundColor: 'rgba(255, 255, 255, 0.35)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.6)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)', padding: '1.5rem', borderRadius: '15px' }}>
                        
                        {/* --- ADMIN BUTTONS --- */}
                        {isAdmin && !editingPraiseId && (
                          <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '8px', zIndex: 10 }}>
                            <button onClick={() => startEditing(p)} style={{ background: 'white', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} title="Edit">
                              <Pencil size={16} color="#94a3b8" />
                            </button>
                            <button onClick={() => handleDeletePraise(p.id)} style={{ background: 'white', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} title="Delete">
                              <Trash2 size={16} color="#ef4444" />
                            </button>
                          </div>
                        )}

                        {/* --- CONTENT LOGIC --- */}
                        {editingPraiseId === p.id ? (
                          // EDIT MODE
                          <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input 
                              value={editPraiseData.subject} 
                              onChange={(e) => setEditPraiseData({...editPraiseData, subject: e.target.value})}
                              style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 'bold' }} 
                            />
                            <textarea 
                              value={editPraiseData.message} 
                              onChange={(e) => setEditPraiseData({...editPraiseData, message: e.target.value})}
                              rows={3}
                              style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontFamily: 'inherit' }} 
                            />
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                              <button onClick={() => saveEdit(p.id)} style={{ background: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}><Check size={14}/> Save</button>
                              <button onClick={cancelEditing} style={{ background: '#94a3b8', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}><X size={14}/> Cancel</button>
                            </div>
                          </div>
                        ) : (
                          // VIEW MODE (With Fix for Overlap)
                          <>
                            <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingRight: isAdmin ? '70px' : '0' }}>
                              <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#171717', margin: 0 }}>{p.subject}</h4>
                              
                              {p.submittedAt && (
                                <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '10px', whiteSpace: 'nowrap' }}>
                                  {formatDate(p.submittedAt)}
                                </span>
                              )}
                            </div>

                            <p style={{ color: '#374151', marginBottom: '1.5rem', fontStyle: 'italic', lineHeight: '1.5', fontWeight: '500' }}>"{p.message}"</p>
                          </>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20} color="#6b7280" /></div>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '1rem', color: '#171717' }}>{user ? p.name : "Housemate"}</span>
                            <span style={{ fontSize: '0.85rem', color: '#0369a1', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{p.role}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Praise Form (Unchanged) */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
              <h3 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#171717' }}>Leave some Praise</h3>
              
              {!user ? (
                <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0', color: '#94a3b8' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}><Lock size={32} color="#cbd5e1" /></div>
                  <p style={{ fontSize: '1rem' }}>You must be <Link href="/login" style={{ color: 'var(--sky-blue)', fontWeight: 'bold', textDecoration: 'underline' }}>logged in</Link> to leave praise.</p>
                </div>
              ) : (
                <form onSubmit={handlePraiseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: '1 1 200px' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#4b5563' }}>First Name</label>
                      <input type="text" name="name" value={praiseForm.name} onChange={handlePraiseChange} placeholder="Jane" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: '1 1 200px' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#4b5563' }}>Role</label>
                      <select name="role" value={praiseForm.role} onChange={handlePraiseChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', backgroundColor: 'white' }}>
                        <option value="Tenant">Tenant</option>
                        <option value="Owner">Owner</option>
                        <option value="First Lady">First Lady</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#4b5563' }}>Subject</label>
                    <input type="text" name="subject" value={praiseForm.subject} onChange={handlePraiseChange} placeholder="Just saying hi!" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#4b5563' }}>Message</label>
                    <textarea name="message" value={praiseForm.message} onChange={handlePraiseChange} placeholder="Share your thoughts..." required rows={4} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', fontFamily: 'inherit' }} />
                  </div>
                  <button type="submit" style={{ marginTop: '10px', backgroundColor: 'var(--sandy-brown)', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'opacity 0.2s', width: '100%' }}>Send Praise <Send size={18} /></button>
                </form>
              )}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* FEEDBACK SECTION */}
      <FadeInSection>
        <section style={{ backgroundColor: '#1e293b', padding: '4rem 1.5rem', color: 'white' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '1rem' }}>
              <Bug size={32} color="var(--sandy-brown)" />
              <Lightbulb size={32} color="var(--sky-blue)" />
            </div>

            <h3 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Help us improve</h3>
            <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '2rem' }}>
              Have a feature request, found a bug, or just want to chat? We are listening.
              <br/>
              <Link href="/feedback" style={{ color: 'var(--sky-blue)', textDecoration: 'underline', marginTop: '10px', display: 'inline-block' }}>View submitted feedback</Link>
            </p>

            {!user ? (
              <div style={{ backgroundColor: '#334155', padding: '3rem', borderRadius: '20px', textAlign: 'center', border: '1px dashed #475569', color: '#94a3b8' }}>
                 <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}><Lock size={32} color="#64748b" /></div>
                 <p style={{ fontSize: '1rem' }}>Please <Link href="/login" style={{ color: 'var(--sky-blue)', fontWeight: 'bold', textDecoration: 'underline' }}>log in</Link> to submit feedback.</p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#334155', padding: '2rem', borderRadius: '20px', border: '1px solid #475569' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#cbd5e1' }}>First Name</label>
                    <input type="text" name="name" value={feedbackForm.name} onChange={handleFeedbackChange} placeholder="John" required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#1e293b', color: 'white', fontSize: '1rem' }} />
                  </div>
                  <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#cbd5e1' }}>Role</label>
                    <select name="role" value={feedbackForm.role} onChange={handleFeedbackChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#1e293b', color: 'white', fontSize: '1rem' }}>
                      <option value="Tenant">Tenant</option>
                      <option value="Landlord">Landlord</option>
                      <option value="First Lady">First Lady</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#cbd5e1' }}>Subject</label>
                  <input type="text" name="subject" value={feedbackForm.subject} onChange={handleFeedbackChange} placeholder="Feature Request: Dark Mode" required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#1e293b', color: 'white', fontSize: '1rem' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#cbd5e1' }}>Message</label>
                  <textarea name="message" value={feedbackForm.message} onChange={handleFeedbackChange} placeholder="Tell us what's on your mind..." required rows={4} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#1e293b', color: 'white', fontSize: '1rem', fontFamily: 'inherit' }} />
                </div>
                <button type="submit" disabled={feedbackStatus === "submitting" || feedbackStatus === "success"} style={{ backgroundColor: feedbackStatus === "success" ? 'var(--light-green)' : 'var(--sky-blue)', color: feedbackStatus === "success" ? '#171717' : 'white', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', opacity: feedbackStatus === "submitting" ? 0.7 : 1 }}>
                  {feedbackStatus === "submitting" ? "Sending..." : feedbackStatus === "success" ? "Received! Thanks." : "Submit Feedback"}
                </button>
              </form>
            )}
          </div>
        </section>
      </FadeInSection>
      
      <FadeInSection>
  <section style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
        <h2 style={{ color: 'var(--sandy-brown)', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>What's New?</h2>
        <span style={{ fontSize: '0.75rem', backgroundColor: '#e0f2fe', color: '#0284c7', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
          AI Generated ✨
        </span>
      </div>
      
      {loadingUpdates ? (
        <p style={{ color: 'gray', fontStyle: 'italic' }}>Asking Gemini what changed...</p>
      ) : (
        <ul style={{ paddingLeft: '1.2rem', color: 'gray', lineHeight: '1.8' }}>
          {aiUpdates.map((update, index) => (
            <li key={index} style={{ marginBottom: '5px' }}>{update}</li>
          ))}
        </ul>
      )}
      
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '1.5rem' }}>
        Check the <span style={{ color: 'var(--sky-blue)', fontWeight: 'bold' }}>Common Room</span> to see who's around, or visit <span style={{ color: 'var(--sky-blue)', fontWeight: 'bold' }}>Mates</span> to see what everyone is up to.
      </p>
    </div>
  </section>
</FadeInSection>

    </main>
  );
}