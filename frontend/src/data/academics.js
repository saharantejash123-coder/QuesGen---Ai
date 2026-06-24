// ─── Shared academic options ─────────────────────────────────────────────────
// Single source of truth so every class/stream/subject dropdown across the app
// stays consistent. Only board-exam classes (10 & 12) are offered. Class 12 is
// stream-based (Science / Commerce / Arts); Class 10 has no stream.

export const CLASS_OPTIONS = ['Class 10', 'Class 12'];

export const STREAMS = ['Science', 'Commerce', 'Arts'];

// Class 10 — common subjects, no stream.
const CLASS_10_SUBJECTS = ['Science', 'Social Science', 'Mathematics', 'English', 'Hindi'];

// Class 12 — subjects depend on the chosen stream.
const CLASS_12_SUBJECTS = {
  Science:  ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English', 'Hindi'],
  Commerce: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'English'],
  Arts:     ['History', 'Political Science', 'Geography', 'Economics', 'English', 'Hindi'],
};

// Does this class use a stream selector?
export function hasStream(cls) {
  return cls === 'Class 12';
}

// Subjects available for a class (+ stream when applicable).
export function subjectsFor(cls, stream = 'Science') {
  if (cls === 'Class 12') return CLASS_12_SUBJECTS[stream] || CLASS_12_SUBJECTS.Science;
  return CLASS_10_SUBJECTS;
}

// First valid subject for a class/stream (handy when resetting after a change).
export function defaultSubject(cls, stream = 'Science') {
  return subjectsFor(cls, stream)[0];
}
