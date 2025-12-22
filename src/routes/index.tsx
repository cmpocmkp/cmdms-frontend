/**
 * Route Configuration
 * All application routes defined here
 */

import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { UserRole } from '../types';

// Lazy load pages for better performance
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const DepartmentDashboard = lazy(() => import('../pages/department/Dashboard'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Admin modules
const UsersList = lazy(() => import('../pages/admin/Users/UsersList'));
const AddUser = lazy(() => import('../pages/admin/Users/AddUser'));
const EditUser = lazy(() => import('../pages/admin/Users/EditUser'));
const UserSettings = lazy(() => import('../pages/admin/Settings/UserSettings'));
const AssignDepartments = lazy(() => import('../pages/admin/Users/AssignDepartments'));
const AssignPermissions = lazy(() => import('../pages/admin/Users/AssignPermissions'));
const ApiTokens = lazy(() => import('../pages/admin/Users/ApiTokens'));
const ExportUsers = lazy(() => import('../pages/admin/Users/ExportUsers'));
const ActivityLogsList = lazy(() => import('../pages/admin/ActivityLogs/ActivityLogsList'));
const TagsList = lazy(() => import('../pages/admin/Tags/TagsList'));
const AddTag = lazy(() => import('../pages/admin/Tags/AddTag'));
const EditTag = lazy(() => import('../pages/admin/Tags/EditTag'));
const DepartmentsList = lazy(() => import('../pages/admin/Departments/DepartmentsList'));
const AddDepartment = lazy(() => import('../pages/admin/Departments/AddDepartment'));
const EditDepartment = lazy(() => import('../pages/admin/Departments/EditDepartment'));
const LogViewerPage = lazy(() => import('../pages/admin/LogViewer/LogViewerPage'));

// New modules - Minutes
const MinutesList = lazy(() => import('../pages/admin/Minutes/MinutesList'));
const AddMinute = lazy(() => import('../pages/admin/Minutes/AddMinute'));
const EditMinute = lazy(() => import('../pages/admin/Minutes/EditMinute'));
const MinuteReplies = lazy(() => import('../pages/admin/Minutes/MinuteReplies'));

// Directives
const DirectivesList = lazy(() => import('../pages/admin/Directives/DirectivesList'));
const AddDirective = lazy(() => import('../pages/admin/Directives/AddDirective'));
const DirectiveDepartments = lazy(() => import('../pages/admin/Directives/DirectiveDepartments'));
const DirectiveReplies = lazy(() => import('../pages/admin/Directives/DirectiveReplies'));

// Announcements
const AnnouncementsList = lazy(() => import('../pages/admin/Announcements/AnnouncementsList'));
const AddAnnouncement = lazy(() => import('../pages/admin/Announcements/AddAnnouncement'));
const EditAnnouncement = lazy(() => import('../pages/admin/Announcements/EditAnnouncement'));
const AnnouncementReplies = lazy(() => import('../pages/admin/Announcements/AnnouncementReplies'));

// CM Remarks
const CMRemarksList = lazy(() => import('../pages/admin/CMRemarks/CMRemarksList'));
const AddCMRemark = lazy(() => import('../pages/admin/CMRemarks/AddCMRemark'));
const EditCMRemark = lazy(() => import('../pages/admin/CMRemarks/EditCMRemark'));
const EditCMRemarkDepartments = lazy(() => import('../pages/admin/CMRemarks/EditCMRemarkDepartments'));
const CMRemarkReplies = lazy(() => import('../pages/admin/CMRemarks/CMRemarkReplies'));

// Sectorial Meetings
const SectorialMeetingsList = lazy(() => import('../pages/admin/SectorialMeetings/SectorialMeetingsList'));
const AddSectorialMeeting = lazy(() => import('../pages/admin/SectorialMeetings/AddSectorialMeeting'));
const EditSectorialMeeting = lazy(() => import('../pages/admin/SectorialMeetings/EditSectorialMeeting'));
const SectorialAgendaPoints = lazy(() => import('../pages/admin/SectorialMeetings/SectorialAgendaPoints'));
const AddSectorialAgendaPoint = lazy(() => import('../pages/admin/SectorialAgendaPoints/AddSectorialAgendaPoint'));
const EditSectorialAgendaPoint = lazy(() => import('../pages/admin/SectorialAgendaPoints/EditSectorialAgendaPoint'));
const SectorialAgendaPointRelatedDepartments = lazy(() => import('../pages/admin/SectorialAgendaPoints/SectorialAgendaPointRelatedDepartments'));
const SectorialAgendaPointReplies = lazy(() => import('../pages/admin/SectorialAgendaPoints/SectorialAgendaPointReplies'));

// Schemes
const SchemesList = lazy(() => import('../pages/admin/Schemes/SchemesList'));
const AddScheme = lazy(() => import('../pages/admin/Schemes/AddScheme'));
const EditScheme = lazy(() => import('../pages/admin/Schemes/EditScheme'));

// Board Meetings
const BoardMeetingsList = lazy(() => import('../pages/admin/BoardMeetings/BoardMeetingsList'));
const AddBoardMeeting = lazy(() => import('../pages/admin/BoardMeetings/AddBoardMeeting'));
const EditBoardMeeting = lazy(() => import('../pages/admin/BoardMeetings/EditBoardMeeting'));
const ShowBoardMeeting = lazy(() => import('../pages/admin/BoardMeetings/ShowBoardMeeting'));
const BoardAgendaPoints = lazy(() => import('../pages/admin/BoardMeetings/BoardAgendaPoints'));

// Board Acts
const BoardActsList = lazy(() => import('../pages/admin/BoardActs/BoardActsList'));
const AddBoardAct = lazy(() => import('../pages/admin/BoardActs/AddBoardAct'));
const EditBoardAct = lazy(() => import('../pages/admin/BoardActs/EditBoardAct'));
const ShowBoardAct = lazy(() => import('../pages/admin/BoardActs/ShowBoardAct'));

// Board Members
const BoardMembersList = lazy(() => import('../pages/admin/BoardMembers/BoardMembersList'));
const AddBoardMember = lazy(() => import('../pages/admin/BoardMembers/AddBoardMember'));
const EditBoardMember = lazy(() => import('../pages/admin/BoardMembers/EditBoardMember'));

// Agenda Points (for Board Meetings)
const AddAgendaPoint = lazy(() => import('../pages/admin/AgendaPoints/AddAgendaPoint'));
const EditAgendaPoint = lazy(() => import('../pages/admin/AgendaPoints/EditAgendaPoint'));

// Board Agenda Point Replies
const BoardAgendaPointReplies = lazy(() => import('../pages/admin/BoardAgendaPoints/BoardAgendaPointReplies'));

// Funds Distribution Modules
const AnnualSchemesList = lazy(() => import('../pages/admin/Funds/AnnualSchemes/AnnualSchemesList'));
const AddAnnualScheme = lazy(() => import('../pages/admin/Funds/AnnualSchemes/AddAnnualScheme'));
const EditAnnualScheme = lazy(() => import('../pages/admin/Funds/AnnualSchemes/EditAnnualScheme'));
const ShowAnnualScheme = lazy(() => import('../pages/admin/Funds/AnnualSchemes/ShowAnnualScheme'));
const FundDistributionsIndex = lazy(() => import('../pages/admin/Funds/Distributions/FundDistributionsIndex'));
const EditFundDistribution = lazy(() => import('../pages/admin/Funds/Distributions/EditFundDistribution'));
const DistributedSchemesList = lazy(() => import('../pages/admin/Funds/Distributions/DistributedSchemesList'));
const CandidateDistributedFundReport = lazy(() => import('../pages/admin/Funds/Reports/CandidateDistributedFundReport'));

// Review Meetings
const ReviewMeetingsList = lazy(() => import('../pages/admin/ReviewMeetings/ReviewMeetingsList'));
const AddReviewMeeting = lazy(() => import('../pages/admin/ReviewMeetings/AddReviewMeeting'));
const EditReviewMeeting = lazy(() => import('../pages/admin/ReviewMeetings/EditReviewMeeting'));

// Candidate Requests (MNA/MPA Requests)
const CandidateRequestsList = lazy(() => import('../pages/admin/CandidateRequests/CandidateRequestsList'));
const AddCandidateRequest = lazy(() => import('../pages/admin/CandidateRequests/AddCandidateRequest'));
const EditCandidateRequest = lazy(() => import('../pages/admin/CandidateRequests/EditCandidateRequest'));

// Officer Departments
const OfficerDepartmentsList = lazy(() => import('../pages/admin/OfficerDepartments/OfficerDepartmentsList'));
const AddOfficerDepartment = lazy(() => import('../pages/admin/OfficerDepartments/AddOfficerDepartment'));
const EditOfficerDepartment = lazy(() => import('../pages/admin/OfficerDepartments/EditOfficerDepartment'));

// Officers
const OfficersList = lazy(() => import('../pages/admin/Officers/OfficersList'));
const AddOfficer = lazy(() => import('../pages/admin/Officers/AddOfficer'));
const EditOfficer = lazy(() => import('../pages/admin/Officers/EditOfficer'));

// Candidates
const CandidatesList = lazy(() => import('../pages/admin/Candidates/CandidatesList'));
const AddCandidate = lazy(() => import('../pages/admin/Candidates/AddCandidate'));
const EditCandidate = lazy(() => import('../pages/admin/Candidates/EditCandidate'));

// MNA/MPA Posting Recommendation
const MNAMPAPostingRecommendation = lazy(() => import('../pages/admin/Reports/MNAMPAPostingRecommendation'));

// Reports
const CabinetMeetingsReport = lazy(() => import('../pages/admin/Reports/CabinetMeetingsReport'));
const CabinetByStatusReport = lazy(() => import('../pages/admin/Reports/CabinetByStatusReport'));
const CabinetDetailReport = lazy(() => import('../pages/admin/Reports/CabinetDetailReport'));
const CabinetDepartmentWiseReport = lazy(() => import('../pages/admin/Reports/CabinetDepartmentWiseReport'));
const RecordNotesDetailList = lazy(() => import('../pages/admin/Reports/RecordNotesDetailList'));
const BoardMeetingsReport = lazy(() => import('../pages/admin/Reports/BoardMeetingsReport'));
const BoardMeetingDetailReport = lazy(() => import('../pages/admin/Reports/BoardMeetingDetailReport'));
const BoardMeetingFilterReport = lazy(() => import('../pages/admin/Reports/BoardMeetingFilterReport'));
const BoardMeetingsUpcomingReport = lazy(() => import('../pages/admin/Reports/BoardMeetingsUpcomingReport'));
const BoardActsReport = lazy(() => import('../pages/admin/Reports/BoardActsReport'));
const BoardActsShowReport = lazy(() => import('../pages/admin/Reports/BoardActsShowReport'));
const BoardActsUpcomingReport = lazy(() => import('../pages/admin/Reports/BoardActsUpcomingReport'));
const SummariesForCMReport = lazy(() => import('../pages/admin/Reports/SummariesForCMReport'));
const SummariesForCMDetailReport = lazy(() => import('../pages/admin/Reports/SummariesForCMDetailReport'));
const InaugurationsReport = lazy(() => import('../pages/admin/Reports/InaugurationsReport'));
const ReviewMeetingsReport = lazy(() => import('../pages/admin/Reports/ReviewMeetingsReport'));
const ReviewMeetingsDSWiseReport = lazy(() => import('../pages/admin/Reports/ReviewMeetingsDSWiseReport'));
const KhushhaalKPKTasksReport = lazy(() => import('../pages/admin/Reports/KhushhaalKPKTasksReport'));
const KPIDataReports = lazy(() => import('../pages/admin/Reports/KPIDataReports'));
const DCKPIsDataFilter = lazy(() => import('../pages/admin/Reports/DCKPIsDataFilter'));
const DPOsKPIsDataFilter = lazy(() => import('../pages/admin/Reports/DPOsKPIsDataFilter'));
const DepartmentsKPIsDataFilter = lazy(() => import('../pages/admin/Reports/DepartmentsKPIsDataFilter'));
const DCInspectionDetailsReport = lazy(() => import('../pages/admin/Reports/DCInspectionDetailsReport'));
const PMRUMetingsReport = lazy(() => import('../pages/admin/Reports/PMRUMetingsReport'));
const PMRUSubtasksDetail = lazy(() => import('../pages/admin/Reports/PMRUSubtasksDetail'));
const FilterRecordNotesReport = lazy(() => import('../pages/admin/Reports/FilterRecordNotesReport'));
const PDFDashboard = lazy(() => import('../pages/admin/PDF/PDFDashboard'));
const PTFDashboardReport = lazy(() => import('../pages/admin/Reports/PTFDashboardReport'));
const PTFMeetingsReport = lazy(() => import('../pages/admin/Reports/PTFMeetingsReport'));
const PTFDepartmentWiseReport = lazy(() => import('../pages/admin/Reports/PTFDepartmentWiseReport'));
const PTFDistrictWiseReport = lazy(() => import('../pages/admin/Reports/PTFDistrictWiseReport'));
const PTFDistrictDetailReport = lazy(() => import('../pages/admin/Reports/PTFDistrictDetailReport'));
const PTFDistrictLatestReport = lazy(() => import('../pages/admin/Reports/PTFDistrictLatestReport'));
const PTFIssueList = lazy(() => import('../pages/admin/PTF/PTFIssueList'));
const PTFIssueDetail = lazy(() => import('../pages/admin/PTF/PTFIssueDetail'));
const RecordnotesUpdatesReport = lazy(() => import('../pages/admin/Reports/RecordnotesUpdatesReport'));
const RecordnotesUpdatesDetailReport = lazy(() => import('../pages/admin/Reports/RecordnotesUpdatesDetailReport'));
const RecordnotesComparisionReport = lazy(() => import('../pages/admin/Reports/RecordnotesComparisionReport'));

// Khushhal Khyber Pakhtunkhwa
const KhushhalKPKList = lazy(() => import('../pages/admin/KhushhalKPK/KhushhalKPKList'));
const AddKhushhalKPK = lazy(() => import('../pages/admin/KhushhalKPK/AddKhushhalKPK'));
const EditKhushhalKPK = lazy(() => import('../pages/admin/KhushhalKPK/EditKhushhalKPK'));
const ShowKhushhalKPK = lazy(() => import('../pages/admin/KhushhalKPK/ShowKhushhalKPK'));
const KhushhalKPKReplies = lazy(() => import('../pages/admin/Replies/KhushhalKPKReplies'));
const EditKhushhalProgress = lazy(() => import('../pages/admin/KhushhalProgress/EditKhushhalProgress'));

// Inaugurations
const InaugurationsList = lazy(() => import('../pages/admin/Inaugurations/InaugurationsList'));
const AddInauguration = lazy(() => import('../pages/admin/Inaugurations/AddInauguration'));
const EditInauguration = lazy(() => import('../pages/admin/Inaugurations/EditInauguration'));

// PTIs
const PTIsList = lazy(() => import('../pages/admin/PTIs/PTIsList'));
const AddPTI = lazy(() => import('../pages/admin/PTIs/AddPTI'));
const EditPTI = lazy(() => import('../pages/admin/PTIs/EditPTI'));
const ShowPTI = lazy(() => import('../pages/admin/PTIs/ShowPTI'));

// Tasks
const TaskComments = lazy(() => import('../pages/admin/Tasks/TaskComments'));
const TaskShow = lazy(() => import('../pages/admin/Tasks/TaskShow'));

// Summaries
const SummariesList = lazy(() => import('../pages/admin/Summaries/SummariesList'));
const ShowSummary = lazy(() => import('../pages/admin/Summaries/ShowSummary'));

// Trackers
const TrackersList = lazy(() => import('../pages/admin/Trackers/TrackersList'));
const ShowTracker = lazy(() => import('../pages/admin/Trackers/ShowTracker'));

// Admin layout
const AdminLayout = lazy(() => import('../components/shared/layout/AdminLayout'));
const DepartmentLayout = lazy(() => import('../components/shared/layout/DepartmentLayout'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
);

/**
 * Wrap lazy-loaded components with Suspense
 */
const withSuspense = (Component: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

/**
 * Application Router
 */
export const router = createBrowserRouter([
  // Public routes
  {
    path: '/login',
    element: withSuspense(LoginPage),
  },
  
  // Root redirect
  {
    path: '/',
    element: <Navigate to="/admin/report/department-wise-dashboard" replace />,
  },
  
  // Admin routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CM, UserRole.CS]}>
        {withSuspense(AdminLayout)}
      </ProtectedRoute>
    ),
    children: [
      // Redirect old dashboard route to new route
      {
        path: 'dashboard',
        element: <Navigate to="/admin/report/department-wise-dashboard" replace />,
      },
      // Department-wise dashboard (main dashboard)
      {
        path: 'report/department-wise-dashboard',
        element: withSuspense(AdminDashboard),
      },
      
      // Admin Management Routes
      {
        path: 'users',
        element: withSuspense(UsersList),
      },
      {
        path: 'users/create',
        element: withSuspense(AddUser),
      },
      {
        path: 'users/edit/:id',
        element: withSuspense(EditUser),
      },
      {
        path: 'userdepartments/edit/:id',
        element: withSuspense(AssignDepartments),
      },
      {
        path: 'userpermission/edit/:id',
        element: withSuspense(AssignPermissions),
      },
      {
        path: 'users/:id/tokens',
        element: withSuspense(ApiTokens),
      },
      {
        path: 'users/export',
        element: withSuspense(ExportUsers),
      },
      {
        path: 'settings',
        element: withSuspense(UserSettings),
      },
      {
        path: 'activitylogs',
        element: withSuspense(ActivityLogsList),
      },
      {
        path: 'tags',
        element: withSuspense(TagsList),
      },
      {
        path: 'tags/create',
        element: withSuspense(AddTag),
      },
      {
        path: 'tags/edit/:id',
        element: withSuspense(EditTag),
      },
      {
        path: 'departments',
        element: withSuspense(DepartmentsList),
      },
      {
        path: 'departments/create',
        element: withSuspense(AddDepartment),
      },
      {
        path: 'departments/edit/:id',
        element: withSuspense(EditDepartment),
      },
      
      // Log Viewer (Laravel package)
      {
        path: 'log-viewer',
        element: withSuspense(LogViewerPage),
      },
      
      // Minutes (Record Notes) Module
      {
        path: 'recordnotes',
        element: withSuspense(MinutesList),
      },
      {
        path: 'recordnotes/add',
        element: withSuspense(AddMinute),
      },
      {
        path: 'recordnotes/edit/:id',
        element: withSuspense(EditMinute),
      },
      {
        path: 'replies/minutes/:id',
        element: withSuspense(MinuteReplies),
      },
      
      // Directives Module
      {
        path: 'directives',
        element: withSuspense(DirectivesList),
      },
      {
        path: 'directives/add',
        element: withSuspense(AddDirective),
      },
      {
        path: 'directives/:id/departments',
        element: withSuspense(DirectiveDepartments),
      },
      {
        path: 'replies/directive/:id',
        element: withSuspense(DirectiveReplies),
      },
      
      // Announcements Module
      {
        path: 'announcements',
        element: withSuspense(AnnouncementsList),
      },
      {
        path: 'announcements/add',
        element: withSuspense(AddAnnouncement),
      },
      {
        path: 'announcements/edit/:id',
        element: withSuspense(EditAnnouncement),
      },
      {
        path: 'replies/announcements/:id',
        element: withSuspense(AnnouncementReplies),
      },
      
      // CM Remarks Module
      {
        path: 'cmremarks',
        element: withSuspense(CMRemarksList),
      },
      {
        path: 'cmremarks/add',
        element: withSuspense(AddCMRemark),
      },
      {
        path: 'cmremarks/edit/:id',
        element: withSuspense(EditCMRemark),
      },
      {
        path: 'cmremarks/departments/:id',
        element: withSuspense(EditCMRemarkDepartments),
      },
      {
        path: 'cmremarks/replies/:id',
        element: withSuspense(CMRemarkReplies),
      },
      
      // Sectorial Meetings Module
      {
        path: 'sectorialmeetings',
        element: withSuspense(SectorialMeetingsList),
      },
      {
        path: 'sectorialmeetings/add',
        element: withSuspense(AddSectorialMeeting),
      },
      {
        path: 'sectorialmeetings/edit/:id',
        element: withSuspense(EditSectorialMeeting),
      },
      {
        path: 'sectorialmeetings/:id/agenda-points',
        element: withSuspense(SectorialAgendaPoints),
      },
      {
        path: 'sectorialagendapoints/add',
        element: withSuspense(AddSectorialAgendaPoint),
      },
      {
        path: 'sectorialagendapoints/edit/:id',
        element: withSuspense(EditSectorialAgendaPoint),
      },
      {
        path: 'sectorialagendapoints/:id/related-departments',
        element: withSuspense(SectorialAgendaPointRelatedDepartments),
      },
      {
        path: 'replies/sectorial/agenda-point/:id',
        element: withSuspense(SectorialAgendaPointReplies),
      },
      
      // Schemes Module
      {
        path: 'schemes',
        element: withSuspense(SchemesList),
      },
      {
        path: 'schemes/add',
        element: withSuspense(AddScheme),
      },
      {
        path: 'schemes/edit/:id',
        element: withSuspense(EditScheme),
      },
      
      // Inaugurations Module
      {
        path: 'inaugurations',
        element: withSuspense(InaugurationsList),
      },
      {
        path: 'inaugurations/add',
        element: withSuspense(AddInauguration),
      },
      {
        path: 'inaugurations/edit/:id',
        element: withSuspense(EditInauguration),
      },
      
      // Board Meetings Module
      {
        path: 'boardmeetings',
        element: withSuspense(BoardMeetingsList),
      },
      {
        path: 'boardmeetings/add',
        element: withSuspense(AddBoardMeeting),
      },
      {
        path: 'boardmeetings/edit/:id',
        element: withSuspense(EditBoardMeeting),
      },
      {
        path: 'boardmeetings/show/:id',
        element: withSuspense(ShowBoardMeeting),
      },
      {
        path: 'boardmeetings/:boardId/agenda-points/:meetingId',
        element: withSuspense(BoardAgendaPoints),
      },
      
      // Board Acts Module
      {
        path: 'boardacts',
        element: withSuspense(BoardActsList),
      },
      {
        path: 'boardacts/add',
        element: withSuspense(AddBoardAct),
      },
      {
        path: 'boardacts/edit/:id',
        element: withSuspense(EditBoardAct),
      },
      {
        path: 'boardacts/show/:id',
        element: withSuspense(ShowBoardAct),
      },
      
      // Board Members Module
      {
        path: 'boardmembers',
        element: withSuspense(BoardMembersList),
      },
      {
        path: 'boardmembers/add',
        element: withSuspense(AddBoardMember),
      },
      {
        path: 'boardmembers/edit/:id',
        element: withSuspense(EditBoardMember),
      },
      
      // Agenda Points (for Board Meetings)
      {
        path: 'agendapoints/add',
        element: withSuspense(AddAgendaPoint),
      },
      {
        path: 'agendapoints/edit/:id',
        element: withSuspense(EditAgendaPoint),
      },
      
      // Board Agenda Point Replies
      {
        path: 'replies/board/agenda-point/:id',
        element: withSuspense(BoardAgendaPointReplies),
      },
      
      // Funds Distribution Module
      {
        path: 'funds/annualschemes',
        element: withSuspense(AnnualSchemesList),
      },
      {
        path: 'funds/annualschemes/add',
        element: withSuspense(AddAnnualScheme),
      },
      {
        path: 'funds/annualschemes/edit/:id',
        element: withSuspense(EditAnnualScheme),
      },
      {
        path: 'funds/annualschemes/show/:id',
        element: withSuspense(ShowAnnualScheme),
      },
      {
        path: 'funds/distributions',
        element: withSuspense(FundDistributionsIndex),
      },
      {
        path: 'funds/distributions/edit',
        element: withSuspense(EditFundDistribution),
      },
      {
        path: 'funds/distributions/distributed-schemes',
        element: withSuspense(DistributedSchemesList),
      },
      {
        path: 'candidate/distributed-fund/report',
        element: withSuspense(CandidateDistributedFundReport),
      },
      
      // Review Meetings
      {
        path: 'reviewmeetings',
        element: withSuspense(ReviewMeetingsList),
      },
      {
        path: 'reviewmeetings/add',
        element: withSuspense(AddReviewMeeting),
      },
      {
        path: 'reviewmeetings/edit/:id',
        element: withSuspense(EditReviewMeeting),
      },
      
      // Candidate Requests (MNA/MPA Requests)
      {
        path: 'candidaterequests',
        element: withSuspense(CandidateRequestsList),
      },
      {
        path: 'candidaterequests/add',
        element: withSuspense(AddCandidateRequest),
      },
      {
        path: 'candidaterequests/edit/:id',
        element: withSuspense(EditCandidateRequest),
      },
      
      // Officer Departments
      {
        path: 'officerdepartments',
        element: withSuspense(OfficerDepartmentsList),
      },
      {
        path: 'officerdepartments/add',
        element: withSuspense(AddOfficerDepartment),
      },
      {
        path: 'officerdepartments/edit/:id',
        element: withSuspense(EditOfficerDepartment),
      },
      
      // Officers
      {
        path: 'officers',
        element: withSuspense(OfficersList),
      },
      {
        path: 'officers/add',
        element: withSuspense(AddOfficer),
      },
      {
        path: 'officers/edit/:id',
        element: withSuspense(EditOfficer),
      },
      
      // Candidates
      {
        path: 'candidates',
        element: withSuspense(CandidatesList),
      },
      {
        path: 'candidates/add',
        element: withSuspense(AddCandidate),
      },
      {
        path: 'candidates/edit/:id',
        element: withSuspense(EditCandidate),
      },
      
      // MNA/MPA Posting Recommendation
      {
        path: 'mna-mpa/posting/recommendation',
        element: withSuspense(MNAMPAPostingRecommendation),
      },
      
      // Khushhal Khyber Pakhtunkhwa
      {
        path: 'khushhalkpk',
        element: withSuspense(KhushhalKPKList),
      },
      {
        path: 'khushhalkpk/add',
        element: withSuspense(AddKhushhalKPK),
      },
      {
        path: 'khushhalkpk/edit/:id',
        element: withSuspense(EditKhushhalKPK),
      },
      {
        path: 'khushhalkpk/show/:id',
        element: withSuspense(ShowKhushhalKPK),
      },
      {
        path: 'replies/khushhalkpk/:id',
        element: withSuspense(KhushhalKPKReplies),
      },
      {
        path: 'khushhalprogress/edit/:id',
        element: withSuspense(EditKhushhalProgress),
      },
      
      // PTIs KP Module
      {
        path: 'ptis',
        element: withSuspense(PTIsList),
      },
      {
        path: 'ptis/create',
        element: withSuspense(AddPTI),
      },
      {
        path: 'ptis/:id',
        element: withSuspense(ShowPTI),
      },
      {
        path: 'ptis/edit/:id',
        element: withSuspense(EditPTI),
      },
      
      // Tasks Module
      {
        path: 'tasks/:taskId',
        element: withSuspense(TaskShow),
      },
      {
        path: 'tasks/:taskId/comments',
        element: withSuspense(TaskComments),
      },
      
      // Summaries for CM Module
      {
        path: 'summaries',
        element: withSuspense(SummariesList),
      },
      {
        path: 'summaries/show/:id',
        element: withSuspense(ShowSummary),
      },
      
      // Trackers Module
      {
        path: 'trackers',
        element: withSuspense(TrackersList),
      },
      {
        path: 'trackers/show/:id',
        element: withSuspense(ShowTracker),
      },
      {
        path: 'trackers/add',
        element: withSuspense(TrackersList), // TODO: Create AddTracker component
      },
      {
        path: 'trackers/edit/:id',
        element: withSuspense(TrackersList), // TODO: Create EditTracker component
      },
      
      // Reports Routes
      {
        path: 'report/cabinet-meetings',
        element: withSuspense(CabinetMeetingsReport),
      },
      {
        path: 'report/cabinet-meetings/by-status',
        element: withSuspense(CabinetByStatusReport),
      },
      {
        path: 'report/cabinet-meetings/detail/:deptid/:stat',
        element: withSuspense(CabinetDetailReport),
      },
      {
        path: 'report/recordnotes/detail_list/:meeting/:minute',
        element: withSuspense(RecordNotesDetailList),
      },
      {
        path: 'report/department-wise/cabinet-meeting/decisions',
        element: withSuspense(CabinetDepartmentWiseReport),
      },
      {
        path: 'report/board/meetings',
        element: withSuspense(BoardMeetingsReport),
      },
      {
        path: 'report/board/meetings/detail/:department_id/:decision_status',
        element: withSuspense(BoardMeetingDetailReport),
      },
      {
        path: 'report/search/board/meetings',
        element: withSuspense(BoardMeetingFilterReport),
      },
      {
        path: 'report/board/meetings/upcoming',
        element: withSuspense(BoardMeetingsUpcomingReport),
      },
      {
        path: 'report/board/acts',
        element: withSuspense(BoardActsReport),
      },
      {
        path: 'report/board/acts/show/:id',
        element: withSuspense(BoardActsShowReport),
      },
      {
        path: 'report/board/acts/upcoming',
        element: withSuspense(BoardActsUpcomingReport),
      },
      {
        path: 'report/summaries/summary',
        element: withSuspense(SummariesForCMReport),
      },
      {
        path: 'report/summaries/detail',
        element: withSuspense(SummariesForCMDetailReport),
      },
      {
        path: 'report/inaugurations',
        element: withSuspense(InaugurationsReport),
      },
      {
        path: 'report/review-meetings',
        element: withSuspense(ReviewMeetingsReport),
      },
      {
        path: 'report/ds-wise-review-meetings',
        element: withSuspense(ReviewMeetingsDSWiseReport),
      },
      {
        path: 'report/khushhalkpk-tasks',
        element: withSuspense(KhushhaalKPKTasksReport),
      },
      {
        path: 'kpidata',
        element: withSuspense(KPIDataReports),
      },
      {
        path: 'kpidata/show',
        element: withSuspense(DCKPIsDataFilter),
      },
      {
        path: 'kpidata/dpos',
        element: withSuspense(DPOsKPIsDataFilter),
      },
      {
        path: 'kpidata/departments',
        element: withSuspense(DepartmentsKPIsDataFilter),
      },
      {
        path: 'report/dc-inspection',
        element: withSuspense(DCInspectionDetailsReport),
      },
      {
        path: 'report/pmru-meetings',
        element: withSuspense(PMRUMetingsReport),
      },
      {
        path: 'report/subtasks/of-department/pmru-meeting/:department',
        element: withSuspense(PMRUSubtasksDetail),
      },
      {
        path: 'report/filter-recordnotes',
        element: withSuspense(FilterRecordNotesReport),
      },
      {
        path: 'pdf/dashboard',
        element: withSuspense(PDFDashboard),
      },
      {
        path: 'report/ptf/index',
        element: withSuspense(PTFDashboardReport),
      },
      {
        path: 'report/ptf/meetings',
        element: withSuspense(PTFMeetingsReport),
      },
      {
        path: 'report/ptf/department-wise',
        element: withSuspense(PTFDepartmentWiseReport),
      },
      {
        path: 'report/ptf/district-wise',
        element: withSuspense(PTFDistrictWiseReport),
      },
      {
        path: 'ptfs/report-district-detail',
        element: withSuspense(PTFDistrictDetailReport),
      },
      {
        path: 'ptfs/report-district-latest',
        element: withSuspense(PTFDistrictLatestReport),
      },
      {
        path: 'ptf/list-issue-all',
        element: withSuspense(PTFIssueList),
      },
      {
        path: 'ptf/details/:id',
        element: withSuspense(PTFIssueDetail),
      },
      {
        path: 'report/recordnotes-updates',
        element: withSuspense(RecordnotesUpdatesReport),
      },
      {
        path: 'report/recordnotes-updates-detail/:deptId/:status',
        element: withSuspense(RecordnotesUpdatesDetailReport),
      },
      {
        path: 'report/recordnotes-comparision',
        element: withSuspense(RecordnotesComparisionReport),
      },
    ],
  },
  
  // Department routes
  {
    path: '/department',
    element: (
      <ProtectedRoute allowedRoles={[UserRole.DEPARTMENT]}>
        {withSuspense(DepartmentLayout)}
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: withSuspense(DepartmentDashboard),
      },
      // TODO: Add more department routes here
    ],
  },
  
  // 404 Not Found
  {
    path: '*',
    element: withSuspense(NotFoundPage),
  },
]);

