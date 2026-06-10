/* ── Adaptive Testing Question Bank ──
   Now fetched from Backend API */

export const fetchAllQuestions = async () => {
  try {
    const res = await fetch('/api/data/questions');
    if (!res.ok) throw new Error('Failed to fetch questions');
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchBlueprints = async () => {
  try {
    const res = await fetch('/api/data/blueprints');
    if (!res.ok) throw new Error('Failed to fetch blueprints');
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};
