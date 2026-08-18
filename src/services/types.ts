export interface AssessmentRecord {
  id: number;
  templateCode: string;
  templateName?: string;
  templateType?: string;
  customerName?: string;
  employeeName?: string;
  customerMobile?: string;
  phoneNumber?: string;
  studentName?: string;
  submittedAt?: string;
  createdTime?: string;
  resultJson?: string | Record<string, any>;
  resultData?: Record<string, any>;
  answers?: any[];
  answersCount?: number;
  durationSeconds?: number;
  projectKey?: string;
  projectName?: string;
  projectTagClass?: string;
  targetSubject?: string;
  targetSubjectScore?: number;
  targetSubjectFullScore?: number;
  grade?: string;
  specialtyDirection?: string;
  scoreBand?: string;
  foreignLanguage?: string;
  learningFocus?: string;
  profileId?: string;
  advisorName?: string;
  advisorMobile?: string;
  advisorToken?: string;
  advisorEmployeeId?: number | string;
  dominantModality?: string;
  vScore?: number;
  aScore?: number;
  rScore?: number;
  kScore?: number;
  scoreText?: string;
  detailSummary?: string;
  reportUrl?: string;
  customUrl?: string;
  ossKey?: string;
}

export interface CustomTemplate {
  templateCode: string;
  templateName?: string;
  templateType?: string;
  projectName: string;
  category: "PRE_SALE" | "POST_SALE";
  fileName: string;
  customUrl?: string;
  uploadedAt: string;
}

export interface AdvisorTokenInfo {
  token: string;
  name: string;
  mobile: string;
}
