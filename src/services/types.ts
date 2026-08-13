export interface AssessmentRecord {
  id: number;
  templateCode: string;
  customerName?: string;
  employeeName?: string;
  customerMobile?: string;
  phoneNumber?: string;
  studentName?: string;
  submittedAt?: string;
  createdTime?: string;
  resultJson?: string | Record<string, any>;
  resultData?: Record<string, any>;
  answers?: Record<string, any>;
  durationSeconds?: number;
  projectKey?: string;
  projectName?: string;
  projectTagClass?: string;
  targetSubject?: string;
  grade?: string;
  specialtyDirection?: string;
  scoreText?: string;
  customUrl?: string;
  ossKey?: string;
}

export interface CustomTemplate {
  templateCode: string;
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
