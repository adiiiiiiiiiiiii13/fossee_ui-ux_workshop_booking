import api from './api';

export async function getChoices() {
  const response = await api.get('/choices/');
  return response.data.data;
}

export async function getStatus() {
  const response = await api.get('/status/');
  return response.data.data;
}

export async function proposeWorkshop(payload) {
  const response = await api.post('/workshops/propose/', {
    workshop_type: payload.workshopTypeId,
    date: payload.date,
    tnc_accepted: payload.tncAccepted,
  });
  return response.data.data;
}

export async function getWorkshopTypes(page = 1) {
  const response = await api.get(`/workshop-types/?page=${page}`);
  return response.data.data;
}

export async function getWorkshopTypeDetail(id) {
  const response = await api.get(`/workshop-types/${id}/`);
  return response.data.data.workshopType;
}

export async function createWorkshopType(formData) {
  const response = await api.post('/workshop-types/create/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data.workshopType;
}

export async function updateWorkshopType(id, formData) {
  const response = await api.post(`/workshop-types/${id}/update/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data.workshopType;
}

export async function deleteAttachment(workshopTypeId, fileId) {
  const response = await api.post(`/workshop-types/${workshopTypeId}/attachments/${fileId}/delete/`);
  return response.data;
}

export async function getWorkshopTnc(id) {
  const response = await api.get(`/workshop-types/${id}/tnc/`);
  return response.data.data.tnc;
}

export async function getWorkshopDetail(id) {
  const response = await api.get(`/workshops/${id}/`);
  return response.data.data.workshop;
}

export async function addWorkshopComment(id, payload) {
  const response = await api.post(`/workshops/${id}/comments/`, payload);
  return response.data.data.comment;
}

export async function acceptWorkshop(id) {
  const response = await api.post(`/workshops/${id}/accept/`);
  return response.data.data.workshop;
}

export async function rescheduleWorkshop(id, newDate) {
  const response = await api.post(`/workshops/${id}/reschedule/`, { new_date: newDate });
  return response.data.data.workshop;
}

export async function getOwnProfile() {
  const response = await api.get('/profile/me/');
  return response.data.data.profile;
}

export async function updateOwnProfile(payload) {
  const response = await api.post('/profile/me/update/', payload);
  return response.data.data.profile;
}

export async function getPublicProfile(userId) {
  const response = await api.get(`/profile/${userId}/`);
  return response.data.data;
}
