import { AdmitCardData } from '../types';
import { MADRASAH_INFO } from '../data/madrasahData';

/**
 * Builds the live verification URL encoded inside the Admit Card's QR code.
 * When scanned with ANY smartphone camera or QR reader, it opens this live link,
 * triggering the official Digital Verification view.
 */
export const getAdmitCardVerificationUrl = (card: AdmitCardData): string => {
  // Always use the publicly accessible preview URL for QR code verification
  // so external mobile phones & QR scanner cameras can instantly open it without auth barriers
  let origin = 'https://ais-pre-lyhl47vmtsbynzthruoizk-829183906101.asia-east1.run.app';
  if (typeof window !== 'undefined' && window.location.origin) {
    const rawOrigin = window.location.origin;
    if (rawOrigin.includes('ais-dev-')) {
      origin = rawOrigin.replace('ais-dev-', 'ais-pre-');
    } else if (!rawOrigin.includes('localhost') && !rawOrigin.includes('127.0.0.1')) {
      origin = rawOrigin;
    }
  }

  const params = new URLSearchParams({
    verify_admit: '1',
    roll: card.roll,
    reg: card.registrationNo,
    student: card.studentName,
    studentEn: card.studentNameEn || '',
    father: card.fatherName,
    mother: card.motherName || '',
    dept: card.department,
    exam: card.examName,
    session: card.session,
    center: card.examCenter,
    res: card.residentType,
    issued: card.issueDate,
  });

  return `${origin}/?${params.toString()}#verify-admit`;
};

/**
 * Generates clean, standalone, print-optimized HTML for A4 paper.
 */
export const generatePrintableAdmitCardHtml = (card: AdmitCardData, qrCodeUrl: string): string => {
  const residentLabel = card.residentType === 'residential' ? 'আবাসিক (হেফজ বিভাগ)' : 'অনাবাসিক';
  const verifyUrl = getAdmitCardVerificationUrl(card);

  const scheduleRows = card.schedule
    .map(
      (item, idx) => `
      <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f9fafb'}; border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 7px 10px; font-weight: 500; font-size: 11px; white-space: nowrap;">${item.date} (${item.day})</td>
        <td style="padding: 7px 10px; font-weight: 600; font-size: 11px; color: #111827;">${item.subject}</td>
        <td style="padding: 7px 10px; font-size: 11px; color: #374151; white-space: nowrap; font-family: monospace;">${item.time}</td>
        <td style="padding: 7px 10px; font-size: 11px; text-align: right; color: #374151; white-space: nowrap;">${item.roomNo}</td>
      </tr>
    `
    )
    .join('');

  const instructionsList = card.instructions
    .map(
      (inst) => `<li style="margin-bottom: 3px; font-size: 10px; color: #374151; line-height: 1.4;">${inst}</li>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>${card.studentName} - প্রবেশপত্র (রোল: ${card.roll}) - ${MADRASAH_INFO.name}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@700&family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 10mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: 'Hind Siliguri', system-ui, -apple-system, sans-serif;
      background-color: #ffffff;
      color: #1f2937;
      line-height: 1.35;
    }
    .admit-container {
      width: 100%;
      max-width: 185mm;
      margin: 0 auto;
      border: 2px solid #064E3B;
      padding: 14px 18px;
      border-radius: 6px;
      position: relative;
      background: #ffffff;
    }
    .inner-border {
      border: 1px dashed #064E3B;
      padding: 12px;
      border-radius: 4px;
    }
    .arabic-text {
      font-family: 'Amiri', serif;
      font-size: 14px;
      color: #064E3B;
      text-align: center;
      margin-bottom: 3px;
    }
    .title-banner {
      text-align: center;
      border-bottom: 2px solid #064E3B;
      padding-bottom: 8px;
      margin-bottom: 10px;
    }
    .madrasah-name {
      font-size: 22px;
      font-weight: 800;
      color: #064E3B;
      margin: 0;
      letter-spacing: -0.3px;
    }
    .madrasah-name-en {
      font-size: 11px;
      color: #4b5563;
      margin: 1px 0;
      font-family: sans-serif;
    }
    .madrasah-meta {
      font-size: 10px;
      color: #4b5563;
      margin: 1px 0;
    }
    .badge-wrap {
      margin-top: 6px;
    }
    .admit-badge {
      display: inline-block;
      background-color: #064E3B;
      color: #fef08a;
      font-weight: 700;
      font-size: 12px;
      padding: 3px 14px;
      border-radius: 4px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .exam-ribbon {
      background-color: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 4px;
      padding: 6px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      margin-bottom: 10px;
    }
    .student-grid {
      display: table;
      width: 100%;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      background-color: #fafafa;
      margin-bottom: 10px;
    }
    .student-cell-info {
      display: table-cell;
      width: 70%;
      padding: 8px 12px;
      vertical-align: top;
    }
    .student-cell-qr {
      display: table-cell;
      width: 30%;
      padding: 8px 10px;
      text-align: center;
      vertical-align: middle;
      border-left: 1px dashed #d1d5db;
      background-color: #ffffff;
    }
    .info-table {
      width: 100%;
      font-size: 11px;
    }
    .info-table td {
      padding: 2.5px 0;
      vertical-align: top;
    }
    .info-label {
      color: #6b7280;
      width: 35%;
      font-size: 10px;
    }
    .info-val {
      color: #111827;
      font-weight: 600;
      width: 65%;
    }
    .routine-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
    }
    .routine-table th {
      background-color: #064E3B;
      color: #ffffff;
      padding: 6px 10px;
      font-size: 11px;
      text-align: left;
    }
    .instructions-box {
      background-color: #fefce8;
      border: 1px solid #fef08a;
      border-radius: 4px;
      padding: 6px 10px;
      margin-bottom: 12px;
    }
    .instructions-title {
      font-size: 10px;
      font-weight: 700;
      color: #854d0e;
      margin-bottom: 3px;
    }
    .signatures-row {
      display: table;
      width: 100%;
      margin-top: 14px;
      padding-top: 10px;
    }
    .sig-col {
      display: table-cell;
      width: 33.33%;
      text-align: center;
      vertical-align: bottom;
      font-size: 10px;
    }
    .seal-box {
      width: 62px;
      height: 62px;
      border: 1.5px dashed #064E3B;
      border-radius: 50%;
      margin: 0 auto 3px auto;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8px;
      color: #064E3B;
      font-weight: bold;
      text-align: center;
      padding: 2px;
      line-height: 1.1;
    }
    .sig-line {
      width: 80%;
      border-bottom: 1px solid #9ca3af;
      margin: 0 auto 3px auto;
    }
    .footer-note {
      text-align: center;
      font-size: 8.5px;
      color: #9ca3af;
      margin-top: 10px;
      padding-top: 4px;
      border-top: 1px solid #f3f4f6;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <div class="admit-container">
    <div class="inner-border">
      <!-- Arabic Bismillah -->
      <div class="arabic-text">
        ${MADRASAH_INFO.arabicVerse || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
      </div>

      <!-- Madrasah Header -->
      <div class="title-banner">
        <h1 class="madrasah-name">${MADRASAH_INFO.name}</h1>
        <div class="madrasah-name-en">${MADRASAH_INFO.nameEn}</div>
        <div class="madrasah-meta">
          ${MADRASAH_INFO.address} • যোগাযোগ: ${MADRASAH_INFO.contactNumber} • ইআইআইএন: ${MADRASAH_INFO.eiin}
        </div>
        <div class="badge-wrap">
          <span class="admit-badge">পরীক্ষার প্রবেশপত্র (ADMIT CARD)</span>
        </div>
      </div>

      <!-- Exam Ribbon -->
      <div class="exam-ribbon">
        <div>
          <span style="color: #4b5563;">পরীক্ষার নাম: </span>
          <strong style="color: #064E3B; font-size: 12px;">${card.examName}</strong>
        </div>
        <div>
          <span>শিক্ষাবর্ষ: <strong>${card.session}</strong></span>
          <span style="margin: 0 4px; color: #9ca3af;">|</span>
          <span>ইস্যুর তারিখ: <strong>${card.issueDate}</strong></span>
        </div>
      </div>

      <!-- Student Info & QR Code Grid -->
      <div class="student-grid">
        <div class="student-cell-info">
          <table class="info-table">
            <tr>
              <td class="info-label">শিক্ষার্থীর নাম (বাংলা):</td>
              <td class="info-val" style="font-size: 12px; color: #064E3B;">${card.studentName}</td>
            </tr>
            ${
              card.studentNameEn
                ? `<tr>
              <td class="info-label">শিক্ষার্থীর নাম (ইংরেজি):</td>
              <td class="info-val" style="font-family: sans-serif; font-size: 11px;">${card.studentNameEn}</td>
            </tr>`
                : ''
            }
            <tr>
              <td class="info-label">পিতার নাম:</td>
              <td class="info-val">${card.fatherName}</td>
            </tr>
            ${
              card.motherName
                ? `<tr>
              <td class="info-label">মাতার নাম:</td>
              <td class="info-val">${card.motherName}</td>
            </tr>`
                : ''
            }
            <tr>
              <td class="info-label">রোল নম্বর:</td>
              <td class="info-val" style="font-size: 14px; color: #064E3B; font-family: monospace;">${card.roll}</td>
            </tr>
            <tr>
              <td class="info-label">রেজিস্ট্রেশন নম্বর:</td>
              <td class="info-val" style="font-family: monospace;">${card.registrationNo}</td>
            </tr>
            <tr>
              <td class="info-label">বিভাগ ও ব্যবস্থা:</td>
              <td class="info-val"><strong>${card.department}</strong> (${residentLabel})</td>
            </tr>
            <tr>
              <td class="info-label">পরীক্ষা কেন্দ্র:</td>
              <td class="info-val" style="font-size: 10px;">${card.examCenter}</td>
            </tr>
          </table>
        </div>

        <div class="student-cell-qr">
          ${
            qrCodeUrl
              ? `<img src="${qrCodeUrl}" alt="ভেরিফিকেশন কিউআর কোড" style="width: 108px; height: 108px; display: block; margin: 0 auto; object-fit: contain;">`
              : `<div style="width: 108px; height: 108px; background: #eee; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 9px;">QR কোড প্রস্তুত হচ্ছে</div>`
          }
          <div style="font-size: 8.5px; font-weight: bold; color: #064E3B; margin-top: 3px;">
            ✓ ডিজিটাল ভেরিফাইড কোড
          </div>
          <div style="font-size: 8px; color: #6b7280; font-family: monospace;">
            রেজিস্ট্রেশন: ${card.registrationNo}
          </div>
          <div style="font-size: 7.5px; color: #9ca3af; margin-top: 2px; line-height: 1.1;">
            ক্যামেরা দিয়ে স্ক্যান করে অনলাইন সত্যতা যাচাই করুন
          </div>
        </div>
      </div>

      <!-- Schedule Table -->
      <table class="routine-table">
        <thead>
          <tr>
            <th style="width: 25%;">তারিখ ও বার</th>
            <th style="width: 40%;">বিষয়ের নাম</th>
            <th style="width: 20%;">পরীক্ষার সময়</th>
            <th style="width: 15%; text-align: right;">কক্ষ নং</th>
          </tr>
        </thead>
        <tbody>
          ${scheduleRows}
        </tbody>
      </table>

      <!-- Instructions Box -->
      <div class="instructions-box">
        <div class="instructions-title">পরীক্ষার্থীদের জন্য বিশেষ নির্দেশাবলী:</div>
        <ul style="margin: 0; padding-left: 14px;">
          ${instructionsList}
        </ul>
      </div>

      <!-- Signatures Row -->
      <div class="signatures-row">
        <div class="sig-col">
          <div class="sig-line"></div>
          <span style="color: #4b5563;">শিক্ষার্থীর স্বাক্ষর</span>
        </div>

        <div class="sig-col">
          <div class="seal-box">
            মাদরাসার<br>অফিসিয়াল<br>সীলমোহর
          </div>
          <span style="color: #6b7280; font-size: 9px;">অফিস সীল</span>
        </div>

        <div class="sig-col" style="text-align: right;">
          <div style="font-family: 'Amiri', serif; font-size: 13px; color: #064E3B; font-weight: bold; margin-bottom: 2px;">
            محمد أمين رسول
          </div>
          <div class="sig-line" style="margin-left: auto; margin-right: 0;"></div>
          <strong style="color: #111827; display: block;">মাওলানা আমিন রাসূল সাহেব</strong>
          <span style="color: #6b7280;">মুহতামিম ও পরীক্ষা নিয়ন্ত্রক</span>
        </div>
      </div>

      <!-- Footer Note -->
      <div class="footer-note">
        এটি তালিমুল কুরআন ওয়াস সুন্নাহ মাদরাসার কেন্দ্রীয় ডিজিটাল পরীক্ষা নিয়ন্ত্রণ সিস্টেম দ্বারা স্বয়ংক্রিয়ভাবে তৈরি প্রবেশপত্র। অনলাইন ভেরিফিকেশন: ${verifyUrl}
      </div>
    </div>
  </div>
</body>
</html>`;
};

/**
 * Cleanly prints the Admit Card on desktop and mobile devices.
 * Avoids window.open; uses direct print-admit-card-mode on mobile or isolated iframe on desktop.
 */
export const printAdmitCard = (card: AdmitCardData, qrCodeUrl: string): Promise<void> => {
  return new Promise((resolve) => {
    const isMobile =
      typeof navigator !== 'undefined' &&
      /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

    if (isMobile) {
      // Mobile Safari / Chrome / Android: direct window.print via isolated print stylesheet
      document.body.classList.add('print-admit-card-mode');
      setTimeout(() => {
        window.print();
        setTimeout(() => {
          document.body.classList.remove('print-admit-card-mode');
          resolve();
        }, 1200);
      }, 250);
      return;
    }

    // Desktop: Create invisible iframe attached to body
    const oldFrame = document.getElementById('admit-card-hidden-print-frame');
    if (oldFrame) {
      oldFrame.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'admit-card-hidden-print-frame';
    iframe.setAttribute(
      'style',
      'position: fixed; right: 0; bottom: 0; width: 0; height: 0; border: 0; visibility: hidden; opacity: 0;'
    );
    document.body.appendChild(iframe);

    const html = generatePrintableAdmitCardHtml(card, qrCodeUrl);
    const frameDoc = iframe.contentWindow?.document || iframe.contentDocument;

    if (!frameDoc || !iframe.contentWindow) {
      document.body.classList.add('print-admit-card-mode');
      window.print();
      setTimeout(() => {
        document.body.classList.remove('print-admit-card-mode');
        resolve();
      }, 1000);
      return;
    }

    frameDoc.open();
    frameDoc.write(html);
    frameDoc.close();

    // Give browser time to load web fonts and images before triggering print dialog
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.warn('Iframe print error, falling back to window.print', err);
        document.body.classList.add('print-admit-card-mode');
        window.print();
        setTimeout(() => {
          document.body.classList.remove('print-admit-card-mode');
        }, 1000);
      }

      // Cleanup frame safely after user interacts with print dialog
      setTimeout(() => {
        try {
          if (iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
        } catch {
          // ignore
        }
        resolve();
      }, 3500);
    }, 450);
  });
};
