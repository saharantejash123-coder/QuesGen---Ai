import React, { useState } from 'react';
import { Brain, FileText, Download, CheckCircle, Clock, Sparkles, AlertTriangle, Printer, TrendingUp, RefreshCw, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { generatePaperAsync } from '../../data/oracleData';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

// Languages for subjects (excluding Hindi, Sanskrit, English which are language subjects themselves)
const SUBJECT_LANGUAGES = {
  'Science': ['English', 'Hindi'],
  'Mathematics': ['English', 'Hindi'],
  'Social Science': ['English', 'Hindi'],
  'Physics': ['English', 'Hindi'],
  'Chemistry': ['English', 'Hindi'],
  'Biology': ['English', 'Hindi'],
};

// Subjects that should NOT be translated (language subjects)
const EXCLUDED_TRANSLATION_SUBJECTS = ['Hindi', 'English', 'Sanskrit'];

export default function OracleEnginePage({ setPage }) {
  const { dark } = useTheme();
  const { t } = useLanguage();
  const [board, setBoard] = useState('CBSE');
  const [cls, setCls] = useState('Class 10');
  const [subject, setSubject] = useState('Science');
  const [language, setLanguage] = useState('English');
  const [examType, setExamType] = useState('Annual Exam');
  const [apiError, setApiError] = useState('');
  
  const [step, setStep] = useState(1); // 1 = Config, 2 = Loading, 3 = Output
  const [paper, setPaper] = useState(null);
  
  // Update language when subject changes
  const handleSubjectChange = (newSubject) => {
    setSubject(newSubject);
    // Reset to first available language for the subject
    if (SUBJECT_LANGUAGES[newSubject]) {
      setLanguage(SUBJECT_LANGUAGES[newSubject][0]);
    } else {
      setLanguage('English');
    }
  };

  const handleGenerate = async () => {
    setStep(2);
    setApiError('');
    try {
      const subjectLabel = `${subject}${language !== 'English' ? ` (${language})` : ''}`;
      const generated = await generatePaperAsync(board, cls, subjectLabel);
      setPaper(generated);
      setStep(3);
    } catch (err) {
      setApiError(err.message);
      setStep(1);
    }
  };

  const buildPaperHTML = () => {
    const timeStr = `${Math.floor(paper.metadata.timeMinutes / 60)} Hours${paper.metadata.timeMinutes % 60 > 0 ? ` ${paper.metadata.timeMinutes % 60} Minutes` : ''}`;
    const subjectLine = `${subject}${language !== 'English' ? ` (${language} Medium)` : ''}`;

    const sectionsHTML = paper.sections.map((sec) => {
      const questionsHTML = sec.questions.map((q, qIdx) => {
        const optionsHTML = Array.isArray(q.options) && q.options.length > 0
          ? `<div class="options">${q.options.map((opt, i) =>
              `<span>(${String.fromCharCode(97 + i)}) ${typeof opt === 'string' ? opt.replace(/^\s*[\(\[]?[a-dA-D][\)\].]\s*/i, '') : opt}</span>`
            ).join('')}</div>`
          : '';
        return `
          <div class="question">
            <span class="q-num">Q${qIdx + 1}.</span>
            <div class="q-body">
              <div class="q-header"><span class="q-text">${q.text}</span><span class="marks">[${sec.marksPerQuestion}]</span></div>
              ${optionsHTML}
            </div>
          </div>`;
      }).join('');
      return `<div class="section"><div class="sec-title">${sec.name}</div>${questionsHTML}</div>`;
    }).join('');

    const instrHTML = paper.sections.map(s =>
      `<li>${s.name} consists of ${s.count} questions of ${s.marksPerQuestion} mark${s.marksPerQuestion > 1 ? 's' : ''} each.</li>`
    ).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${board} ${cls} ${subjectLine} — Exam Paper</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Times New Roman',serif;background:#fff;color:#000;padding:36px;max-width:860px;margin:0 auto;font-size:14px;line-height:1.65}
  .doc-header{text-align:center;border-bottom:2.5px solid #000;padding-bottom:16px;margin-bottom:22px}
  .doc-header h1{font-size:20px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px}
  .doc-header h2{font-size:17px;font-weight:bold;margin-bottom:4px}
  .doc-header h3{font-size:13px;font-style:italic;color:#444}
  .meta{display:flex;justify-content:space-between;margin-top:14px;font-weight:bold;font-size:13px}
  .instructions{margin-bottom:22px}
  .instructions h4{font-weight:bold;margin-bottom:8px}
  .instructions ol{padding-left:22px}
  .section{margin-bottom:26px;page-break-inside:avoid}
  .sec-title{text-align:center;font-weight:bold;font-size:15px;margin-bottom:14px;border-bottom:1px solid #ccc;padding-bottom:6px}
  .question{display:flex;gap:10px;margin-bottom:16px;page-break-inside:avoid}
  .q-num{font-weight:bold;min-width:30px;flex-shrink:0}
  .q-body{flex:1}
  .q-header{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:8px}
  .q-text{flex:1}
  .marks{font-weight:bold;white-space:nowrap}
  .options{display:grid;grid-template-columns:1fr 1fr;gap:5px 16px;margin-left:8px;margin-top:4px}
  .footer{text-align:center;margin-top:40px;font-style:italic;border-top:1px solid #ccc;padding-top:14px;color:#555}
  @page{margin:18mm 20mm}
  @media print{body{padding:0}@page{margin:15mm 18mm}}
</style>
</head>
<body>
<div class="doc-header">
  <h1>${board} BOARD EXAMINATION — 2025</h1>
  <h2>${cls} — ${subjectLine}</h2>
  <h3>${examType} (Mock Paper)</h3>
  <div class="meta">
    <span>Time Allowed: ${timeStr}</span>
    <span>Maximum Marks: ${paper.metadata.totalMarks}</span>
  </div>
</div>
<div class="instructions">
  <h4>General Instructions:</h4>
  <ol>
    <li>This question paper comprises ${paper.sections.length} sections.</li>
    <li>All questions are compulsory. Internal choices have been provided in some questions.</li>
    ${instrHTML}
  </ol>
</div>
${sectionsHTML}
<div class="footer">*** END OF PAPER *** — Generated by QuesGen AI</div>
</body>
</html>`;
  };

  const handlePrint = () => {
    const win = window.open('', '_blank', 'width=900,height=700,scrollbars=yes');
    win.document.write(buildPaperHTML());
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  const handleDownload = () => {
    const html = buildPaperHTML();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${board}_${cls}_${subject.replace(/\s+/g, '_')}_ExamPaper.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fade-in" style={{ minHeight: 'calc(100vh - 56px)', padding: '5rem 1rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header (hidden on print) */}
      <div className="hide-on-print" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, rgba(35,84,244,0.1), rgba(124,58,237,0.1))', marginBottom: '1rem' }}>
          <Trophy style={{ width: 32, height: 32, color: '#2354F4' }} />
        </div>
        <h1 className="st">{t('oracle.title')}</h1>
        <p className="ss" style={{ margin: '0.5rem auto' }}>{t('oracle.subtitle')}</p>
      </div>

      {step === 1 && (
        <div className="g2 hide-on-print" style={{ alignItems: 'flex-start' }}>
          {/* Config Panel */}
          <div className="card p-6" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText style={{ width: 20, height: 20, color: '#2354F4' }} />
              {t('oracle.title')}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>{t('oracle.selectBoard')}</label>
                <select value={board} onChange={(e) => setBoard(e.target.value)}>
                  <option value="CBSE">CBSE</option>
                  <option value="RBSE">RBSE</option>
                  <option value="ICSE">ICSE</option>
                </select>
              </div>

              <div className="r2" style={{ gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>{t('oracle.selectClass')}</label>
                  <select value={cls} onChange={(e) => setCls(e.target.value)}>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>{t('oracle.selectSubject')}</label>
                  <select value={subject} onChange={(e) => handleSubjectChange(e.target.value)}>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="English">English</option>
                    <option value="Social Science">Social Science</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Accountancy">Accountancy</option>
                    <option value="Business Studies">Business Studies</option>
                    <option value="Economics">Economics</option>
                  </select>
                </div>
              </div>

              {SUBJECT_LANGUAGES[subject] && SUBJECT_LANGUAGES[subject].length > 0 && (
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>{t('oracle.selectLanguage')}</label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    {SUBJECT_LANGUAGES[subject].map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>{t('oracle.examType')}</label>
                <select value={examType} onChange={(e) => setExamType(e.target.value)}>
                  <option value="Annual Exam">{t('oracle.examTypeAnnual')}</option>
                  <option value="Half Yearly">{t('oracle.examTypeHalfYearly')}</option>
                  <option value="Pre-Board">{t('oracle.examTypePreBoard')}</option>
                </select>
              </div>

              {apiError && (
                <div style={{ padding: '0.8rem', borderRadius: 8, background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontSize: '0.85rem' }}>
                  <strong>Error:</strong> {apiError}
                </div>
              )}

              <button onClick={handleGenerate} className="btn-primary" style={{ justifyContent: 'center', marginTop: '0.5rem', padding: '1rem' }}>
                <Sparkles style={{ width: 18, height: 18 }} />
                {t('oracle.generatePaper')}
              </button>
            </div>
          </div>

          {/* Analysis Info */}
          <div className="card p-6" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>{t('oracle.engineReady')}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text2)', marginBottom: '1.5rem' }}>
              {t('oracle.engineReadyDesc')} <strong>{board} {cls} {subject}{language !== 'English' ? ` (${language})` : ''}</strong>.
              {' '}{t('oracle.analysisIntro')}
            </p>

            <div style={{ background: 'var(--bg3)', borderRadius: 12, padding: '1.5rem', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <TrendingUp style={{ color: '#10B981' }} />
                <span style={{ fontWeight: 600 }}>{t('oracle.activePredVectors')}</span>
              </div>
              <ul style={{ fontSize: '0.85rem', color: 'var(--text2)', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '1.5rem' }}>
                <li>{t('oracle.freqAnalysis')}</li>
                <li>{t('oracle.blueprintCompliance')}</li>
                <li>{t('oracle.difficultyBalance')}</li>
                <li>{t('oracle.aiConfidenceTag')}</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="hide-on-print" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0' }}>
          <div style={{ position: 'relative', width: 80, height: 80, marginBottom: '2rem' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid rgba(35,84,244,0.2)' }}></div>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid #2354F4', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }}></div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles style={{ width: 32, height: 32, color: '#2354F4', animation: 'pulse 2s infinite' }} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>{t('oracle.generatingTitle')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', maxWidth: 300 }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text3)' }}>
               <span>{t('oracle.scanningPYQ')}</span>
               <span style={{ color: '#10B981', fontWeight: 700 }}>{t('oracle.done')}</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text3)' }}>
               <span>{t('oracle.applyingBlueprint')}</span>
               <span style={{ color: '#10B981', fontWeight: 700 }}>{t('oracle.done')}</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text3)' }}>
               <span>{t('oracle.calculatingConfidence')}</span>
               <span style={{ color: '#2354F4', fontWeight: 700 }}>{t('oracle.processing')}</span>
             </div>
          </div>
        </div>
      )}

      {step === 3 && paper && (
        <div className="fade-in">
          {/* Action Bar */}
          <div className="hide-on-print oracle-action-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1rem', background: 'var(--card-bg)', borderRadius: 12, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: 8, background: 'rgba(35,84,244,0.1)' }}>
                <CheckCircle style={{ width: 24, height: 24, color: '#2354F4' }} />
              </div>
              <div>
                <h3 style={{ fontWeight: 700 }}>{t('oracle.paperGenerated')}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>
                  {t('oracle.paperGeneratedDesc')
                    .replace('{board}', board)
                    .replace('{class}', cls)
                    .replace('{subject}', subject)
                    .replace('{language}', language !== 'English' ? ` (${language})` : '')}
                </p>
              </div>
            </div>
            <div className="oracle-action-btns" style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setStep(1)} className="btn-secondary">
                <RefreshCw style={{ width: 16, height: 16 }} />
                {t('oracle.regenerate')}
              </button>
              <button onClick={handleDownload} className="btn-secondary" style={{ background: 'var(--bg3)', color: 'var(--text)' }}>
                <Download style={{ width: 16, height: 16 }} />
                Download
              </button>
              <button onClick={handlePrint} className="btn-primary">
                <Printer style={{ width: 16, height: 16 }} />
                {t('oracle.print')}
              </button>
            </div>
          </div>

          {/* Paper Document */}
          <div className="print-doc" style={{ background: '#fff', color: '#000', padding: '40px', borderRadius: 16, boxShadow: dark ? 'none' : '0 10px 40px rgba(0,0,0,0.08)', border: dark ? '1px solid var(--border)' : 'none', minHeight: '1000px', fontFamily: 'serif' }}>
            
            {/* Paper Header */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '20px', marginBottom: '30px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>{board} BOARD EXAMINATION - 2025</h1>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '5px' }}>{cls} - {subject}{language !== 'English' ? ` (${language} Medium)` : ''}</h2>
              <h3 style={{ fontSize: '16px', fontStyle: 'italic', color: '#444' }}>{examType} (Mock Paper)</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontWeight: 'bold', fontSize: '14px' }}>
                <span>{t('oracle.timeAllowed')}: {Math.floor(paper.metadata.timeMinutes/60)} {t('oracle.hours')} {paper.metadata.timeMinutes%60 > 0 ? `${paper.metadata.timeMinutes%60} ${t('oracle.minutes')}` : ''}</span>
                <span>{t('oracle.maxMarks')}: {paper.metadata.totalMarks}</span>
              </div>
            </div>

            {/* General Instructions */}
            <div style={{ marginBottom: '30px', fontSize: '14px', lineHeight: 1.6 }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '10px' }}>{t('oracle.generalInstructions')}:</h4>
              <ol style={{ paddingLeft: '20px' }}>
                <li>This question paper comprises {paper.sections.length} sections.</li>
                <li>All questions are compulsory. Internal choices have been provided in some questions.</li>
                {paper.sections.map(s => (
                  <li key={s.id}>{s.name} consists of {s.count} questions of {s.marksPerQuestion} marks each.</li>
                ))}
              </ol>
            </div>

            {/* Sections & Questions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {paper.sections.map((sec, secIdx) => (
                <div key={sec.id}>
                  <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px', marginBottom: '15px' }}>
                    {sec.name}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {sec.questions.map((q, qIdx) => (
                      <div key={q.id} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', fontSize: '15px', position: 'relative' }}>
                        <span style={{ fontWeight: 'bold', minWidth: '35px' }}>Q{qIdx + 1}.</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <p style={{ marginBottom: '10px' }}>{q.text}</p>
                            <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>[{sec.marksPerQuestion}]</span>
                          </div>
                          
                          {q.options && (
                            <div className="opts-grid" style={{ gap: '8px', marginLeft: '10px' }}>
                              {q.options.map((opt, i) => (
                                <div key={i}>({String.fromCharCode(97 + i)}) {typeof opt === 'string' ? opt.replace(/^\s*[\(\[]?[a-dA-D][\)\].]\s*/i, '') : opt}</div>
                              ))}
                            </div>
                          )}

                          {/* AI Confidence Badge (hidden on print) */}
                          <div className="hide-on-print" style={{ marginTop: '10px', display: 'inline-block', fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '4px', background: 'rgba(35,84,244,0.1)', color: '#2354F4' }}>
                            {t('oracle.aiConfidenceBadge').replace('{conf}', q.conf)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '50px', fontStyle: 'italic', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
              {t('oracle.endOfPaper')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
