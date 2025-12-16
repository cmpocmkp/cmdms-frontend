// CMDMS Frontend Types
// Based on extracted business rules from legacy CMDMS

// ============================================================================
// ENUMS
// ============================================================================

export enum UserRole {
  ADMIN = 'admin',
  DEPARTMENT = 'department',
  DATA_ENTRY = 'data-entry',
  CM = 'cm',
  CS = 'cs',
  BOARD = 'board',
}

export enum Status {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  ON_TARGET = 'on_target',
  OFF_TARGET = 'off_target',
  OVERDUE = 'overdue',
  COMPLETED = 'completed',
  CLOSED = 'closed',
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export enum Priority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum MeetingType {
  CM_MEETING = 'cm_meeting',
  CABINET_MEETING = 'cabinet_meeting',
  SECTORAL_MEETING = 'sectoral_meeting',
  BOARD_MEETING = 'board_meeting',
  SENATE_MEETING = 'senate_meeting',
  PTF_MEETING = 'ptf_meeting',
  PMRU_MEETING = 'pmru_meeting',
}

export enum DepartmentType {
  MAIN = 1,
  BOARD = 2,
  DIVISION = 3,
  OTHER = 4,
}

export enum NotificationType {
  // Old CMDMS notification types (from navbar)
  MINUTE_REPLY = 'minute_reply',
  SECTORIAL_AGENDA_REPLY = 'sectorial_agenda_reply',
  MINUTE_NOTIFICATION = 'minute_notification',
  REPLY_NOTIFICATION = 'reply_notification',
  ANNOUNCEMENT_REPLY = 'announcement_reply',
  TASK_COMMENT = 'task_comment',
  DIRECTIVE_REPLY = 'directive_reply',
  
  // Generic types
  ASSIGNMENT = 'assignment',
  REPLY = 'reply',
  STATUS_CHANGE = 'status_change',
  DEADLINE_APPROACHING = 'deadline_approaching',
  DEADLINE_EXCEEDED = 'deadline_exceeded',
}

// ============================================================================
// BASE TYPES
// ============================================================================

export interface BaseEntity {
  id: string | number;
  created_at: string;
  updated_at: string;
  created_by?: number;
  modified_by?: number;
}

export interface TimestampedEntity {
  created_at: string;
  updated_at: string;
}

// ============================================================================
// USER & AUTH TYPES
// ============================================================================

export interface User extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  role_id: number;
  role?: Role;
  department_id?: number;
  department?: Department;
  departments?: Department[]; // For users with multiple department access
  is_active: boolean;
  user_group_id?: number;
  manager_id?: number;
  type?: string;
  permissions?: Permission[];
}

export interface Role {
  id: number;
  role_name: UserRole;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Permission extends BaseEntity {
  name: string;
  key?: string;
  controller: string;
  method: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  permissions: string[];
  role: UserRole | null;
}

// ============================================================================
// DEPARTMENT TYPES
// ============================================================================

export interface Department extends BaseEntity {
  name: string;
  department_type_id: DepartmentType;
  department_type?: {
    id: number;
    name: string;
  };
  parent_id?: number;
  parent?: Department;
  district_id?: number;
  district?: District;
  description?: string;
  is_active?: boolean;
}

export interface District extends BaseEntity {
  name: string;
  division?: string;
}

// ============================================================================
// MEETING TYPES
// ============================================================================

export interface Meeting extends BaseEntity {
  meeting_type: MeetingType;
  title: string;
  description?: string;
  meeting_date: string;
  venue?: string;
  status: Status;
  minutes?: Minute[];
  participants?: User[];
  attachments?: Attachment[];
}

export interface Minute extends BaseEntity {
  meeting_id: number;
  meeting?: Meeting;
  subject: string;
  description: string;
  decision?: string;
  departments: Department[];
  timeline?: string;
  deadline?: string;
  status: Status;
  progress?: number;
  reference_number?: string;
  replies?: Reply[];
  attachments?: Attachment[];
  tasks?: Task[];
}

export interface AgendaPoint extends BaseEntity {
  meeting_id: number;
  meeting?: Meeting;
  title: string;
  description: string;
  departments: Department[];
  order?: number;
  status: Status;
  replies?: Reply[];
  attachments?: Attachment[];
}

// ============================================================================
// ANNOUNCEMENT TYPES
// ============================================================================

export interface Announcement extends BaseEntity {
  title: string;
  description: string;
  announcement_date: string;
  status: Status;
  departments: Department[];
  sub_tasks?: AnnouncementSubTask[];
  replies?: Reply[];
  attachments?: Attachment[];
}

export interface AnnouncementSubTask extends BaseEntity {
  announcement_id: number;
  title: string;
  description?: string;
  department_id: number;
  department?: Department;
  status: Status;
  progress?: number;
  deadline?: string;
}

// ============================================================================
// DIRECTIVE TYPES
// ============================================================================

export interface Directive extends BaseEntity {
  title: string;
  description: string;
  directive_date: string;
  reference_number?: string;
  departments: Department[];
  status: Status;
  priority?: Priority;
  deadline?: string;
  sub_tasks?: DirectiveSubTask[];
  replies?: Reply[];
  attachments?: Attachment[];
}

export interface DirectiveSubTask extends BaseEntity {
  directive_id: number;
  title: string;
  description?: string;
  department_id: number;
  department?: Department;
  status: Status;
  progress?: number;
  deadline?: string;
}

// ============================================================================
// CM REMARKS TYPES
// ============================================================================

export interface CmRemark extends BaseEntity {
  subject: string;
  remark: string;
  remark_date: string;
  departments: Department[];
  status: Status;
  priority: Priority;
  deadline?: string;
  replies?: Reply[];
  attachments?: Attachment[];
}

// ============================================================================
// PTI TYPES
// ============================================================================

export interface Pti extends BaseEntity {
  title: string;
  description: string;
  start_date: string;
  end_date?: string;
  status: Status;
  progress?: number;
  tasks?: PtiTask[];
}

export interface PtiTask extends BaseEntity {
  pti_id: number;
  title: string;
  description: string;
  department_id: number;
  department?: Department;
  status: Status;
  progress?: number;
  timeline?: string;
  deadline?: string;
  replies?: Reply[];
}

// ============================================================================
// KHUSHHAL KPK TYPES
// ============================================================================

export interface KhushhalKpk extends BaseEntity {
  title: string;
  description: string;
  departments: Department[];
  status: Status;
  progress?: number;
  start_date: string;
  end_date?: string;
  kpi_data?: KpiData[];
  replies?: Reply[];
}

export interface KpiData extends BaseEntity {
  khushhalkpk_id?: number;
  user_id: number;
  department_id: number;
  data_point: string;
  value: number;
  month: number;
  year: number;
  remarks?: string;
}

// ============================================================================
// INTERVENTION TYPES
// ============================================================================

export interface Intervention extends BaseEntity {
  title: string;
  description: string;
  type: string; // development_scheme, public_work, emergency, special_project
  status: Status;
  progress?: number;
  budget?: number;
  start_date: string;
  end_date?: string;
  departments: Department[];
  activities?: Activity[];
  attachments?: Attachment[];
}

export interface Activity extends BaseEntity {
  intervention_id?: number;
  title: string;
  description: string;
  status: Status;
  progress?: number;
  department_id?: number;
  department?: Department;
  replies?: Reply[];
}

// ============================================================================
// SUMMARY TYPES
// ============================================================================

export interface Summary extends BaseEntity {
  reference_number: string;
  subject: string;
  description?: string;
  created_date: string;
  initiator_department_name?: string;
  status: Status;
  tasks?: Task[];
  attachments?: SummaryAttachment[];
}

export interface SummaryAttachment extends BaseEntity {
  summary_id: number;
  file_path: string;
  file_title: string;
}

// ============================================================================
// ISSUE TYPES (HCM Public Affairs)
// ============================================================================

export interface Issue extends BaseEntity {
  title: string;
  description: string;
  type: string;
  priority: Priority;
  status: Status;
  department_id: number;
  department?: Department;
  reported_by?: string;
  reported_date: string;
  deadline?: string;
  resolution?: string;
  resolved_date?: string;
  replies?: Reply[];
}

// ============================================================================
// PTF (Provincial Task Force) TYPES
// ============================================================================

export interface PtfIssue extends BaseEntity {
  title: string;
  description: string;
  issue_date: string;
  status: Status;
  priority: Priority;
  departments: Department[];
  district_id?: number;
  district?: District;
  initial_response?: string;
  initial_response_date?: string;
  final_response?: string;
  final_response_date?: string;
  deadline?: string;
  dc_remarks?: string;
  attachments?: Attachment[];
}

// ============================================================================
// PUBLIC DAY TYPES
// ============================================================================

export interface PublicDay extends BaseEntity {
  event_date: string;
  venue: string;
  description?: string;
  applications?: PublicDayApplication[];
}

export interface PublicDayApplication extends BaseEntity {
  public_day_id: number;
  applicant_name: string;
  applicant_contact?: string;
  application_type: string;
  description: string;
  department_id?: number;
  department?: Department;
  status: Status;
  resolution?: string;
  resolved_date?: string;
}

// ============================================================================
// COMPLAINT TYPES
// ============================================================================

export interface Complaint extends BaseEntity {
  complaint_number: string;
  complainant_name: string;
  complainant_contact?: string;
  complaint_date: string;
  description: string;
  department_id: number;
  department?: Department;
  status: Status;
  priority: Priority;
  investigation_details?: string;
  response?: string;
  response_date?: string;
  resolved_date?: string;
}

// ============================================================================
// COMMON TYPES
// ============================================================================

export interface Reply extends BaseEntity {
  replyable_id: number;
  replyable_type: string; // polymorphic
  user_id: number;
  user?: User;
  department_id?: number;
  department?: Department;
  reply: string;
  status?: Status;
  progress?: number;
  attachments?: Attachment[];
}

export interface Task extends BaseEntity {
  title: string;
  description?: string;
  progress: number;
  timeline?: string;
  deadline?: string;
  status: Status;
  taskable_id: number;
  taskable_type: string; // polymorphic
  departments?: Department[];
  replies?: Reply[];
  comments?: Comment[];
}

export interface Comment extends BaseEntity {
  task_id: number;
  user_id: number;
  user?: User;
  comment: string;
}

export interface Attachment extends BaseEntity {
  attachable_id: number;
  attachable_type: string; // polymorphic
  file_name: string;
  file_path: string;
  file_size?: number;
  file_type?: string;
  uploaded_by?: number;
  user?: User;
}

export interface Tag extends BaseEntity {
  name: string;
  slug: string;
  color?: string;
}

// ============================================================================
// ACTIVITY LOG TYPES
// ============================================================================

export interface ActivityLog extends BaseEntity {
  user_id: number;
  user?: User;
  action: string;
  module: string;
  entity_id?: number;
  entity_type?: string;
  description?: string;
  ip_address?: string;
  user_agent?: string;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface Notification extends BaseEntity {
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  read_at?: string;
  action_url?: string;
}

// ============================================================================
// BOARD MEETING TYPES
// ============================================================================

export interface BoardMeeting extends Meeting {
  board_id: number;
  board?: Board;
  board_type: 'public' | 'private' | 'government';
  members?: BoardMember[];
  agenda_points?: AgendaPoint[];
}

export interface Board extends BaseEntity {
  name: string;
  description?: string;
  board_type: 'public' | 'private' | 'government';
  department_id?: number;
  department?: Department;
}

export interface BoardMember extends BaseEntity {
  board_id: number;
  user_id?: number;
  user?: User;
  name: string;
  designation?: string;
  member_type: 'chairman' | 'member' | 'secretary' | 'observer';
  is_active: boolean;
}

// ============================================================================
// SENATE MEETING TYPES
// ============================================================================

export interface SenateMeeting extends Meeting {
  university?: string;
  senate_type?: string;
  members?: User[];
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
  message?: string;
  success: boolean;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  success: false;
}

// ============================================================================
// FILTER & QUERY TYPES
// ============================================================================

export interface BaseFilters {
  search?: string;
  department_id?: number;
  status?: Status;
  priority?: Priority;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface MeetingFilters extends BaseFilters {
  meeting_type?: MeetingType;
}

export interface ReportFilters extends BaseFilters {
  report_type?: string;
  module?: string;
}

// ============================================================================
// REPORT TYPES
// ============================================================================

export interface Report {
  id: string;
  title: string;
  type: string;
  generated_at: string;
  generated_by?: User;
  filters?: any;
  data?: any;
}

export interface DepartmentReport {
  department: Department;
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  overdue_tasks: number;
  on_target: number;
  off_target: number;
  completion_rate: number;
  modules: {
    record_notes: ModuleStats;
    announcements: ModuleStats;
    directives: ModuleStats;
    sectoral_meetings: ModuleStats;
    board_meetings: ModuleStats;
    cm_remarks: ModuleStats;
    pti: ModuleStats;
    khushhal_kpk: ModuleStats;
  };
}

export interface ModuleStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  on_target: number;
  off_target: number;
}

// ============================================================================
// DASHBOARD TYPES
// ============================================================================

export interface DashboardStats {
  total_meetings: number;
  total_minutes: number;
  total_announcements: number;
  total_directives: number;
  total_departments: number;
  pending_items: number;
  overdue_items: number;
  completed_this_month: number;
  recent_activities: ActivityLog[];
  department_performance?: DepartmentReport[];
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface CreateMeetingForm {
  meeting_type: MeetingType;
  title: string;
  description?: string;
  meeting_date: string;
  venue?: string;
}

export interface CreateMinuteForm {
  meeting_id: number;
  subject: string;
  description: string;
  decision?: string;
  departments: number[];
  deadline?: string;
  reference_number?: string;
}

export interface CreateAnnouncementForm {
  title: string;
  description: string;
  announcement_date: string;
  departments: number[];
}

export interface CreateDirectiveForm {
  title: string;
  description: string;
  directive_date: string;
  reference_number?: string;
  departments: number[];
  priority?: Priority;
  deadline?: string;
}

export interface ReplyForm {
  reply: string;
  status?: Status;
  progress?: number;
  attachments?: File[];
}

// ============================================================================
// FILE UPLOAD TYPES
// ============================================================================

export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  url?: string;
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  url: string;
  uploaded_at: string;
}

// ============================================================================
// CHART DATA TYPES
// ============================================================================

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
  }[];
}

export interface TimelineData {
  date: string;
  on_target: number;
  off_target: number;
  overdue: number;
  completed: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncData<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export type FormState<T> = {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
};
