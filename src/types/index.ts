export type DepartmentId = 'noorani' | 'nazera' | 'hifz' | 'kitab';

export interface Department {
  id: DepartmentId;
  name: string;
  nameArabic: string;
  subtitle: string;
  duration: string;
  ageLimit: string;
  description: string;
  features: string[];
  syllabus: string[];
  iconName: string;
}

export interface ScheduleItem {
  time: string;
  activity: string;
  details: string;
  category: 'worship' | 'study' | 'rest' | 'personal';
}

export interface NoticeItem {
  id: string;
  title: string;
  category: 'admission' | 'exam' | 'holiday' | 'general';
  categoryLabel: string;
  date: string;
  publishedBy: string;
  content: string;
  pdfUrl?: string;
  isImportant?: boolean;
}

export interface StudentResult {
  roll: string;
  registrationNo: string;
  name: string;
  fatherName: string;
  department: string;
  examName: string;
  session: string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: 'মুমতাজ (A+)' | 'জায়্যিদ জিদ্দান (A)' | 'জায়্যিদ (B)' | 'মাকবুল (C)';
  resultStatus: 'উত্তীর্ণ' | 'অনুত্তীর্ণ';
  subjects: {
    subjectName: string;
    fullMarks: number;
    obtainedMarks: number;
    gradeLetter: string;
  }[];
  muhtamimSignatureDate: string;
}

export interface AdmissionFormData {
  studentName: string;
  studentNameEn: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  dateOfBirth: string;
  bloodGroup: string;
  presentAddress: string;
  permanentAddress: string;
  departmentChoice: DepartmentId | '';
  residentType: 'residential' | 'non_residential';
  guardianMobile: string;
  guardianAlternateMobile?: string;
  previousInstitute?: string;
  agreement: boolean;
}

export type AdmissionStatus = 'pending' | 'interview_selected' | 'approved' | 'rejected';

export interface AdmissionApplication {
  id: string;
  submittedAt: string;
  data: AdmissionFormData;
  status: AdmissionStatus;
  adminNotes?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'campus' | 'classroom' | 'library' | 'event';
  categoryLabel: string;
  imageUrl: string;
  caption: string;
}

