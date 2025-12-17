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
        element: withSuspense(SchemesList), // TODO: Create AddScheme component
      },
      {
        path: 'schemes/edit/:id',
        element: withSuspense(SchemesList), // TODO: Create EditScheme component
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
      
      // Tasks Module (Comments/Chat)
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

