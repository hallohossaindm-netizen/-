// Responsive & optimized image assets for Talimul Quran Women's Madrasah
import heroWebpFull from './images/madrasah_campus_hero_1791811339923.webp';
import heroWebp960 from './images/madrasah_campus_hero_1791811339923_960w.webp';
import heroWebp640 from './images/madrasah_campus_hero_1791811339923_640w.webp';
import heroJpg from './images/madrasah_campus_hero_1791811339923.jpg';

import principalWebpFull from './images/madrasah_principal_1791811356816.webp';
import principalWebp640 from './images/madrasah_principal_1791811356816_640w.webp';
import principalWebp320 from './images/madrasah_principal_1791811356816_320w.webp';
import principalJpg from './images/madrasah_principal_1791811356816.jpg';

import classroomWebpFull from './images/madrasah_classroom_quran_1791811374344.webp';
import classroomWebp600 from './images/madrasah_classroom_quran_1791811374344_600w.webp';
import classroomJpg from './images/madrasah_classroom_quran_1791811374344.jpg';

import libraryWebpFull from './images/madrasah_library_books_1791811388206.webp';
import libraryWebp600 from './images/madrasah_library_books_1791811388206_600w.webp';
import libraryJpg from './images/madrasah_library_books_1791811388206.jpg';

export interface OptimizedImage {
  src: string;
  webpSrc: string;
  srcSet: string;
  mobileSrc: string;
  fallbackJpg: string;
  width: number;
  height: number;
  aspectRatio: string;
  alt: string;
}

export const CAMPUS_HERO_IMAGE: OptimizedImage = {
  src: heroWebpFull,
  webpSrc: heroWebpFull,
  mobileSrc: heroWebp640,
  srcSet: `${heroWebp640} 640w, ${heroWebp960} 960w, ${heroWebpFull} 1376w`,
  fallbackJpg: heroJpg,
  width: 1376,
  height: 768,
  aspectRatio: '16/9',
  alt: 'তালিমুল কুরআন মহিলা মাদ্রাসা মনোরম ক্যাম্পাস প্রাঙ্গণ'
};

export const PRINCIPAL_IMAGE: OptimizedImage = {
  src: principalWebpFull,
  webpSrc: principalWebpFull,
  mobileSrc: principalWebp320,
  srcSet: `${principalWebp320} 320w, ${principalWebp640} 640w, ${principalWebpFull} 1024w`,
  fallbackJpg: principalJpg,
  width: 1024,
  height: 1024,
  aspectRatio: '1/1',
  alt: 'হযরত মাওলানা আমিন রাসূল সাহেব - বর্তমান পরিচালক'
};

export const CLASSROOM_IMAGE: OptimizedImage = {
  src: classroomWebpFull,
  webpSrc: classroomWebpFull,
  mobileSrc: classroomWebp600,
  srcSet: `${classroomWebp600} 600w, ${classroomWebpFull} 1200w`,
  fallbackJpg: classroomJpg,
  width: 1200,
  height: 896,
  aspectRatio: '4/3',
  alt: 'পবিত্র কুরআনুল কারীমের সহীহ পাঠদান কক্ষ'
};

export const LIBRARY_IMAGE: OptimizedImage = {
  src: libraryWebpFull,
  webpSrc: libraryWebpFull,
  mobileSrc: libraryWebp600,
  srcSet: `${libraryWebp600} 600w, ${libraryWebpFull} 1200w`,
  fallbackJpg: libraryJpg,
  width: 1200,
  height: 896,
  aspectRatio: '4/3',
  alt: 'সমৃদ্ধ কিতাবখানা ও গবেষণাগার'
};
