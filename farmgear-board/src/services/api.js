import request from '../utils/request';

export const login = (data) => {
  return request.post('/auth/login', data);
};

export const getMachineList = () => {
  return request.get('/machine/list');
};

export const getMachine = (id) => {
  return request.get(`/machine/${id}`);
};

export const addMachine = (data) => {
  return request.post('/machine/add', data);
};

export const updateMachine = (data) => {
  return request.put('/machine/update', data);
};

export const deleteMachine = (id) => {
  return request.delete(`/machine/${id}`);
};

export const getMachineTypes = () => {
  return request.get('/machine/type/list');
};

export const getMaintenanceRecords = (machineId) => {
  return request.get(`/machine/${machineId}/maintenance-records`);
};

export const addMaintenanceRecord = (data) => {
  return request.post('/machine/maintenance-record', data);
};

export const getMaintenanceInfo = (machineId) => {
  return request.get(`/machine/${machineId}/maintenance-info`);
};

export const getMachinesNeedingMaintenance = () => {
  return request.get('/machine/needs-maintenance');
};

export const getDriverList = () => {
  return request.get('/driver/list');
};

export const getAvailableDrivers = () => {
  return request.get('/driver/available');
};

export const addDriver = (data) => {
  return request.post('/driver/add', data);
};

export const updateDriver = (data) => {
  return request.put('/driver/update', data);
};

export const deleteDriver = (id) => {
  return request.delete(`/driver/${id}`);
};

export const getWorkItemList = () => {
  return request.get('/work-item/list');
};

export const addWorkItem = (data) => {
  return request.post('/work-item/add', data);
};

export const updateWorkItem = (data) => {
  return request.put('/work-item/update', data);
};

export const deleteWorkItem = (id) => {
  return request.delete(`/work-item/${id}`);
};

export const getWorkRequirementList = () => {
  return request.get('/work-requirement/list');
};

export const submitWorkRequirement = (data) => {
  return request.post('/work-requirement/submit', data);
};

export const updateWorkRequirement = (data) => {
  return request.put('/work-requirement/update', data);
};

export const deleteWorkRequirement = (id) => {
  return request.delete(`/work-requirement/${id}`);
};

export const getWorkScheduleList = () => {
  return request.get('/work-schedule/list');
};

export const checkScheduleConflict = (data) => {
  return request.post('/work-schedule/check-conflict', data);
};

export const createWorkSchedule = (data) => {
  return request.post('/work-schedule/create', data);
};

export const updateWorkSchedule = (data) => {
  return request.put('/work-schedule/update', data);
};

export const cancelWorkSchedule = (id) => {
  return request.put(`/work-schedule/${id}/cancel`);
};

export const deleteWorkSchedule = (id) => {
  return request.delete(`/work-schedule/${id}`);
};

export const getWorkRecordList = () => {
  return request.get('/work-record/list');
};

export const getWorkRecordFromSchedule = (scheduleId) => {
  return request.get(`/work-record/from-schedule/${scheduleId}`);
};

export const createWorkRecord = (data) => {
  return request.post('/work-record/create', data);
};

export const updateWorkRecord = (data) => {
  return request.put('/work-record/update', data);
};

export const deleteWorkRecord = (id) => {
  return request.delete(`/work-record/${id}`);
};

export const calculateCost = (params) => {
  return request.get('/work-record/calculate-cost', { params });
};

export const getReceiptByRecord = (recordId) => {
  return request.get(`/work-receipt/by-record/${recordId}`);
};

export const confirmReceipt = (id, signature) => {
  return request.post(`/work-receipt/${id}/confirm`, null, { params: { signature } });
};

export const disputeReceipt = (id, disputeContent) => {
  return request.post(`/work-receipt/${id}/dispute`, null, { params: { disputeContent } });
};

export const getReceiptStatistics = () => {
  return request.get('/work-receipt/statistics');
};
