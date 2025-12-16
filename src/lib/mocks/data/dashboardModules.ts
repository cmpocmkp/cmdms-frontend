/**
 * Dashboard Module Cards Data
 * Each module card represents a link to a different section of the system
 * Visibility is controlled by user permissions
 */

import type { ModuleIconName } from '../../../components/dashboard/ModuleIcons';

export interface DashboardModule {
  id: string;
  title: string;
  permission: string;
  link: string;
  isExternal?: boolean;
  variant: 'default' | 'green';
  icon: 'image' | 'svg' | 'iconFont';
  imagePath?: string;
  iconClass?: string;
  svgIcon?: ModuleIconName;
}

export const dashboardModules: DashboardModule[] = [
  {
    id: 'cm-dms',
    title: 'CM | DMS',
    permission: 'admin.report.filter.cm.meetings',
    link: '/admin/report/filter-cm-meetings',
    variant: 'default',
    icon: 'image',
    imagePath: '/admin_assets/images/dashboard/cmdmsupdated.png',
  },
  {
    id: 'consolidated-report',
    title: 'Consolidated Report',
    permission: 'admin.report.consolidated',
    link: '/admin/report/consolidated',
    variant: 'green',
    icon: 'svg',
    svgIcon: 'document', // Document/Report icon
  },
  {
    id: 'department-wise-dashboard',
    title: 'Department-wise Report',
    permission: 'admin.report.department-wise',
    link: '/admin/report/department-wise-dashboard',
    variant: 'green',
    icon: 'svg',
    svgIcon: 'document',
  },
  {
    id: 'cmdu',
    title: 'CMDU',
    permission: 'admin.mega.project.link',
    link: 'https://cmdu.kp.gov.pk/portal/admin',
    isExternal: true,
    variant: 'default',
    icon: 'image',
    imagePath: '/admin_assets/images/dashboard/cmdu-updated.png',
  },
  {
    id: 'minutes',
    title: 'Minutes',
    permission: 'admin.report.minutes-summary',
    link: '/admin/report/minutes-summary',
    variant: 'green',
    icon: 'svg',
    svgIcon: 'edit',
  },
  {
    id: 'summary-report',
    title: 'Summary Report',
    permission: 'admin.report.summary',
    link: '/admin/report/summary',
    variant: 'green',
    icon: 'iconFont',
    iconClass: 'ti-bar-chart',
  },
  {
    id: 'cm-remarks',
    title: 'CM Remarks',
    permission: 'admin.report.cm.remarks',
    link: '/admin/report/cm-remarks',
    variant: 'green',
    icon: 'svg',
    svgIcon: 'edit',
  },
  {
    id: 'minutes-detail',
    title: 'Minutes Detail',
    permission: 'admin.report.minutes-detail',
    link: '/admin/report/minutes-detail',
    variant: 'green',
    icon: 'svg',
    svgIcon: 'document',
  },
  {
    id: 'directives',
    title: 'Directives',
    permission: 'admin.report.directives.report',
    link: '/admin/report/directives',
    variant: 'green',
    icon: 'svg',
    svgIcon: 'document',
  },
  {
    id: 'sectorial-meetings',
    title: 'Sectorial Meetings',
    permission: 'admin.report.sectorialmeetings',
    link: '/admin/report/sectorial-meetings',
    variant: 'green',
    icon: 'svg',
    svgIcon: 'users',
  },
  {
    id: 'board-meetings',
    title: 'Board Meetings',
    permission: 'admin.report.boardmeetings',
    link: '/admin/report/board-meetings',
    variant: 'green',
    icon: 'svg',
    svgIcon: 'users',
  },
  {
    id: 'board-acts',
    title: 'Board Acts',
    permission: 'admin.report.boardacts',
    link: '/admin/report/board-acts',
    variant: 'green',
    icon: 'svg',
    svgIcon: 'document',
  },
  {
    id: 'ptf-meetings',
    title: 'PTF Meetings',
    permission: 'admin.cm.ptf.index',
    link: '/admin/report/ptf/index',
    variant: 'green',
    icon: 'svg',
    svgIcon: 'users',
  },
  {
    id: 'summaries',
    title: 'Summaries for CM',
    permission: 'admin.report.summaries.summary',
    link: '/admin/report/summaries/summary',
    variant: 'green',
    icon: 'svg',
    svgIcon: 'document',
  },
  {
    id: 'inaugurations',
    title: 'Inaugurations',
    permission: 'admin.report.inaugurations',
    link: '/admin/report/inaugurations',
    variant: 'green',
    icon: 'svg',
    svgIcon: 'award',
  },
  {
    id: 'review-meetings',
    title: 'Review Meetings',
    permission: 'admin.report.review.meetings',
    link: '/admin/report/review-meetings',
    variant: 'green',
    icon: 'svg',
    svgIcon: 'users',
  },
  {
    id: 'khushhalkpk',
    title: 'Khushhaal Khyber Pakhtunkhwa',
    permission: 'admin.report.khushhalkpk.tasks',
    link: '/admin/report/khushhalkpk-tasks',
    variant: 'green',
    icon: 'svg',
    svgIcon: 'flag',
  },
  {
    id: 'kpi-data',
    title: 'KPi Data Reports',
    permission: 'admin.kpidata.index',
    link: '/admin/kpidata',
    variant: 'green',
    icon: 'iconFont',
    iconClass: 'ti-bar-chart-alt',
  },
  {
    id: 'good-governance',
    title: 'Good Governance Roadmap',
    permission: 'admin.good.governance.roadmap.link',
    link: 'https://ipms.kpdata.gov.pk/guardian/users/bypass-login?rt=ggrm',
    isExternal: true,
    variant: 'default',
    icon: 'svg',
    svgIcon: 'target',
  },
  {
    id: 'announcements',
    title: 'Announcements',
    permission: 'admin.report.announcements',
    link: '/admin/report/announcements',
    variant: 'green',
    icon: 'svg',
    svgIcon: 'megaphone',
  },
];
