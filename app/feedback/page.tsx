import Link from "next/link";
import { getFeedback } from "../actions";

// Force dynamic so we always see new data
export const dynamic = 'force-dynamic';

export default async function FeedbackPage() {
  const feedbacks = await getFeedback();

  return (
    <main style={{ minHeight: '100vh', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--sandy-brown)' }}>
          Feature Requests & Bugs
        </h1>
        <p style={{ color: 'gray', marginTop: '10px' }}>
          Things we need to fix or build next.
        </p>
        <Link 
          href="/" 
          style={{ 
            display: 'inline-block', 
            marginTop: '1rem', 
            textDecoration: 'underline', 
            color: 'var(--sky-blue)',
            fontWeight: 'bold' 
          }}
        >
          ← Back Home
        </Link>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {feedbacks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#f9fafb', borderRadius: '20px' }}>
                <p style={{ color: 'gray' }}>No feedback yet. Be the first!</p>
            </div>
        ) : (
            feedbacks.map((f) => (
                <div key={f.id} style={{ 
                    backgroundColor: 'white', 
                    padding: '1.5rem', 
                    borderRadius: '15px', 
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    border: '1px solid #e5e7eb'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#171717' }}>
                            {f.subject}
                        </h3>
                        <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                            {new Date(f.submittedAt).toLocaleDateString()}
                        </span>
                    </div>
                    
                    <p style={{ color: '#4b5563', lineHeight: '1.5', marginBottom: '1rem' }}>
                        {f.message}
                    </p>
                    
                    <div style={{ fontSize: '0.9rem', borderTop: '1px solid #f3f4f6', paddingTop: '10px', display: 'flex', gap: '10px' }}>
                        <span style={{ fontWeight: 'bold' }}>{f.name}</span>
                        <span style={{ color: 'var(--sky-blue)' }}>• {f.role}</span>
                    </div>
                </div>
            ))
        )}
      </div>
    </main>
  );
}