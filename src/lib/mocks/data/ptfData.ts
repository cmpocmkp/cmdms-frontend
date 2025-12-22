/**
 * Mock Data for PTF (Provincial Task Force) Module
 */

import { faker } from '@faker-js/faker';
import { mockDepartments } from './departments';

export interface PTFDepartment {
  id: number;
  name: string;
  total: number;
  completed: number;
  on_target: number;
  on_going: number;
  off_target: number;
  overdue: number;
  overdue_other: number;
  off_target_other: number;
}

export interface PTFDepartmentAssignment {
  department_id: number;
  department: {
    id: number;
    name: string;
  };
  total: number;
  assigned: number;
  open: number;
  response_pending: number;
  initial_response: number;
  closed: number;
  on_target: number;
  critically_delayed: number;
}

export interface PTFDepartmentRelationship {
  assignment_department_id: number;
  assignment_department_name: string;
  issue_department_id: number;
  issue_department_name: string;
  total: number;
  assigned: number;
  initial_response: number;
  response_pending: number;
  open: number;
  closed: number;
  on_target: number;
  critically_delayed: number;
}

export interface PTFDistrictWiseReport {
  department_id: number;
  department: {
    id: number;
    name: string;
  };
  total: number;
  pending: number;
  open: number;
  rejected: number;
  closed: number;
  critically_delayed: number;
  on_target: number;
}

// Generate mock PTF departments with meeting minutes counts
export function generateMockPTFDepartments(): PTFDepartment[] {
  // Filter main departments (exclude Admin, Data Entry, Department, and ID 177)
  const mainDepartments = mockDepartments.filter(
    dept => dept.department_type_id === 1 && 
    dept.id !== 177 &&
    !['Admin', 'Data Entry', 'Department'].includes(dept.name)
  );

  return mainDepartments.map(dept => {
    const total = faker.number.int({ min: 0, max: 60 });
    const completed = faker.number.int({ min: 0, max: Math.floor(total * 0.4) });
    const on_target = faker.number.int({ min: 0, max: Math.floor(total * 0.3) });
    const on_going = faker.number.int({ min: 0, max: Math.floor(total * 0.2) });
    const off_target = faker.number.int({ min: 0, max: Math.floor(total * 0.1) });
    const overdue = faker.number.int({ min: 0, max: Math.floor(total * 0.1) });
    const off_target_other = faker.number.int({ min: 0, max: Math.floor(total * 0.05) });
    const overdue_other = faker.number.int({ min: 0, max: Math.floor(total * 0.05) });

    return {
      id: Number(dept.id),
      name: dept.name,
      total,
      completed,
      on_target,
      on_going,
      off_target,
      overdue,
      overdue_other,
      off_target_other
    };
  });
}

// Generate mock PTF department assignments for department-wise report
export function generateMockPTFDepartmentAssignments(): PTFDepartmentAssignment[] {
  const mainDepartments = mockDepartments.filter(
    dept => dept.department_type_id === 1 && 
    dept.id !== 177 &&
    !['Admin', 'Data Entry', 'Department'].includes(dept.name)
  );

  return mainDepartments.map(dept => {
    const total = faker.number.int({ min: 5, max: 100 });
    const assigned = total;
    const open = faker.number.int({ min: 0, max: Math.floor(total * 0.6) });
    const closed = faker.number.int({ min: 0, max: Math.floor(total * 0.4) });
    const initial_response = faker.number.int({ min: 0, max: Math.floor(total * 0.7) });
    const response_pending = total - initial_response;
    const on_target = faker.number.int({ min: 0, max: Math.floor(open * 0.6) });
    const critically_delayed = open - on_target;

    return {
      department_id: Number(dept.id),
      department: {
        id: Number(dept.id),
        name: dept.name
      },
      total,
      assigned,
      open,
      response_pending,
      initial_response,
      closed,
      on_target,
      critically_delayed
    };
  });
}

// Generate mock PTF department relationships for department-wise report
export function generateMockPTFDepartmentRelationships(): PTFDepartmentRelationship[] {
  const mainDepartments = mockDepartments.filter(
    dept => dept.department_type_id === 1 && 
    dept.id !== 177 &&
    !['Admin', 'Data Entry', 'Department'].includes(dept.name)
  ).slice(0, 15); // Limit to first 15 for manageable data

  const relationships: PTFDepartmentRelationship[] = [];

  // Create relationships between departments
  mainDepartments.forEach((assignmentDept, idx) => {
    // Each assignment department has relationships with 2-4 issue departments
    const numRelationships = faker.number.int({ min: 2, max: 4 });
    const selectedIssueDepts = faker.helpers.arrayElements(
      mainDepartments.filter(d => d.id !== assignmentDept.id),
      numRelationships
    );

    selectedIssueDepts.forEach(issueDept => {
      const total = faker.number.int({ min: 1, max: 30 });
      const assigned = total;
      const initial_response = faker.number.int({ min: 0, max: Math.floor(total * 0.7) });
      const response_pending = total - initial_response;
      const open = faker.number.int({ min: 0, max: Math.floor(total * 0.6) });
      const closed = faker.number.int({ min: 0, max: Math.floor(total * 0.4) });
      const on_target = faker.number.int({ min: 0, max: Math.floor(open * 0.6) });
      const critically_delayed = open - on_target;

      relationships.push({
        assignment_department_id: Number(assignmentDept.id),
        assignment_department_name: assignmentDept.name,
        issue_department_id: Number(issueDept.id),
        issue_department_name: issueDept.name,
        total,
        assigned,
        initial_response,
        response_pending,
        open,
        closed,
        on_target,
        critically_delayed
      });
    });
  });

  return relationships;
}

// Generate mock PTF district-wise report data
export function generateMockPTFDistrictWiseReport(): PTFDistrictWiseReport[] {
  const mainDepartments = mockDepartments.filter(
    dept => dept.department_type_id === 1 && 
    dept.id !== 177 &&
    !['Admin', 'Data Entry', 'Department'].includes(dept.name)
  );

  return mainDepartments.map(dept => {
    const total = faker.number.int({ min: 5, max: 150 });
    const pending = faker.number.int({ min: 0, max: Math.floor(total * 0.3) });
    const open = faker.number.int({ min: 0, max: Math.floor(total * 0.4) });
    const rejected = faker.number.int({ min: 0, max: Math.floor(total * 0.1) });
    const closed = faker.number.int({ min: 0, max: Math.floor(total * 0.4) });
    
    // On target: status = 1 (open) with timeline > today
    const on_target = faker.number.int({ min: 0, max: Math.floor(open * 0.6) });
    // Critically delayed: status = 1 (open) with timeline < today
    const critically_delayed = Math.max(0, open - on_target);

    return {
      department_id: Number(dept.id),
      department: {
        id: Number(dept.id),
        name: dept.name
      },
      total,
      pending,
      open,
      rejected,
      closed,
      critically_delayed,
      on_target
    };
  });
}
