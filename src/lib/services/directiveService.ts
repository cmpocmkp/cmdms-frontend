/**
 * Directive Service
 * Switches between mock and real API based on USE_MOCK_DATA flag
 * 
 * Components should import from here, never from mock services directly
 */

import { USE_MOCK_DATA } from '../api';
import * as mockService from '../mocks/services/mockDirectiveService';
// TODO: Import real service when backend is ready
// import * as realService from './realDirectiveService';

/**
 * All methods automatically switch between mock and real based on flag
 */
export const directiveService = {
  getAll: USE_MOCK_DATA 
    ? mockService.getAllDirectives 
    : mockService.getAllDirectives, // TODO: Replace with realService.getAllDirectives
    
  getById: USE_MOCK_DATA
    ? mockService.getDirective
    : mockService.getDirective, // TODO: Replace with realService.getDirective
    
  create: USE_MOCK_DATA
    ? mockService.createDirective
    : mockService.createDirective, // TODO: Replace with realService.createDirective
    
  update: USE_MOCK_DATA
    ? mockService.updateDirective
    : mockService.updateDirective, // TODO: Replace with realService.updateDirective
    
  delete: USE_MOCK_DATA
    ? mockService.deleteDirective
    : mockService.deleteDirective, // TODO: Replace with realService.deleteDirective
    
  getByDepartment: USE_MOCK_DATA
    ? mockService.getDepartmentDirectives
    : mockService.getDepartmentDirectives, // TODO: Replace with realService.getDepartmentDirectives
    
  getStats: USE_MOCK_DATA
    ? mockService.getDirectiveStats
    : mockService.getDirectiveStats, // TODO: Replace with realService.getDirectiveStats
};

/**
 * Example usage in components:
 * 
 * import { directiveService } from '@/lib/services/directiveService';
 * 
 * const { data, pagination } = await directiveService.getAll({ page: 1 });
 * const directive = await directiveService.getById(1);
 * await directiveService.create({ title: 'New Directive', ... });
 */

