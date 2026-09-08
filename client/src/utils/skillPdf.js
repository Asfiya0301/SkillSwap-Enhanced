const escapePdfText = (value = '') =>
  String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');

const wrapText = (text, maxChars = 72) => {
  if (!text) return [''];
  const parts = String(text).split(/\s+/);
  const lines = [];
  let current = '';

  for (const part of parts) {
    const candidate = current ? `${current} ${part}` : part;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = part;
    }
  }

  if (current) lines.push(current);
  return lines.length ? lines : [''];
};

const drawText = (x, y, size, isBold, color, text) => {
  const font = isBold ? 2 : 1;
  return `q\n${color} rg\nBT /F${font} ${size} Tf ${x} ${y} Td (${escapePdfText(text)}) Tj ET\nQ\n`;
};

const drawRect = (x, y, width, height, fillColor, strokeColor = '0 0 0') => {
  return `q\n${fillColor} rg\n${x} ${y} ${width} ${height} re f\nQ\nq\n${strokeColor} RG\n${x} ${y} ${width} ${height} re S\nQ\n`;
};

const drawBadge = (x, y, size, label) => {
  let content = '';
  content += drawRect(x, y, size, size, '0.14 0.20 0.30', '0.08 0.12 0.18');
  content += drawText(x + 9, y + 18, 24, true, '1 1 1', label);
  return content;
};

const drawSectionHeader = (x, y, width, title, fillColor) => {
  let content = '';
  content += drawRect(x, y, width, 26, fillColor, '0.15 0.18 0.22');
  content += drawText(x + 12, y + 9, 10, true, '1 1 1', title.toUpperCase());
  return content;
};

const buildPageOne = ({ title, category, userName, tags, description, syllabus, roadmap, ownerNotes, bookingSummary }) => {
  const sections = [
    { title: 'Overview', header: '0.16 0.25 0.37', color: '0.96 0.97 0.98', body: wrapText(description, 78) },
    { title: 'Syllabus', header: '0.20 0.34 0.46', color: '0.95 0.97 0.98', body: syllabus },
    { title: 'Roadmap', header: '0.27 0.38 0.47', color: '0.98 0.97 0.94', body: roadmap },
    { title: 'Owner Notes', header: '0.24 0.31 0.39', color: '0.96 0.97 0.98', body: ownerNotes },
    { title: 'Swap / Booking', header: '0.18 0.29 0.39', color: '0.97 0.97 0.96', body: bookingSummary },
  ];

  let content = '';
  content += `q\n0.90 0.92 0.94 rg\n50 695 512 88 re f\nQ\n`;
  content += `q\n0.96 0.97 0.98 rg\n60 707 512 64 re f\nQ\n`;
  content += drawBadge(60, 707, 42, 'S');
  content += drawText(116, 755, 22, true, '0.10 0.16 0.24', 'SKILLSWAP');
  content += drawText(118, 736, 10, true, '0.27 0.36 0.43', 'CERTIFICATE OF LEARNING');
  content += drawText(118, 670, 12, true, '0.10 0.14 0.19', `Skill: ${title}`);
  content += drawText(118, 652, 11, false, '0.18 0.22 0.27', `Category: ${category}`);
  content += drawText(118, 634, 11, false, '0.18 0.22 0.27', `Owner: ${userName}`);
  content += drawText(118, 616, 11, false, '0.18 0.22 0.27', `Tags: ${tags}`);

  content += drawRect(430, 620, 120, 15, '0.88 0.84 0.68', '0.29 0.27 0.19');
  content += drawText(440, 626, 9, true, '0.16 0.18 0.19', 'VERIFIED GUIDE');

  let y = 548;
  for (const section of sections.slice(0, 3)) {
    const bodyLines = section.body;
    const boxHeight = Math.max(92, 32 + bodyLines.length * 15 + 18);
    content += drawRect(48, y - boxHeight + 20, 516, boxHeight, section.color, '0.18 0.20 0.24');
    content += drawSectionHeader(48, y - boxHeight + 20, 516, section.title, section.header);
    let lineY = y - 18;
    for (const line of bodyLines.slice(0, 7)) {
      content += drawText(60, lineY, 10, false, '0.12 0.14 0.22', line);
      lineY -= 15;
    }
    y -= boxHeight + 12;
  }

  content += drawText(52, 34, 9, false, '0.2 0.2 0.2', 'Page 1 of 2');
  content += drawText(414, 34, 9, false, '0.2 0.2 0.2', 'SkillSwap certificate / community learning');
  return content;
};

const buildPageTwo = ({ title, category, userName, syllabus, roadmap, ownerNotes, bookingSummary, readingNotes }) => {
  const agenda = [
    'Learning Agenda',
    '1. Prepare a learning checklist for the selected skill.',
    '2. Study fundamentals, real examples, and guided practice.',
    '3. Build a mini project or outcome-based exercise.',
    '4. Review feedback and document progress in a journal.',
    '5. Schedule a skill exchange or booking session with the owner.'
  ];

  let content = '';
  content += drawRect(42, 720, 528, 58, '0.94 0.95 0.96', '0.18 0.20 0.24');
  content += drawBadge(58, 725, 36, 'S');
  content += drawText(106, 756, 18, true, '0.10 0.16 0.24', 'SKILLSWAP');
  content += drawText(108, 734, 10, true, '0.27 0.36 0.43', 'SUMMARY / AGENDA');
  content += drawText(412, 756, 10, false, '0.12 0.16 0.21', `Course: ${title}`);

  const sections = [
    { title: 'Agenda', header: '0.16 0.29 0.40', color: '0.96 0.98 0.98', body: agenda },
    { title: 'Summary', header: '0.28 0.37 0.44', color: '0.98 0.97 0.94', body: [
      `Skill: ${title}`,
      `Category: ${category}`,
      `Instructor: ${userName}`,
      'Outcome: guided learning + practical support',
      'Format: swap session or booking-based walkthrough',
      'Reading notes:',
      ...readingNotes,
      `Owner notes: ${ownerNotes[1]}`,
      `Booking: ${bookingSummary[0]}`,
      `Next step: ${bookingSummary[3]}`
    ] },
    { title: 'Final Notes', header: '0.22 0.31 0.39', color: '0.96 0.97 0.98', body: [
      'Prepared for a structured learning plan.',
      'Ready for a live exchange session or mentor-led review.',
      'Signature date: ' + new Date().toLocaleDateString(),
      'Approved by: SkillSwap Community'
    ] }
  ];

  let y = 642;
  for (const section of sections) {
    const bodyLines = section.body;
    const boxHeight = Math.max(110, 26 + bodyLines.length * 16 + 14);
    content += drawRect(48, y - boxHeight + 18, 516, boxHeight, section.color, '0.18 0.20 0.24');
    content += drawSectionHeader(48, y - boxHeight + 18, 516, section.title, section.header);
    let lineY = y - 20;
    const visibleLines = section.title === 'Summary' ? bodyLines.slice(0, 14) : bodyLines.slice(0, 8);
    for (const line of visibleLines) {
      content += drawText(60, lineY, 10, false, '0.12 0.14 0.22', line);
      lineY -= 15;
    }
    y -= boxHeight + 14;
  }

  content += drawText(52, 40, 9, false, '0.2 0.2 0.2', 'Page 2 of 2');
  content += drawText(410, 40, 9, false, '0.2 0.2 0.2', 'SkillSwap complete record');
  content += drawText(70, 26, 9, false, '0.2 0.2 0.2', 'Signature: ____________________________   Date: ____________________');
  return content;
};

const buildPdfDocument = ({ pageOneContent, pageTwoContent }) => {
  const font1 = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`;
  const font2 = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>`;

  const objects = [
    `<< /Type /Catalog /Pages 2 0 R >>`,
    `<< /Type /Pages /Kids [3 0 R 7 0 R] /Count 2 >>`,
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>`,
    `<< /Length ${pageOneContent.length} >>\nstream\n${pageOneContent}\nendstream`,
    font1,
    font2,
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 8 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>`,
    `<< /Length ${pageTwoContent.length} >>\nstream\n${pageTwoContent}\nendstream`
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  objects.forEach((content, index) => {
    offsets[index + 1] = pdf.length;
    pdf += `${index + 1} 0 obj\n${content}\nendobj\n`;
  });

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return pdf;
};

const buildSkillPdfBytes = (skill) => {
  const payload = skill || {};
  const title = payload.title || 'Skill Resource Guide';
  const category = payload.category || 'Skill';
  const description = payload.description || 'This guide contains the key learning notes for the selected skill.';
  const userName = payload.user?.name || payload.author || 'SkillSwap Community';
  const tags = Array.isArray(payload.tags) && payload.tags.length ? payload.tags.join(', ') : 'skill exchange';

  const syllabus = payload.syllabus || [
    '1. Foundations and key concepts',
    '2. Core hands-on practice and mini-projects',
    '3. Troubleshooting and common mistakes',
    '4. Real-world application and feedback loop'
  ];

  const roadmap = payload.roadmap || [
    'Step 1: Learn the basics and terminology',
    'Step 2: Practice with guided examples',
    'Step 3: Build a small project or exercise',
    'Step 4: Review feedback and improve',
    'Step 5: Apply the skill in a real scenario'
  ];

  const readingNotes = payload.readingNotes || [
    'Read one concept at a time and write a small example from memory.',
    'Keep a short list of questions to discuss during your skill exchange.',
    'Practice by applying each idea to a small, useful project.'
  ];

  const ownerNotes = [
    `Shared by: ${userName}`,
    'Best for learners who want a practical, guided path.',
    'Recommended for consistent practice and weekly review.',
    'Ask for a session or swap booking if personalized guidance is needed.'
  ];

  const bookingSummary = [
    'Session type: skill exchange or guided support',
    'Preferred mode: online or in-person based on agreement',
    'Expected outcome: practical learning and measurable progress',
    'Next step: message the owner to confirm availability and topics'
  ];

  const pageOneContent = buildPageOne({
    title,
    category,
    userName,
    tags,
    description,
    syllabus,
    roadmap,
    ownerNotes,
    bookingSummary,
    readingNotes
  });

  const pageTwoContent = buildPageTwo({
    title,
    category,
    userName,
    syllabus,
    roadmap,
    ownerNotes,
    bookingSummary
  });

  return buildPdfDocument({ pageOneContent, pageTwoContent });
};

const createSkillPdfUrl = (skill) => {
  const pdfBytes = buildSkillPdfBytes(skill);
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
};

export const openSkillPdf = (skill) => {
  const url = createSkillPdfUrl(skill);
  window.open(url, '_blank', 'noopener,noreferrer');
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
};

export const downloadSkillPdf = (skill) => {
  const url = createSkillPdfUrl(skill);
  const title = skill?.title || 'skill-guide';
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'skill-guide'}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
