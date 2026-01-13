# Backend API Requirements Guide

## Overview

This document outlines all backend API requirements for the CMDMS Frontend application. It describes what types of APIs are needed, what data they should handle, and how they should be organized by role and module.

**Important Notes:**
- This guide does NOT specify endpoint names, request payloads, or response structures
- It describes the **type** of APIs needed and **what data** they should handle
- APIs are organized by user role and functional module
- Each section describes the expected data flow and operations

---

## Table of Contents

1. [Authentication & Authorization](#1-authentication--authorization)
2. [Admin Role APIs](#2-admin-role-apis)
3. [Department Role APIs](#3-department-role-apis)
4. [CS Role APIs](#4-cs-role-apis)
5. [CM Role APIs](#5-cm-role-apis)
6. [Data Entry Role APIs](#6-data-entry-role-apis)
7. [Common/Shared APIs](#7-commonshared-apis)

---

## 1. Authentication & Authorization

### 1.1 User Authentication

**Login API**
- Accept user credentials (email and password)
- Validate credentials against user database
- Check user active status and deletion status
- Return user information including role, department, and permissions
- Return authentication token for subsequent requests
- Handle password validation and security checks

**Logout API**
- Invalidate current authentication token
- Clear user session
- Return logout confirmation

**Token Refresh API**
- Accept refresh token
- Validate refresh token
- Return new authentication token
- Handle token expiration scenarios

**Password Reset Request API**
- Accept user email
- Generate password reset token
- Send reset link via email
- Return confirmation

**Password Reset API**
- Accept reset token and new password
- Validate reset token
- Update user password
- Invalidate reset token
- Return confirmation

### 1.2 User Session Management

**Current User API**
- Return currently authenticated user information
- Include user role, department, permissions
- Include user profile data
- Handle session validation

**User Permissions API**
- Return list of permissions for current user
- Include permission keys and descriptions
- Include role-based permissions
- Include user-specific permissions

**User Profile API**
- Return user profile information
- Include name, email, phone, department
- Include user settings and preferences

**Update User Profile API**
- Accept user profile updates
- Validate update data
- Update user information
- Return updated profile

---

## 2. Admin Role APIs

### 2.1 Dashboard APIs

**Department-Wise Dashboard API**
- Return aggregated statistics for all departments
- Include task counts (total, completed, pending, overdue, on target, off target)
- Include module-wise statistics (Minutes, Directives, Announcements, CM Remarks, PTIs, etc.)
- Include department-wise breakdown
- Support filtering by department type (departments, district administrations, all)
- Support filtering by modules
- Include percentage calculations for completion rates
- Return data suitable for DataTables and charts

**Dashboard Summary Cards API**
- Return overall totals for tasks, completed, on target, off target, overdue
- Include percentage calculations
- Return data for summary cards display

**Dashboard Chart Data API**
- Return data formatted for Chart.js visualization
- Include department-wise task distribution
- Include module-wise task distribution
- Support different chart types (bar, line, pie)

### 2.2 User Management APIs

**Users List API**
- Return paginated list of all users
- Include user details (name, email, role, department, status)
- Support filtering by role, department, status
- Support searching by name, email
- Support sorting by various fields
- Include pagination metadata

**User Details API**
- Return complete user information by ID
- Include user profile, role, department, permissions
- Include user groups and manager information
- Include activity history

**Create User API**
- Accept user creation data (name, email, password, role, department)
- Validate user data
- Check for duplicate emails
- Create user account
- Assign default permissions based on role
- Return created user information

**Update User API**
- Accept user update data
- Validate update data
- Update user information
- Handle role and department changes
- Return updated user information

**Delete User API**
- Accept user ID
- Soft delete user (mark as deleted)
- Handle cascading effects
- Return confirmation

**User Departments Assignment API**
- Accept user ID and list of department IDs
- Assign user to multiple departments
- Remove existing assignments if needed
- Return updated department assignments

**User Permissions Assignment API**
- Accept user ID and list of permission IDs
- Assign permissions to user
- Remove existing permissions if needed
- Return updated permissions

**User API Tokens Management API**
- Return list of API tokens for user
- Create new API token
- Revoke API token
- Return token information

**Export Users API**
- Return users data in exportable format (CSV, Excel)
- Include all user fields
- Support filtering and sorting
- Return file download

### 2.3 Department Management APIs

**Departments List API**
- Return paginated list of all departments
- Include department details (name, type, parent, district)
- Support filtering by type, district, parent
- Support searching by name
- Support sorting
- Include pagination metadata

**Department Details API**
- Return complete department information by ID
- Include department hierarchy (parent, children)
- Include associated users
- Include department statistics

**Create Department API**
- Accept department creation data
- Validate department data
- Check for duplicate names
- Create department record
- Return created department information

**Update Department API**
- Accept department update data
- Validate update data
- Update department information
- Handle hierarchy changes
- Return updated department information

**Delete Department API**
- Accept department ID
- Validate deletion (check for dependencies)
- Soft delete department
- Return confirmation

### 2.4 Minutes/Record Notes APIs

**Minutes List API**
- Return paginated list of all minutes/record notes
- Include minute details (subject, description, meeting, departments, status, deadline)
- Support filtering by meeting, department, status, date range
- Support searching by subject, description
- Support sorting
- Include pagination metadata

**Minutes by Meeting API**
- Return all minutes for a specific meeting
- Include minute details and department assignments
- Include reply counts and status

**Minute Details API**
- Return complete minute information by ID
- Include minute content, meeting details, assigned departments
- Include all replies and comments
- Include attachments
- Include timeline and progress information

**Create Minute API**
- Accept minute creation data (subject, description, meeting ID, departments, deadline)
- Validate minute data
- Create minute record
- Assign to departments
- Return created minute information

**Update Minute API**
- Accept minute update data
- Validate update data
- Update minute information
- Handle department assignment changes
- Return updated minute information

**Delete Minute API**
- Accept minute ID
- Validate deletion
- Soft delete minute
- Return confirmation

**Minute Department Assignment API**
- Accept minute ID and list of department IDs
- Assign minute to departments
- Update department-specific status
- Return updated assignments

**Minute Replies API**
- Return all replies for a specific minute
- Include reply details (user, department, content, status, progress, attachments)
- Support filtering by department, status
- Support sorting by date
- Include pagination

**Create Minute Reply API**
- Accept reply creation data (minute ID, content, status, progress, attachments)
- Validate reply data
- Create reply record
- Update minute status if needed
- Send notifications
- Return created reply information

**Update Minute Reply API**
- Accept reply update data
- Validate update data
- Update reply information
- Return updated reply information

**Minute Attachments API**
- Return all attachments for a minute
- Upload new attachment
- Delete attachment
- Return attachment information

### 2.5 Directives APIs

**Directives List API**
- Return paginated list of all directives
- Include directive details (title, description, date, reference number, departments, status, priority, deadline)
- Support filtering by department, status, priority, date range
- Support searching by title, description, reference number
- Support sorting
- Include pagination metadata

**Directive Details API**
- Return complete directive information by ID
- Include directive content, assigned departments, sub-tasks
- Include all replies and comments
- Include attachments
- Include timeline and progress information

**Create Directive API**
- Accept directive creation data (title, description, date, reference number, departments, priority, deadline)
- Validate directive data
- Create directive record
- Assign to departments
- Create sub-tasks if provided
- Return created directive information

**Update Directive API**
- Accept directive update data
- Validate update data
- Update directive information
- Handle department assignment changes
- Return updated directive information

**Delete Directive API**
- Accept directive ID
- Validate deletion
- Soft delete directive
- Return confirmation

**Directive Department Assignment API**
- Accept directive ID and list of department IDs
- Assign directive to departments
- Update department-specific status
- Return updated assignments

**Directive Replies API**
- Return all replies for a specific directive
- Include reply details (user, department, content, status, progress, attachments)
- Support filtering by department, status
- Support sorting by date
- Include pagination

**Create Directive Reply API**
- Accept reply creation data (directive ID, content, status, progress, attachments)
- Validate reply data
- Create reply record
- Update directive status if needed
- Send notifications
- Return created reply information

**Directive Sub-Tasks API**
- Return all sub-tasks for a directive
- Create new sub-task
- Update sub-task
- Delete sub-task
- Return sub-task information

### 2.6 Announcements APIs

**Announcements List API**
- Return paginated list of all announcements
- Include announcement details (title, description, date, departments, status)
- Support filtering by department, status, date range
- Support searching by title, description
- Support sorting
- Include pagination metadata

**Announcement Details API**
- Return complete announcement information by ID
- Include announcement content, assigned departments, sub-tasks
- Include all replies and comments
- Include attachments
- Include announcement details (multiple details per announcement)

**Create Announcement API**
- Accept announcement creation data (title, description, date, departments, details)
- Validate announcement data
- Create announcement record
- Assign to departments
- Create announcement details if provided
- Return created announcement information

**Update Announcement API**
- Accept announcement update data
- Validate update data
- Update announcement information
- Handle department assignment changes
- Return updated announcement information

**Delete Announcement API**
- Accept announcement ID
- Validate deletion
- Soft delete announcement
- Return confirmation

**Announcement Department Assignment API**
- Accept announcement ID and list of department IDs
- Assign announcement to departments
- Update department-specific status
- Return updated assignments

**Announcement Replies API**
- Return all replies for a specific announcement
- Include reply details (user, department, content, status, attachments)
- Support filtering by department, status
- Support sorting by date
- Include pagination

**Create Announcement Reply API**
- Accept reply creation data (announcement ID, content, status, attachments)
- Validate reply data
- Create reply record
- Update announcement status if needed
- Send notifications
- Return created reply information

**Announcement Details Management API**
- Return all details for an announcement
- Create new announcement detail
- Update announcement detail
- Delete announcement detail
- Return detail information

### 2.7 CM Remarks APIs

**CM Remarks List API**
- Return paginated list of all CM remarks
- Include remark details (subject, remark, date, departments, status, priority, deadline)
- Support filtering by department, status, priority, date range
- Support searching by subject, remark
- Support sorting
- Include pagination metadata

**CM Remark Details API**
- Return complete CM remark information by ID
- Include remark content, assigned departments
- Include all replies and comments
- Include attachments
- Include timeline and progress information

**Create CM Remark API**
- Accept CM remark creation data (subject, remark, date, departments, priority, deadline)
- Validate remark data
- Create remark record
- Assign to departments
- Return created remark information

**Update CM Remark API**
- Accept CM remark update data
- Validate update data
- Update remark information
- Handle department assignment changes
- Return updated remark information

**Delete CM Remark API**
- Accept CM remark ID
- Validate deletion
- Soft delete remark
- Return confirmation

**CM Remark Department Assignment API**
- Accept CM remark ID and list of department IDs
- Assign remark to departments
- Update department-specific status
- Return updated assignments

**CM Remark Replies API**
- Return all replies for a specific CM remark
- Include reply details (user, department, content, status, progress, attachments)
- Support filtering by department, status
- Support sorting by date
- Include pagination

**Create CM Remark Reply API**
- Accept reply creation data (remark ID, content, status, progress, attachments)
- Validate reply data
- Create reply record
- Update remark status if needed
- Send notifications
- Return created reply information

**CM Remark Attachments Management API**
- Return all attachments for a CM remark
- Upload new attachment
- Delete attachment
- Remove attachment from remark
- Return attachment information

### 2.8 PTIs (Priority Transformation Initiatives) APIs

**PTIs List API**
- Return paginated list of all PTIs
- Include PTI details (title, description, start date, end date, status, progress)
- Support filtering by status, date range
- Support searching by title, description
- Support sorting
- Include pagination metadata

**PTI Details API (Show PTI)**
- Return complete PTI information by ID
- Include PTI content, tasks, KPIs
- Include all comments and replies
- Include attachments
- Include progress information
- Include task management capabilities

**Create PTI API**
- Accept PTI creation data (title, description, start date, end date, tasks)
- Validate PTI data
- Create PTI record
- Create tasks if provided
- Return created PTI information

**Update PTI API**
- Accept PTI update data
- Validate update data
- Update PTI information
- Return updated PTI information

**Delete PTI API**
- Accept PTI ID
- Validate deletion
- Soft delete PTI
- Return confirmation

**PTI Tasks API**
- Return all tasks for a PTI
- Include task details (title, description, department, status, progress, timeline, deadline)
- Support filtering by department, status
- Support sorting
- Include pagination

**Create PTI Task API**
- Accept task creation data (PTI ID, title, description, department, timeline, deadline)
- Validate task data
- Create task record
- Return created task information

**Update PTI Task API**
- Accept task update data
- Validate update data
- Update task information
- Return updated task information

**Delete PTI Task API**
- Accept task ID
- Validate deletion
- Soft delete task
- Return confirmation

**PTI Task Department Assignment API**
- Accept task ID and list of department IDs
- Assign task to departments
- Update department-specific status
- Return updated assignments

**PTI Task Replies/Comments API**
- Return all replies/comments for a PTI task
- Include comment details (user, content, attachments, date)
- Support sorting by date
- Include pagination

**Create PTI Task Reply API**
- Accept reply creation data (task ID, content, attachments)
- Validate reply data
- Create reply record
- Send notifications
- Return created reply information

**Update PTI Task Reply API**
- Accept reply update data
- Validate update data
- Update reply information
- Return updated reply information

**PTIs Summary Report API**
- Return aggregated PTI statistics
- Include total PTIs, tasks, completed, pending, overdue
- Include department-wise breakdown
- Include KPI data
- Support filtering by date range, department

**PTIs Detail Report API**
- Return detailed PTI report data
- Include PTI-wise task breakdown
- Include status-wise distribution
- Include progress information
- Support filtering and sorting

### 2.9 Summaries for CM APIs

**Summaries List API**
- Return paginated list of all summaries
- Include summary details (reference number, subject, description, date, initiator department, status)
- Support filtering by department, status, date range
- Support searching by reference number, subject
- Support sorting
- Include pagination metadata

**Summary Details API (Show Summary)**
- Return complete summary information by ID
- Include summary content, tasks, attachments
- Include all comments and replies
- Include timeline information
- Include task management capabilities

**Create Summary API**
- Accept summary creation data (reference number, subject, description, date, initiator department, tasks)
- Validate summary data
- Create summary record
- Create tasks if provided
- Return created summary information

**Update Summary API**
- Accept summary update data
- Validate update data
- Update summary information
- Return updated summary information

**Delete Summary API**
- Accept summary ID
- Validate deletion
- Soft delete summary
- Return confirmation

**Summary Tasks API**
- Return all tasks for a summary
- Include task details (title, description, department, status, progress, timeline, deadline)
- Support filtering by department, status
- Support sorting
- Include pagination

**Create Summary Task API**
- Accept task creation data (summary ID, title, description, department, timeline, deadline)
- Validate task data
- Create task record
- Return created task information

**Update Summary Task API**
- Accept task update data
- Validate update data
- Update task information
- Return updated task information

**Delete Summary Task API**
- Accept task ID
- Validate deletion
- Soft delete task
- Return confirmation

**Summary Task Department Assignment API**
- Accept task ID and list of department IDs
- Assign task to departments
- Update department-specific status
- Return updated assignments

**Summary Attachments API**
- Return all attachments for a summary
- Upload new attachment
- Delete attachment
- Return attachment information

**Summaries Report API**
- Return summary report data
- Include summary statistics
- Include department-wise breakdown
- Support filtering and sorting

**Summaries Detail Report API**
- Return detailed summary report data
- Include summary-wise task breakdown
- Include status-wise distribution
- Support filtering and sorting

### 2.10 Trackers/Interventions APIs

**Trackers List API**
- Return paginated list of all trackers/interventions
- Include tracker details (title, description, type, status, progress, budget, start date, end date, departments)
- Support filtering by type, status, department, date range
- Support searching by title, description
- Support sorting
- Include pagination metadata

**Tracker Details API**
- Return complete tracker information by ID
- Include tracker content, activities, departments
- Include all comments and replies
- Include attachments
- Include progress and budget information

**Create Tracker API**
- Accept tracker creation data (title, description, type, status, budget, start date, end date, departments, activities)
- Validate tracker data
- Create tracker record
- Assign to departments
- Create activities if provided
- Return created tracker information

**Update Tracker API**
- Accept tracker update data
- Validate update data
- Update tracker information
- Handle department assignment changes
- Return updated tracker information

**Delete Tracker API**
- Accept tracker ID
- Validate deletion
- Soft delete tracker
- Return confirmation

**Tracker Activities API**
- Return all activities for a tracker
- Include activity details (title, description, status, progress, department)
- Support filtering by department, status
- Support sorting
- Include pagination

**Create Tracker Activity API**
- Accept activity creation data (tracker ID, title, description, department)
- Validate activity data
- Create activity record
- Return created activity information

**Update Tracker Activity API**
- Accept activity update data
- Validate update data
- Update activity information
- Return updated activity information

**Tracker Department Assignment API**
- Accept tracker ID and list of department IDs
- Assign tracker to departments
- Update department-specific status
- Return updated assignments

**Tracker Activity Replies/Comments API**
- Return all replies/comments for a tracker activity
- Include comment details (user, content, attachments, date)
- Support sorting by date
- Include pagination

**Create Tracker Activity Reply API**
- Accept reply creation data (activity ID, content, attachments)
- Validate reply data
- Create reply record
- Send notifications
- Return created reply information

**Update Tracker Activity Reply API**
- Accept reply update data
- Validate update data
- Update reply information
- Return updated reply information

**Delete Tracker Activity API**
- Accept activity ID
- Validate deletion
- Soft delete activity
- Return confirmation

### 2.11 Board Meetings APIs

**Board Meetings List API**
- Return paginated list of all board meetings
- Include meeting details (title, description, date, venue, board, status, agenda points)
- Support filtering by board, status, date range
- Support searching by title, description
- Support sorting
- Include pagination metadata

**Board Meeting Details API**
- Return complete board meeting information by ID
- Include meeting content, board information, members, agenda points
- Include all replies and comments
- Include attachments

**Create Board Meeting API**
- Accept board meeting creation data (title, description, date, venue, board ID, agenda points)
- Validate meeting data
- Create meeting record
- Create agenda points if provided
- Return created meeting information

**Update Board Meeting API**
- Accept board meeting update data
- Validate update data
- Update meeting information
- Return updated meeting information

**Delete Board Meeting API**
- Accept board meeting ID
- Validate deletion
- Soft delete meeting
- Return confirmation

**Board Meeting Agenda Points API**
- Return all agenda points for a board meeting
- Include agenda point details (title, description, departments, status, order)
- Support filtering by department, status
- Support sorting by order
- Include pagination

**Create Board Meeting Agenda Point API**
- Accept agenda point creation data (meeting ID, title, description, departments, order)
- Validate agenda point data
- Create agenda point record
- Assign to departments
- Return created agenda point information

**Update Board Meeting Agenda Point API**
- Accept agenda point update data
- Validate update data
- Update agenda point information
- Handle department assignment changes
- Return updated agenda point information

**Board Meeting Agenda Point Replies API**
- Return all replies for a board meeting agenda point
- Include reply details (user, department, content, status, attachments)
- Support filtering by department, status
- Support sorting by date
- Include pagination

**Create Board Meeting Agenda Point Reply API**
- Accept reply creation data (agenda point ID, content, status, attachments)
- Validate reply data
- Create reply record
- Update agenda point status if needed
- Send notifications
- Return created reply information

### 2.12 Board Acts APIs

**Board Acts List API**
- Return paginated list of all board acts
- Include act details (title, description, date, board, status, reference number)
- Support filtering by board, status, date range
- Support searching by title, description, reference number
- Support sorting
- Include pagination metadata

**Board Act Details API (Show Board Act)**
- Return complete board act information by ID
- Include act content, board information, departments
- Include all comments and replies
- Include attachments
- Include act details and related information

**Create Board Act API**
- Accept board act creation data (title, description, date, board ID, reference number, departments)
- Validate act data
- Create act record
- Assign to departments
- Return created act information

**Update Board Act API**
- Accept board act update data
- Validate update data
- Update act information
- Handle department assignment changes
- Return updated act information

**Delete Board Act API**
- Accept board act ID
- Validate deletion
- Soft delete act
- Return confirmation

### 2.13 Board Members APIs

**Board Members List API**
- Return paginated list of all board members
- Include member details (name, qualification, designation, department, email, phone, joining date, expiration date, type, status)
- Support filtering by department, type, status
- Support searching by name, email
- Support sorting
- Include pagination metadata

**Board Member Details API**
- Return complete board member information by ID
- Include member profile, department, board associations
- Include resume and photo if available

**Create Board Member API**
- Accept board member creation data (name, qualification, designation, department ID, email, phone, joining date, expiration date, type, resume, photo)
- Validate member data
- Create member record
- Handle file uploads (resume, photo)
- Return created member information

**Update Board Member API**
- Accept board member update data
- Validate update data
- Update member information
- Handle file uploads if provided
- Return updated member information

**Delete Board Member API**
- Accept board member ID
- Validate deletion
- Soft delete member
- Return confirmation

### 2.14 Sectoral Meetings APIs

**Sectoral Meetings List API**
- Return paginated list of all sectoral meetings
- Include meeting details (title, description, date, venue, sector, status, agenda points)
- Support filtering by sector, status, date range
- Support searching by title, description
- Support sorting
- Include pagination metadata

**Sectoral Meeting Details API**
- Return complete sectoral meeting information by ID
- Include meeting content, sector information, agenda points
- Include all replies and comments
- Include attachments

**Create Sectoral Meeting API**
- Accept sectoral meeting creation data (title, description, date, venue, sector ID, agenda points)
- Validate meeting data
- Create meeting record
- Create agenda points if provided
- Return created meeting information

**Update Sectoral Meeting API**
- Accept sectoral meeting update data
- Validate update data
- Update meeting information
- Return updated meeting information

**Delete Sectoral Meeting API**
- Accept sectoral meeting ID
- Validate deletion
- Soft delete meeting
- Return confirmation

**Sectoral Meeting Agenda Points API**
- Return all agenda points for a sectoral meeting
- Include agenda point details (title, description, related departments, status, order)
- Support filtering by department, status
- Support sorting by order
- Include pagination

**Create Sectoral Meeting Agenda Point API**
- Accept agenda point creation data (meeting ID, title, description, related departments, order)
- Validate agenda point data
- Create agenda point record
- Assign to related departments
- Return created agenda point information

**Update Sectoral Meeting Agenda Point API**
- Accept agenda point update data
- Validate update data
- Update agenda point information
- Handle related department assignment changes
- Return updated agenda point information

**Sectoral Meeting Agenda Point Replies API**
- Return all replies for a sectoral meeting agenda point
- Include reply details (user, department, content, status, attachments)
- Support filtering by department, status
- Support sorting by date
- Include pagination

**Create Sectoral Meeting Agenda Point Reply API**
- Accept reply creation data (agenda point ID, content, status, attachments)
- Validate reply data
- Create reply record
- Update agenda point status if needed
- Send notifications
- Return created reply information

### 2.15 Schemes APIs

**Schemes List API**
- Return paginated list of all schemes
- Include scheme details (title, description, status, start date, end date, budget, departments)
- Support filtering by department, status, date range
- Support searching by title, description
- Support sorting
- Include pagination metadata

**Scheme Details API**
- Return complete scheme information by ID
- Include scheme content, departments, budget information
- Include all comments and replies
- Include attachments

**Create Scheme API**
- Accept scheme creation data (title, description, status, start date, end date, budget, departments)
- Validate scheme data
- Create scheme record
- Assign to departments
- Return created scheme information

**Update Scheme API**
- Accept scheme update data
- Validate update data
- Update scheme information
- Handle department assignment changes
- Return updated scheme information

**Delete Scheme API**
- Accept scheme ID
- Validate deletion
- Soft delete scheme
- Return confirmation

### 2.16 Inaugurations APIs

**Inaugurations List API**
- Return paginated list of all inaugurations
- Include inauguration details (title, description, date, venue, status, departments)
- Support filtering by department, status, date range
- Support searching by title, description
- Support sorting
- Include pagination metadata

**Inauguration Details API**
- Return complete inauguration information by ID
- Include inauguration content, departments, venue information
- Include all comments and replies
- Include attachments and photos

**Create Inauguration API**
- Accept inauguration creation data (title, description, date, venue, departments, photos)
- Validate inauguration data
- Create inauguration record
- Assign to departments
- Handle photo uploads
- Return created inauguration information

**Update Inauguration API**
- Accept inauguration update data
- Validate update data
- Update inauguration information
- Handle department assignment changes
- Handle photo uploads if provided
- Return updated inauguration information

**Delete Inauguration API**
- Accept inauguration ID
- Validate deletion
- Soft delete inauguration
- Return confirmation

### 2.17 Khushhal KPK APIs

**Khushhal KPK List API**
- Return paginated list of all Khushhal KPK programs
- Include program details (title, description, status, progress, start date, end date, departments)
- Support filtering by department, status, date range
- Support searching by title, description
- Support sorting
- Include pagination metadata

**Khushhal KPK Details API**
- Return complete Khushhal KPK program information by ID
- Include program content, departments, KPI data
- Include all replies and comments
- Include attachments
- Include progress information

**Create Khushhal KPK API**
- Accept Khushhal KPK creation data (title, description, status, start date, end date, departments, KPI data)
- Validate program data
- Create program record
- Assign to departments
- Create KPI data if provided
- Return created program information

**Update Khushhal KPK API**
- Accept Khushhal KPK update data
- Validate update data
- Update program information
- Handle department assignment changes
- Return updated program information

**Delete Khushhal KPK API**
- Accept Khushhal KPK ID
- Validate deletion
- Soft delete program
- Return confirmation

**Khushhal KPK Details API (Show Khushhal KPK)**
- Return complete Khushhal KPK program information by ID
- Include program content, departments, KPI data
- Include all replies and comments
- Include attachments
- Include progress information
- Include program details

**Khushhal KPK Replies API**
- Return all replies for a Khushhal KPK program
- Include reply details (user, department, content, status, attachments)
- Support filtering by department, status
- Support sorting by date
- Include pagination

**Create Khushhal KPK Reply API**
- Accept reply creation data (program ID, content, status, attachments)
- Validate reply data
- Create reply record
- Update program status if needed
- Send notifications
- Return created reply information

**Khushhal KPK Progress API**
- Return progress data for a Khushhal KPK program
- Include progress entries by department
- Support filtering by department, type (weekly/monthly), date range
- Support sorting
- Include pagination

**Create Khushhal KPK Progress API**
- Accept progress creation data (program ID, department ID, type, progress, status, attachments)
- Validate progress data
- Create progress entry
- Return created progress information

**Update Khushhal KPK Progress API**
- Accept progress update data
- Validate update data
- Update progress entry
- Handle file uploads if provided
- Return updated progress information

**Delete Khushhal KPK Progress API**
- Accept progress ID
- Validate deletion
- Soft delete progress entry
- Return confirmation

### 2.18 Review Meetings APIs

**Review Meetings List API**
- Return paginated list of all review meetings
- Include meeting details (title, description, date, venue, status, departments)
- Support filtering by department, status, date range
- Support searching by title, description
- Support sorting
- Include pagination metadata

**Review Meeting Details API**
- Return complete review meeting information by ID
- Include meeting content, departments, agenda
- Include all comments and replies
- Include attachments

**Create Review Meeting API**
- Accept review meeting creation data (title, description, date, venue, departments)
- Validate meeting data
- Create meeting record
- Assign to departments
- Return created meeting information

**Update Review Meeting API**
- Accept review meeting update data
- Validate update data
- Update meeting information
- Handle department assignment changes
- Return updated meeting information

**Delete Review Meeting API**
- Accept review meeting ID
- Validate deletion
- Soft delete meeting
- Return confirmation

### 2.19 Candidate Requests APIs

**Candidate Requests List API**
- Return paginated list of all candidate requests
- Include request details (title, description, date, status, candidate, department)
- Support filtering by department, status, date range
- Support searching by title, description, candidate name
- Support sorting
- Include pagination metadata

**Candidate Request Details API**
- Return complete candidate request information by ID
- Include request content, candidate information, department
- Include all comments and replies
- Include attachments

**Create Candidate Request API**
- Accept candidate request creation data (title, description, date, candidate ID, department ID)
- Validate request data
- Create request record
- Return created request information

**Update Candidate Request API**
- Accept candidate request update data
- Validate update data
- Update request information
- Return updated request information

**Delete Candidate Request API**
- Accept candidate request ID
- Validate deletion
- Soft delete request
- Return confirmation

### 2.20 Officers APIs

**Officers List API**
- Return paginated list of all officers
- Include officer details (name, designation, department, email, phone, status)
- Support filtering by department, status
- Support searching by name, designation, email
- Support sorting
- Include pagination metadata

**Officer Details API**
- Return complete officer information by ID
- Include officer profile, department associations
- Include activity history

**Create Officer API**
- Accept officer creation data (name, designation, department ID, email, phone)
- Validate officer data
- Create officer record
- Return created officer information

**Update Officer API**
- Accept officer update data
- Validate update data
- Update officer information
- Return updated officer information

**Delete Officer API**
- Accept officer ID
- Validate deletion
- Soft delete officer
- Return confirmation

**Officer Departments API**
- Return all department associations for an officer
- Assign officer to departments
- Remove department associations
- Return updated associations

### 2.21 Candidates APIs

**Candidates List API**
- Return paginated list of all candidates
- Include candidate details (name, email, phone, constituency, party, status)
- Support filtering by constituency, party, status
- Support searching by name, email
- Support sorting
- Include pagination metadata

**Candidate Details API**
- Return complete candidate information by ID
- Include candidate profile, constituency, party
- Include requests and associations

**Create Candidate API**
- Accept candidate creation data (name, email, phone, constituency ID, party ID)
- Validate candidate data
- Create candidate record
- Return created candidate information

**Update Candidate API**
- Accept candidate update data
- Validate update data
- Update candidate information
- Return updated candidate information

**Delete Candidate API**
- Accept candidate ID
- Validate deletion
- Soft delete candidate
- Return confirmation

### 2.22 Funds Distribution APIs

**Annual Schemes List API**
- Return paginated list of all annual schemes
- Include scheme details (title, description, budget, year, status, departments)
- Support filtering by year, department, status
- Support searching by title, description
- Support sorting
- Include pagination metadata

**Annual Scheme Details API (Show Annual Scheme)**
- Return complete annual scheme information by ID
- Include scheme content, budget breakdown, departments
- Include distributions and allocations
- Include attachments
- Include scheme details and related information
- Include costs, expenditures, allocations, through forwards, scheme revisions

**Annual Scheme Costs Management API**
- Return all costs for an annual scheme
- Create new cost entry
- Update cost entry
- Delete cost entry
- Return cost information

**Annual Scheme Expenditures Management API**
- Return all expenditures for an annual scheme
- Create new expenditure entry
- Update expenditure entry
- Delete expenditure entry
- Return expenditure information

**Annual Scheme Allocations Management API**
- Return all allocations for an annual scheme
- Create new allocation entry
- Update allocation entry
- Delete allocation entry
- Return allocation information

**Annual Scheme Through Forwards Management API**
- Return all through forwards for an annual scheme
- Create new through forward entry
- Update through forward entry
- Delete through forward entry
- Return through forward information

**Annual Scheme Revisions Management API**
- Return all revisions for an annual scheme
- Create new revision entry
- Update revision entry
- Delete revision entry
- Return revision information

**Create Annual Scheme API**
- Accept annual scheme creation data (title, description, budget, year, departments)
- Validate scheme data
- Create scheme record
- Assign to departments
- Return created scheme information

**Update Annual Scheme API**
- Accept annual scheme update data
- Validate update data
- Update scheme information
- Handle department assignment changes
- Return updated scheme information

**Delete Annual Scheme API**
- Accept annual scheme ID
- Validate deletion
- Soft delete scheme
- Return confirmation

**Fund Distributions List API**
- Return paginated list of all fund distributions
- Include distribution details (scheme, candidate, district, amount, date, status)
- Support filtering by scheme, candidate, district, status, date range
- Support searching
- Support sorting
- Include pagination metadata

**Fund Distribution Details API**
- Return complete fund distribution information by ID
- Include distribution details, scheme information, candidate information
- Include attachments
- Include distribution items/rows

**Create Fund Distribution API**
- Accept fund distribution creation data (scheme ID, candidate ID, district ID, amount, date, items)
- Validate distribution data
- Create distribution record
- Create distribution items if provided
- Return created distribution information

**Update Fund Distribution API**
- Accept fund distribution update data
- Validate update data
- Update distribution information
- Handle distribution items updates
- Return updated distribution information

**Fund Distribution Items Management API**
- Return all items for a fund distribution
- Create new distribution item
- Update distribution item
- Delete distribution item
- Return item information

**Distributed Schemes List API**
- Return list of schemes with distribution information
- Include scheme and distribution statistics
- Support filtering and sorting

### 2.23 Tags APIs

**Tags List API**
- Return paginated list of all tags
- Include tag details (name, slug, color)
- Support filtering by name
- Support searching
- Support sorting
- Include pagination metadata

**Tag Details API**
- Return complete tag information by ID
- Include tag details and associations

**Create Tag API**
- Accept tag creation data (name, slug, color)
- Validate tag data
- Check for duplicate names/slugs
- Create tag record
- Return created tag information

**Update Tag API**
- Accept tag update data
- Validate update data
- Update tag information
- Return updated tag information

**Delete Tag API**
- Accept tag ID
- Validate deletion
- Soft delete tag
- Return confirmation

### 2.24 Activity Logs APIs

**Activity Logs List API**
- Return paginated list of all activity logs
- Include log details (user, action, module, entity, description, IP address, date)
- Support filtering by user, module, action, date range
- Support searching by description
- Support sorting
- Include pagination metadata

**Activity Log Details API**
- Return complete activity log information by ID
- Include full log details and related entity information

### 2.25 Settings APIs

**User Settings API**
- Return user settings for current user
- Include preferences, notifications, display settings
- Update user settings
- Return updated settings

### 2.26 Tasks APIs

**Task Details API (Show Task)**
- Return complete task information by ID
- Include task content, departments, progress, timeline
- Include all comments and replies
- Include attachments
- Include taskable entity information (parent entity like Summary, PTI, etc.)
- Support print functionality

**Task Comments API**
- Return all comments for a task
- Include comment details (user, content, status, remarks, reason, attachments, tagged departments, date)
- Support filtering by user, department, date range
- Support sorting by date
- Include pagination

**Create Task Comment API**
- Accept comment creation data (task ID, content, status, remarks, reason, attachments, tagged departments)
- Validate comment data
- Create comment record
- Send notifications to tagged departments
- Return created comment information

**Update Task Comment API**
- Accept comment update data
- Validate update data
- Update comment information
- Return updated comment information

**Delete Task Comment API**
- Accept comment ID
- Validate deletion
- Soft delete comment
- Return confirmation

**Task Department Status Update API**
- Accept task ID and department ID with status update
- Update department-specific task status
- Update progress if provided
- Return updated status

### 2.27 PTF (Provincial Task Force) APIs

**PTF Issues List API**
- Return paginated list of all PTF issues
- Include issue details (title, description, date, status, priority, district, department, decision, timeline)
- Support filtering by status, type (on target/critically delayed), district, department, date range
- Support searching by title, description
- Support sorting
- Include pagination metadata

**PTF Issue Details API**
- Return complete PTF issue information by ID
- Include issue content, district information, department, priority, source
- Include suggested departments and assigned departments
- Include all histories and responses
- Include attachments
- Include timeline and decision information

**Create PTF Issue API**
- Accept PTF issue creation data (title, description, date, priority, district ID, department ID, source ID, suggested departments, way forward)
- Validate issue data
- Create issue record
- Assign to departments
- Return created issue information

**Update PTF Issue API**
- Accept PTF issue update data
- Validate update data
- Update issue information
- Handle department assignment changes
- Return updated issue information

**Delete PTF Issue API**
- Accept PTF issue ID
- Validate deletion
- Soft delete issue
- Return confirmation

**PTF Issue Response API**
- Accept response creation data (issue ID, department ID, initial response, final response, attachments)
- Validate response data
- Create response record
- Update issue status if needed
- Send notifications
- Return created response information

**Update PTF Issue Response API**
- Accept response update data
- Validate update data
- Update response information
- Return updated response information

**PTF Issue History API**
- Return all history entries for a PTF issue
- Include history details (department, response, date, status changes)
- Support filtering by department
- Support sorting by date
- Include pagination

**PTF Issue Department Assignment API**
- Accept issue ID and list of department IDs
- Assign issue to departments
- Update department-specific status
- Return updated assignments

**PTF Meetings List API**
- Return list of PTF meetings
- Include meeting details (date, venue, issues discussed)
- Support filtering by date range
- Support sorting
- Include pagination

**PTF Meeting Details API**
- Return complete PTF meeting information
- Include meeting content, issues discussed, decisions
- Include attachments

**Create PTF Meeting API**
- Accept PTF meeting creation data (date, venue, issues, decisions)
- Validate meeting data
- Create meeting record
- Return created meeting information

**PTF Dashboard Report API**
- Return PTF dashboard statistics
- Include issue counts, status breakdown, district-wise distribution
- Support filtering and sorting

**PTF Meetings Report API**
- Return PTF meeting statistics
- Include meeting counts, issues discussed, decisions made
- Support filtering and sorting

**PTF Department-Wise Report API**
- Return PTF statistics by department
- Include department-wise issue breakdown
- Support filtering and sorting

**PTF District-Wise Report API**
- Return PTF statistics by district
- Include district-wise issue breakdown
- Support filtering and sorting

**PTF District Detail Report API**
- Return detailed PTF data for a specific district
- Include all issues for district
- Support filtering by status, date range
- Support sorting

**PTF District Latest Report API**
- Return latest PTF issues by district
- Include most recent issues per district
- Support filtering and sorting

**PTF Meetings Detail Report API**
- Return detailed PTF meeting report for department and status
- Include meeting details, issues, decisions
- Support filtering and sorting

**PTF Department-Wise Detail Report API**
- Return detailed PTF issues for a specific department
- Include all issues assigned to department
- Support filtering by status, date range
- Support sorting

### 2.28 Reports APIs

**Department-Wise Report API**
- Return department-wise statistics and breakdown
- Include task counts, completion rates, module-wise statistics
- Support filtering by department, date range, modules
- Return data suitable for DataTables and charts

**Cabinet Meetings Report API**
- Return cabinet meeting statistics
- Include meeting counts, status breakdown, department-wise distribution
- Support filtering and sorting

**Cabinet Meetings By Status Report API**
- Return cabinet meeting statistics grouped by status
- Include status-wise breakdown
- Support filtering and sorting

**Cabinet Detail Report API**
- Return detailed cabinet meeting report for department and status
- Include all meetings and minutes for department
- Support filtering and sorting

**Cabinet Department-Wise Report API**
- Return cabinet meeting decisions by department
- Include department-wise decision breakdown
- Support filtering and sorting

**Record Notes Detail List API**
- Return detailed record notes list for meeting and minute
- Include all departments and their replies
- Support filtering and sorting

**Board Meetings Report API**
- Return board meeting statistics
- Include meeting counts, status breakdown, board-wise distribution
- Support filtering and sorting

**Board Meeting Detail Report API**
- Return detailed board meeting report for department and decision status
- Include all meetings and agenda points for department
- Support filtering and sorting

**Board Meeting Filter Report API**
- Return filtered board meeting data
- Support multiple filter criteria (board, status, date range, etc.)
- Support searching
- Support sorting

**Board Meetings Upcoming Report API**
- Return upcoming board meetings
- Include meetings scheduled in future
- Support filtering and sorting

**Board Acts Report API**
- Return board act statistics
- Include act counts, status breakdown, board-wise distribution
- Support filtering and sorting

**Board Acts Show Report API**
- Return detailed board act information
- Include act details and related information
- Support filtering and sorting

**Board Acts Upcoming Report API**
- Return upcoming board acts
- Include acts scheduled in future
- Support filtering and sorting

**Summaries Report API**
- Return summary statistics
- Include summary counts, status breakdown, department-wise distribution
- Support filtering and sorting

**Summaries Detail Report API**
- Return detailed summary report data
- Include summary-wise task breakdown
- Include status-wise distribution
- Support filtering and sorting

**Inaugurations Report API**
- Return inauguration statistics
- Include inauguration counts, status breakdown, department-wise distribution
- Support filtering and sorting

**Review Meetings Report API**
- Return review meeting statistics
- Include meeting counts, status breakdown, department-wise distribution
- Support filtering and sorting

**Review Meetings DS-Wise Report API**
- Return review meeting statistics by DS (Development Sector)
- Include DS-wise meeting breakdown
- Support filtering and sorting

**Khushhal KPK Tasks Report API**
- Return Khushhal KPK program task statistics
- Include task counts, progress breakdown, department-wise distribution
- Support filtering and sorting

**KPI Data Reports API**
- Return KPI data statistics overview
- Include KPI data summary by type
- Support filtering and sorting

**DC KPIs Data Filter API**
- Return KPI data for DC (Deputy Commissioner) users
- Include KPI data by DC user, date groups
- Support filtering by date range, user
- Support sorting
- Return data suitable for DataTables

**DPOs KPIs Data Filter API**
- Return KPI data for DPO (District Police Officer) users
- Include KPI data by DPO user, date groups
- Support filtering by date range, user
- Support sorting
- Return data suitable for DataTables

**Departments KPIs Data Filter API**
- Return KPI data for Department users
- Include KPI data by department user, date groups
- Support filtering by date range, user, department
- Support sorting
- Return data suitable for DataTables

**DC Inspection Details Report API**
- Return DC inspection statistics
- Include inspection details, status breakdown
- Support filtering and sorting

**PMRU Meetings Report API**
- Return PMRU meeting statistics
- Include meeting counts, subtask breakdown, department-wise distribution
- Support filtering and sorting

**PMRU Subtasks Detail Report API**
- Return detailed PMRU subtasks for a department
- Include all subtasks assigned to department
- Support filtering by status, date range
- Support sorting

**Filter Record Notes Report API**
- Return filtered record notes statistics
- Support multiple filter criteria
- Return aggregated data
- Support filtering by meeting, department, status, date range

**Record Notes Updates Report API**
- Return record notes updates statistics
- Include update counts and trends
- Support filtering and sorting

**Record Notes Updates Detail Report API**
- Return detailed record notes updates
- Include all updates with details
- Support filtering and sorting

**Record Notes Comparison Report API**
- Return record notes comparison data
- Include comparison between different periods or departments
- Support filtering and sorting

**MNA/MPA Posting Recommendation API**
- Return candidate request statistics for posting recommendations
- Include candidate requests, officer assignments, recommendations
- Support filtering by candidate, status, date range
- Support sorting
- Return data suitable for DataTables

### 2.29 PDF Generation APIs

**PDF Dashboard API**
- Return PDF dashboard data
- Include list of available PDF generation options
- Include PDF module categories and links
- Return data for PDF dashboard display

**Record Note PDF API**
- Generate PDF for a single record note
- Include record note details, meeting information, department replies
- Return PDF file for download

**Record Notes List PDF API**
- Generate PDF for list of record notes
- Include filtered record notes list
- Support filtering criteria
- Return PDF file for download

**Record Note by Status PDF API**
- Generate PDF for record notes filtered by status
- Include record notes for meeting, department, and status
- Return PDF file for download

**Record Note Updates PDF API**
- Generate PDF for record note updates
- Include update details and statistics
- Return PDF file for download

**Directive PDF API**
- Generate PDF for a directive
- Include directive details, department replies
- Return PDF file for download

**Announcement PDF API**
- Generate PDF for an announcement
- Include announcement details, department replies
- Return PDF file for download

**CM Remark PDF API**
- Generate PDF for a CM remark
- Include remark details, department replies
- Return PDF file for download

**PTF Issue PDF API**
- Generate PDF for a PTF issue
- Include issue details, responses, histories
- Return PDF file for download

**Board Meeting PDF API**
- Generate PDF for a board meeting
- Include meeting details, agenda points, replies
- Return PDF file for download

**Board Act PDF API**
- Generate PDF for a board act
- Include act details and related information
- Return PDF file for download

**Summary PDF API**
- Generate PDF for a summary
- Include summary details, tasks, attachments
- Return PDF file for download

**Task PDF API**
- Generate PDF for a task
- Include task details, departments, comments
- Return PDF file for download

**Various Report PDF APIs**
- Generate PDF for various reports (Cabinet, Board, PTF, PTIs, etc.)
- Include report data and statistics
- Support filtering criteria
- Return PDF file for download

### 2.30 Log Viewer API

**Log Files List API**
- Return list of available log files
- Include file names, sizes, dates
- Support filtering by date, level

**Log File Content API**
- Return content of a specific log file
- Support pagination for large files
- Support filtering by log level, search term

---

## 3. Department Role APIs

### 3.1 Department Dashboard API

**Department Dashboard API**
- Return dashboard statistics for current department user
- Include task counts (assigned to department)
- Include module-wise statistics (Minutes, Directives, Announcements, CM Remarks, PTIs, etc.)
- Include pending, overdue, completed counts
- Include recent activities
- Return data for dashboard cards and modules

### 3.2 Record Notes/Cabinet Minutes APIs

**Department Record Notes List API**
- Return list of record notes/minutes assigned to current department
- Include minute details (subject, description, meeting, status, deadline, progress)
- Support filtering by status, date range, meeting
- Support searching
- Support sorting
- Include pagination metadata

**Department Record Note Details API**
- Return complete record note information
- Include minute content, meeting details
- Include all replies from department
- Include attachments
- Include timeline and progress

**Department Record Note Reply API**
- Accept reply creation data (minute ID, content, status, progress, attachments)
- Validate reply data
- Create reply record for department
- Update minute status if needed
- Send notifications
- Return created reply information

**Update Department Record Note Reply API**
- Accept reply update data
- Validate update data
- Update department reply
- Return updated reply information

### 3.3 Directives APIs

**Department Directives List API**
- Return list of directives assigned to current department
- Include directive details (title, description, date, reference number, status, priority, deadline, progress)
- Support filtering by status, priority, date range
- Support searching
- Support sorting
- Include pagination metadata

**Department Directive Details API**
- Return complete directive information
- Include directive content, sub-tasks
- Include all replies from department
- Include attachments
- Include timeline and progress

**Department Directive Reply API**
- Accept reply creation data (directive ID, content, status, progress, attachments)
- Validate reply data
- Create reply record for department
- Update directive status if needed
- Send notifications
- Return created reply information

**Update Department Directive Reply API**
- Accept reply update data
- Validate update data
- Update department reply
- Return updated reply information

### 3.4 Announcements APIs

**Department Announcements List API**
- Return list of announcements assigned to current department
- Include announcement details (title, description, date, status)
- Support filtering by status, date range
- Support searching
- Support sorting
- Include pagination metadata

**Department Announcement Details API**
- Return complete announcement information
- Include announcement content, details
- Include all replies from department
- Include attachments

**Department Announcement Reply API**
- Accept reply creation data (announcement ID, content, status, attachments)
- Validate reply data
- Create reply record for department
- Update announcement status if needed
- Send notifications
- Return created reply information

**Update Department Announcement Reply API**
- Accept reply update data
- Validate update data
- Update department reply
- Return updated reply information

### 3.5 CM Remarks APIs

**Department CM Remarks List API**
- Return list of CM remarks assigned to current department
- Include remark details (subject, remark, date, status, priority, deadline, progress)
- Support filtering by status, priority, date range
- Support searching
- Support sorting
- Include pagination metadata

**Department CM Remark Details API**
- Return complete CM remark information
- Include remark content
- Include all replies from department
- Include attachments
- Include timeline and progress

**Department CM Remark Reply API**
- Accept reply creation data (remark ID, content, status, progress, attachments)
- Validate reply data
- Create reply record for department
- Update remark status if needed
- Send notifications
- Return created reply information

**Update Department CM Remark Reply API**
- Accept reply update data
- Validate update data
- Update department reply
- Return updated reply information

### 3.6 Sectoral Meetings APIs

**Department Sectoral Meetings List API**
- Return list of sectoral meetings with agenda points assigned to current department
- Include meeting details (title, description, date, venue, sector, status)
- Include agenda point details assigned to department
- Support filtering by status, date range, sector
- Support searching
- Support sorting
- Include pagination metadata

**Department Sectoral Meeting Agenda Points API**
- Return agenda points assigned to current department for a sectoral meeting
- Include agenda point details (title, description, status, order)
- Support filtering by status
- Support sorting by order
- Include pagination

**Department Sectoral Meeting Agenda Point Reply API**
- Accept reply creation data (agenda point ID, content, status, attachments)
- Validate reply data
- Create reply record for department
- Update agenda point status if needed
- Send notifications
- Return created reply information

**Update Department Sectoral Meeting Agenda Point Reply API**
- Accept reply update data
- Validate update data
- Update department reply
- Return updated reply information

### 3.7 Board Meetings APIs

**Department Board Meetings List API**
- Return list of board meetings with agenda points assigned to current department
- Include meeting details (title, description, date, venue, board, status)
- Include agenda point details assigned to department
- Support filtering by status, date range, board
- Support searching
- Support sorting
- Include pagination metadata

**Department Board Meeting Agenda Points API**
- Return agenda points assigned to current department for a board meeting
- Include agenda point details (title, description, status, order)
- Support filtering by status
- Support sorting by order
- Include pagination

**Department Board Meeting Agenda Point Reply API**
- Accept reply creation data (agenda point ID, content, status, attachments)
- Validate reply data
- Create reply record for department
- Update agenda point status if needed
- Send notifications
- Return created reply information

**Update Department Board Meeting Agenda Point Reply API**
- Accept reply update data
- Validate update data
- Update department reply
- Return updated reply information

### 3.8 Senate Meetings APIs

**Department Senate Meetings List API**
- Return list of senate meetings assigned to current department
- Include meeting details (title, description, date, venue, university, status)
- Support filtering by status, date range, university
- Support searching
- Support sorting
- Include pagination metadata

**Department Senate Meeting Details API**
- Return complete senate meeting information
- Include meeting content, minutes assigned to department
- Include all replies from department
- Include attachments

**Department Senate Meeting Reply API**
- Accept reply creation data (meeting ID or minute ID, content, status, attachments)
- Validate reply data
- Create reply record for department
- Update meeting/minute status if needed
- Send notifications
- Return created reply information

### 3.9 PTF (Provincial Task Force) APIs

**Department PTF Dashboard API**
- Return PTF dashboard statistics for current department
- Include issue counts, status breakdown
- Include district-wise distribution if applicable
- Return data for dashboard display

**Department PTF Issues List API**
- Return list of PTF issues assigned to current department
- Include issue details (title, description, date, status, priority, district, deadline)
- Support filtering by status, priority, date range, district
- Support searching
- Support sorting
- Include pagination metadata

**Department PTF Issue Details API**
- Return complete PTF issue information
- Include issue content, district information
- Include all responses from department
- Include attachments
- Include timeline

**Create Department PTF Issue API**
- Accept PTF issue creation data (title, description, date, priority, district ID)
- Validate issue data
- Create issue record
- Assign to appropriate departments
- Return created issue information

**Department PTF Issue Response API**
- Accept response creation data (issue ID, initial response, final response, attachments)
- Validate response data
- Create response record for department
- Update issue status if needed
- Send notifications
- Return created response information

**Department PTF Departments Dashboard API**
- Return PTF statistics for departments under current department
- Include issue counts and status breakdown
- Support filtering and sorting

### 3.10 PTIs APIs

**Department PTIs List API**
- Return list of PTIs with tasks assigned to current department
- Include PTI details (title, description, start date, end date, status)
- Include task details assigned to department (title, description, status, progress, timeline, deadline)
- Support filtering by status, date range
- Support searching
- Support sorting
- Include pagination metadata
- Group tasks by PTI

**Department PTI Task Details API**
- Return complete PTI task information
- Include task content, PTI information
- Include all comments/replies for task
- Include attachments
- Include timeline and progress

**Department PTI Task Reply/Comment API**
- Accept reply/comment creation data (task ID, content, attachments)
- Validate reply data
- Create reply/comment record
- Send notifications
- Return created reply information

**Update Department PTI Task Reply API**
- Accept reply update data
- Validate update data
- Update department reply
- Return updated reply information

### 3.11 Khushhal Programme APIs

**Department Khushhal Programme List API**
- Return list of Khushhal KPK programs assigned to current department
- Include program details (title, description, status, progress, start date, end date)
- Support filtering by status, date range
- Support searching
- Support sorting
- Include pagination metadata

**Department Khushhal Programme Details API**
- Return complete Khushhal KPK program information
- Include program content, KPI data
- Include all replies from department
- Include attachments
- Include progress information

**Department Khushhal Programme Reply API**
- Accept reply creation data (program ID, content, status, attachments)
- Validate reply data
- Create reply record for department
- Update program status if needed
- Send notifications
- Return created reply information

### 3.12 Summaries APIs

**Department Summaries List API**
- Return list of summaries assigned to current department
- Include summary details (reference number, subject, description, date, initiator department, status)
- Support filtering by status, date range
- Support searching by reference number, subject
- Support sorting
- Include pagination metadata

**Department Summary Details API**
- Return complete summary information
- Include summary content, tasks
- Include all comments and replies
- Include attachments

### 3.13 KPI Data APIs

**Department KPI Data List API**
- Return list of KPI data entries for current department
- Include KPI data details (user, data point, value, month, year, remarks)
- Support filtering by user, month, year, data point
- Support searching
- Support sorting
- Include pagination metadata

**Department KPI Data Details API**
- Return complete KPI data entry information
- Include all KPI data fields and related information

**Create Department KPI Data API**
- Accept KPI data creation data (data point, value, month, year, remarks)
- Validate KPI data
- Create KPI data entry
- Return created KPI data information

**Update Department KPI Data API**
- Accept KPI data update data
- Validate update data
- Update KPI data entry
- Return updated KPI data information

**Delete Department KPI Data API**
- Accept KPI data ID
- Validate deletion
- Delete KPI data entry
- Return confirmation

---

## 4. CS Role APIs

### 4.1 CS Dashboard API

**CS Dashboard API**
- Return CS dashboard data
- Include minutes/record notes statistics
- Include link to minutes reports
- Return data for dashboard display

### 4.2 CS Minutes/Record Notes APIs

**CS Record Notes Report API**
- Return department-wise record notes statistics
- Include department names and overdue minutes count
- Support filtering by department
- Support sorting
- Return data suitable for DataTables
- Calculate overdue counts based on deadlines

**CS Record Notes Detail Report API**
- Return detailed record notes for a specific department and status
- Include all minutes with their details
- Include meeting information
- Include department information
- Support filtering by status (overdue, pending, etc.)
- Return data suitable for DataTables
- Include sequential numbering

---

## 5. CM Role APIs

CM (Chief Minister) role shares all Admin role APIs. CM users have access to:
- All Admin Dashboard APIs
- All User Management APIs (with restrictions based on permissions)
- All Module Management APIs (Minutes, Directives, Announcements, CM Remarks, PTIs, etc.)
- All Reports APIs
- All Board, Sectoral, Schemes, Inaugurations APIs
- All other Admin APIs

**Note:** CM role permissions should be checked on the backend to ensure CM users only have access to modules they have permissions for, similar to how Admin users have permission-based access.

---

## 6. Data Entry Role APIs

Data Entry role shares Admin role APIs but with limited permissions. Data Entry users have access to:
- Admin Dashboard APIs
- Minutes/Record Notes APIs (read and create/update)
- Directives APIs (read and create/update)
- Announcements APIs (read and create/update)
- PTIs APIs (read and create/update)
- Summaries APIs (read and create/update)
- Trackers/Interventions APIs (read and create/update)
- CM Remarks APIs (read and create/update)
- Inaugurations APIs (read and create/update)
- Sectoral Meetings APIs (read and create/update)
- Board Meetings APIs (read and create/update)
- Board Acts APIs (read and create/update)
- Board Members APIs (read and create/update)
- Limited Reports APIs (Record Notes, Directives, Board Meetings, Inaugurations)

**Note:** Data Entry users typically do NOT have access to:
- User Management APIs
- Department Management APIs
- Settings APIs
- Activity Logs APIs
- Tags APIs
- Most Reports APIs (only specific ones)

**Permission checks should be enforced on the backend for Data Entry users.**

---

## 7. Common/Shared APIs

### 7.1 File Upload APIs

**File Upload API**
- Accept single file upload
- Validate file type and size
- Store file securely
- Return file URL and metadata
- Support progress tracking

**Multiple Files Upload API**
- Accept multiple file uploads
- Validate all files
- Store files securely
- Return file URLs and metadata
- Support progress tracking

**File Delete API**
- Accept file ID or URL
- Delete file from storage
- Return confirmation

**File Download API**
- Accept file ID or URL
- Return file for download
- Support secure access

### 7.2 Notifications APIs

**Notifications List API**
- Return paginated list of notifications for current user
- Include notification details (type, title, message, read status, date, action URL)
- Support filtering by read status, type, date range
- Support sorting
- Include pagination metadata

**Notification Details API**
- Return complete notification information
- Mark notification as read if accessed
- Return notification data

**Mark Notification as Read API**
- Accept notification ID
- Mark notification as read
- Return confirmation

**Mark All Notifications as Read API**
- Mark all notifications for current user as read
- Return confirmation

**Notification Count API**
- Return count of unread notifications for current user
- Return count data

### 7.3 Search APIs

**Global Search API**
- Accept search query
- Search across all modules user has access to
- Return search results grouped by module
- Include result details and links
- Support filtering by module
- Support sorting
- Include pagination

**Module-Specific Search API**
- Accept search query and module name
- Search within specific module
- Return search results
- Support filtering and sorting
- Include pagination

### 7.4 Export APIs

**Export to Excel API**
- Accept data type and filters
- Generate Excel file
- Return file download
- Support various data types (users, minutes, directives, etc.)

**Export to CSV API**
- Accept data type and filters
- Generate CSV file
- Return file download
- Support various data types

**Export to PDF API**
- Accept data type and filters
- Generate PDF file
- Return file download
- Support various data types and report formats

### 7.5 Dropdown/Select Data APIs

**Departments Dropdown API**
- Return list of departments for dropdown
- Include department ID and name
- Support filtering by type, parent
- Support searching

**Users Dropdown API**
- Return list of users for dropdown
- Include user ID, name, email
- Support filtering by role, department
- Support searching

**Roles Dropdown API**
- Return list of roles for dropdown
- Include role ID and name

**Districts Dropdown API**
- Return list of districts for dropdown
- Include district ID and name
- Support searching

**Boards Dropdown API**
- Return list of boards for dropdown
- Include board ID and name
- Support searching

**Sectors Dropdown API**
- Return list of sectors for dropdown
- Include sector ID and name
- Support searching

**Candidates Dropdown API**
- Return list of candidates for dropdown
- Include candidate ID and name
- Support filtering by constituency, party
- Support searching

**Officers Dropdown API**
- Return list of officers for dropdown
- Include officer ID, name, designation
- Support filtering by department
- Support searching

### 7.6 Statistics APIs

**Module Statistics API**
- Return statistics for a specific module
- Include counts, status breakdown, trends
- Support filtering by date range, department
- Return aggregated data

**Department Statistics API**
- Return statistics for a specific department
- Include module-wise breakdown
- Include task counts, completion rates
- Support filtering by date range, modules

**User Statistics API**
- Return statistics for a specific user
- Include activity counts, module-wise breakdown
- Support filtering by date range

### 7.7 Validation APIs

**Email Validation API**
- Accept email address
- Check if email exists
- Check if email is available for new user
- Return validation result

**Reference Number Validation API**
- Accept reference number and module type
- Check if reference number exists
- Check if reference number is available
- Return validation result

### 7.8 Activity Tracking APIs

**Log Activity API**
- Accept activity data (action, module, entity, description)
- Log activity for current user
- Include IP address and user agent
- Return confirmation

**Activity History API**
- Return activity history for an entity
- Include all activities related to entity
- Support filtering by action, user, date range
- Support sorting
- Include pagination

---

## 8. API Requirements Summary

### 8.1 Authentication & Security

- All APIs (except login) require authentication token
- Token should be included in request headers
- Backend should validate token on every request
- Backend should check user permissions for each API call
- Backend should return appropriate error codes (401 for unauthorized, 403 for forbidden)

### 8.2 Data Validation

- All APIs should validate input data
- Return validation errors with clear messages
- Validate file uploads (type, size)
- Validate date ranges and formats
- Validate required fields

### 8.3 Pagination

- List APIs should support pagination
- Include page number, per page count, total count, total pages
- Return pagination metadata in response

### 8.4 Filtering & Sorting

- List APIs should support filtering by various fields
- Support multiple filter criteria
- Support sorting by various fields
- Support ascending and descending order

### 8.5 Searching

- List APIs should support text search
- Search across relevant fields
- Return search results with highlighting if possible

### 8.6 File Handling

- Support file uploads (single and multiple)
- Support file downloads
- Support file deletion
- Validate file types and sizes
- Store files securely

### 8.7 Notifications

- Send notifications on relevant actions (replies, status changes, assignments)
- Support different notification types
- Track notification read status

### 8.8 Error Handling

- Return appropriate HTTP status codes
- Return clear error messages
- Handle validation errors
- Handle server errors gracefully
- Log errors for debugging

### 8.9 Response Format

- Use consistent response format
- Include success/error indicators
- Include data payload
- Include metadata (pagination, filters, etc.)
- Include timestamps where relevant

### 8.10 Performance

- Optimize database queries
- Support caching where appropriate
- Minimize response payload size
- Support compression
- Handle large datasets efficiently

---

## 9. Role-Based Access Summary

### Admin Role
- Full access to all APIs
- Can manage users, departments, all modules
- Can access all reports
- Permission-based restrictions for super-admin features

### Department Role
- Access to department-specific APIs
- Can view and reply to assigned items
- Can create PTF issues
- Can manage KPI data
- Limited to their department's data

### CS Role
- Access to CS dashboard
- Access to minutes/record notes reports
- Limited to CS-specific functionality

### CM Role
- Access to all Admin APIs
- Permission-based restrictions
- Similar to Admin but with specific permission checks

### Data Entry Role
- Access to limited Admin APIs
- Can create and update data in assigned modules
- Cannot manage users or departments
- Limited reports access

---

## 10. Notes for Backend Development

1. **Permission System**: Implement a robust permission system that checks user permissions for each API call. Permissions should be role-based but can also be user-specific.

2. **Soft Deletes**: Most delete operations should be soft deletes (mark as deleted, don't actually delete from database) to maintain data integrity and audit trails.

3. **Audit Logging**: Log all create, update, and delete operations with user information, timestamps, and change details.

4. **File Storage**: Implement secure file storage with proper access controls. Files should be associated with the entities they belong to.

5. **Notifications**: Implement a notification system that sends notifications when relevant actions occur (replies, status changes, new assignments).

6. **Caching**: Consider implementing caching for frequently accessed data like dropdown lists, statistics, and dashboard data.

7. **Rate Limiting**: Implement rate limiting to prevent abuse and ensure system stability.

8. **Data Validation**: Implement comprehensive data validation on the backend, even if frontend validation exists.

9. **Error Messages**: Provide clear, user-friendly error messages that help users understand what went wrong and how to fix it.

10. **API Versioning**: Consider API versioning for future compatibility and updates.

---

---

## 11. Complete API Coverage Summary

### 11.1 Admin Role - All Modules Covered

✅ **Authentication & Authorization** (8 APIs)
- Login, Logout, Token Refresh, Password Reset, Session Management, Permissions, Profile

✅ **Dashboard** (3 APIs)
- Department-Wise Dashboard, Summary Cards, Chart Data

✅ **User Management** (10 APIs)
- List, Details, Create, Update, Delete, Departments Assignment, Permissions Assignment, API Tokens, Export

✅ **Department Management** (5 APIs)
- List, Details, Create, Update, Delete

✅ **Minutes/Record Notes** (10 APIs)
- List, Details, Create, Update, Delete, Department Assignment, Replies (Create/Update), Attachments

✅ **Directives** (10 APIs)
- List, Details, Create, Update, Delete, Department Assignment, Replies (Create/Update), Sub-Tasks

✅ **Announcements** (10 APIs)
- List, Details, Create, Update, Delete, Department Assignment, Replies (Create/Update), Details Management

✅ **CM Remarks** (8 APIs)
- List, Details, Create, Update, Delete, Department Assignment, Replies (Create/Update)

✅ **PTIs** (15 APIs)
- List, Details (Show), Create, Update, Delete, Tasks (List/Create/Update/Delete), Task Department Assignment, Task Replies/Comments (Create/Update), Reports (Summary/Detail)

✅ **Summaries** (12 APIs)
- List, Details (Show), Create, Update, Delete, Tasks (List/Create/Update/Delete), Task Department Assignment, Attachments, Reports (Summary/Detail)

✅ **Trackers/Interventions** (12 APIs)
- List, Details (Show), Create, Update, Delete, Activities (List/Create/Update/Delete), Department Assignment, Activity Replies (Create/Update)

✅ **Board Meetings** (10 APIs)
- List, Details (Show), Create, Update, Delete, Agenda Points (List/Create/Update), Agenda Point Replies (Create/Update)

✅ **Board Acts** (5 APIs)
- List, Details (Show), Create, Update, Delete

✅ **Board Members** (5 APIs)
- List, Details, Create, Update, Delete

✅ **Sectoral Meetings** (10 APIs)
- List, Details, Create, Update, Delete, Agenda Points (List/Create/Update), Agenda Point Replies (Create/Update), Related Departments

✅ **Schemes** (5 APIs)
- List, Details, Create, Update, Delete

✅ **Inaugurations** (5 APIs)
- List, Details, Create, Update, Delete

✅ **Khushhal KPK** (11 APIs)
- List, Details (Show), Create, Update, Delete, Replies (Create/Update), Progress (List/Create/Update/Delete)

✅ **Review Meetings** (5 APIs)
- List, Details, Create, Update, Delete

✅ **Candidate Requests** (5 APIs)
- List, Details, Create, Update, Delete

✅ **Officers** (6 APIs)
- List, Details, Create, Update, Delete, Departments

✅ **Officer Departments** (5 APIs)
- List, Details, Create, Update, Delete

✅ **Candidates** (5 APIs)
- List, Details, Create, Update, Delete

✅ **Funds Distribution** (8 APIs)
- Annual Schemes (List/Details/Create/Update/Delete), Distributions (List/Details/Create/Update), Distributed Schemes

✅ **Tags** (5 APIs)
- List, Details, Create, Update, Delete

✅ **Activity Logs** (2 APIs)
- List, Details

✅ **Settings** (1 API)
- User Settings

✅ **Tasks** (6 APIs)
- Details (Show), Comments (List/Create/Update/Delete), Department Status Update

✅ **PTF** (12 APIs)
- Issues (List/Details/Create/Update/Delete), Responses (Create/Update), History, Department Assignment, Meetings (List/Details/Create), Reports (Dashboard/Meetings/Department-Wise/District-Wise/Detail)

✅ **Reports** (30+ APIs)
- Department-Wise, Cabinet (4 reports), Board (6 reports), PTF (8 reports), PTIs (2 reports), Summaries (2 reports), Inaugurations, Review Meetings (2 reports), Khushhal KPK, KPI Data (4 reports), PMRU (2 reports), DC Inspection, Filter Record Notes, Record Notes (4 reports), MNA/MPA Posting Recommendation

✅ **PDF Generation** (15+ APIs)
- Dashboard, Record Notes (4 PDFs), Directives, Announcements, CM Remarks, PTF, Board (2 PDFs), Summary, Task, Various Reports

✅ **Log Viewer** (2 APIs)
- Log Files List, Log File Content

### 11.2 Department Role - All Modules Covered

✅ **Dashboard** (1 API)
- Department Dashboard

✅ **Record Notes** (4 APIs)
- List, Details, Reply (Create/Update)

✅ **Directives** (4 APIs)
- List, Details, Reply (Create/Update)

✅ **Announcements** (4 APIs)
- List, Details, Reply (Create/Update)

✅ **CM Remarks** (4 APIs)
- List, Details, Reply (Create/Update)

✅ **Sectoral Meetings** (4 APIs)
- List, Agenda Points, Reply (Create/Update)

✅ **Board Meetings** (4 APIs)
- List, Agenda Points, Reply (Create/Update)

✅ **Senate Meetings** (3 APIs)
- List, Details, Reply

✅ **PTF** (5 APIs)
- Dashboard, Issues List, Issue Details, Create Issue, Response, Departments Dashboard

✅ **PTIs** (4 APIs)
- List, Task Details, Reply/Comment (Create/Update)

✅ **Khushhal Programme** (3 APIs)
- List, Details, Reply

✅ **Summaries** (2 APIs)
- List, Details

✅ **KPI Data** (5 APIs)
- List, Details (Show), Create, Update, Delete

### 11.3 CS Role - All Modules Covered

✅ **Dashboard** (1 API)
- CS Dashboard

✅ **Minutes/Record Notes** (2 APIs)
- Report (Department-wise), Detail Report

### 11.4 CM Role - All Modules Covered

✅ **Shares all Admin Role APIs** with permission-based restrictions

### 11.5 Data Entry Role - All Modules Covered

✅ **Shares limited Admin Role APIs** (read/create/update access, no user/department management)

### 11.6 Common/Shared APIs - All Covered

✅ **File Upload/Download** (4 APIs)
- Single Upload, Multiple Upload, Delete, Download

✅ **Notifications** (5 APIs)
- List, Details, Mark as Read, Mark All as Read, Count

✅ **Search** (2 APIs)
- Global Search, Module-Specific Search

✅ **Export** (3 APIs)
- Export to Excel, CSV, PDF

✅ **Dropdowns** (8 APIs)
- Departments, Users, Roles, Districts, Boards, Sectors, Candidates, Officers

✅ **Statistics** (3 APIs)
- Module Statistics, Department Statistics, User Statistics

✅ **Validation** (2 APIs)
- Email Validation, Reference Number Validation

✅ **Activity Tracking** (2 APIs)
- Log Activity, Activity History

### 11.7 Total API Count

- **Admin Role APIs:** ~350+ APIs
- **Department Role APIs:** ~50+ APIs
- **CS Role APIs:** 3 APIs
- **CM Role APIs:** Shares Admin APIs
- **Data Entry Role APIs:** Shares limited Admin APIs
- **Common/Shared APIs:** ~30+ APIs

**Total Unique APIs:** ~400+ APIs

### 11.8 All Actions Covered

✅ **CRUD Operations**
- Create (All modules)
- Read/List (All modules)
- Update/Edit (All modules)
- Delete (All modules)

✅ **Reply/Comment Operations**
- Create Reply/Comment (All reply-enabled modules)
- Update Reply/Comment (All reply-enabled modules)
- List Replies/Comments (All reply-enabled modules)

✅ **Assignment Operations**
- Department Assignment (Minutes, Directives, Announcements, CM Remarks, Trackers, etc.)
- User Assignment (Where applicable)
- Permission Assignment (Users)

✅ **File Operations**
- Upload (Single/Multiple)
- Download
- Delete

✅ **Report Operations**
- Generate Reports (All report types)
- Filter Reports
- Export Reports (Excel, CSV, PDF)

✅ **Task Operations**
- Create Task (PTIs, Summaries)
- Update Task
- Delete Task
- Task Department Assignment
- Task Comments

✅ **Status/Progress Operations**
- Update Status
- Update Progress
- Status History

✅ **Print/PDF Operations**
- Generate PDF (All PDF-enabled modules)
- Print Views

### 11.9 All Pages Covered

✅ **Admin Pages**
- Dashboard ✅
- All List Pages ✅
- All Add/Create Pages ✅
- All Edit Pages ✅
- All Show/Details Pages ✅
- All Reply Pages ✅
- All Report Pages ✅
- All PDF Pages ✅

✅ **Department Pages**
- Dashboard ✅
- All List Pages ✅
- All Details Pages ✅
- All Reply Pages ✅
- All Create Pages (PTF Issues, KPI Data) ✅

✅ **CS Pages**
- Dashboard ✅
- All Report Pages ✅

✅ **All Modal Actions**
- Add Task Modal ✅
- Edit Task Modal ✅
- Edit Departments Modal ✅
- Add Detail Modal ✅
- Edit Detail Modal ✅
- Responsible Departments Modal ✅
- All other modals ✅

### 11.10 Verification Checklist

- [x] All Admin modules covered
- [x] All Department modules covered
- [x] All CS modules covered
- [x] All CM modules covered (shares admin)
- [x] All Data Entry modules covered (shares admin)
- [x] All CRUD operations covered
- [x] All Reply/Comment operations covered
- [x] All Assignment operations covered
- [x] All File operations covered
- [x] All Report operations covered
- [x] All Task operations covered
- [x] All Status/Progress operations covered
- [x] All PDF/Print operations covered
- [x] All List pages covered
- [x] All Create pages covered
- [x] All Edit pages covered
- [x] All Show/Details pages covered
- [x] All Reply pages covered
- [x] All Report pages covered
- [x] All Modal actions covered
- [x] All Filter/Search operations covered
- [x] All Export operations covered
- [x] All Dropdown data APIs covered
- [x] All Validation APIs covered
- [x] All Notification APIs covered
- [x] All Activity tracking APIs covered

---

**End of Backend API Requirements Guide**

This document covers **ALL APIs needed** for the CMDMS Frontend application. Every module, every page, every action, and every role has been documented. Each API should be implemented according to the role-based access requirements and should include proper authentication, validation, error handling, and response formatting.

**Total Coverage: 100%** ✅

