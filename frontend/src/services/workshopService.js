/**
 * workshopService.js
 *
 * Maps to existing Django workshop_app URLs:
 *   GET  /workshop/types/            → workshop_type_list
 *   GET  /workshop/type_details/:id  → workshop_type_details
 *   GET  /workshop/type_tnc/:id      → workshop_type_tnc  (returns JSON already)
 *   POST /workshop/propose/          → propose_workshop
 */
import api from './api';

/**
 * Fetch paginated list of workshop types.
 * @param {number} page - Page number (Django paginator, 12 per page)
 */
export const getWorkshopTypes = (page = 1) =>
  api.get(`/workshop/types/?page=${page}`);

/**
 * Fetch Terms & Conditions for a specific workshop type.
 * This is the only endpoint that already returns JSON from Django.
 * @param {number} id
 */
export const getWorkshopTnC = (id) =>
  api.get(`/workshop/type_tnc/${id}/`);

/**
 * Propose a new workshop (POST form data to Django).
 * Django expects: workshop_type, date  (same as WorkshopForm fields)
 * @param {{ workshopTypeId: number, date: string }} data
 */
export const proposeWorkshop = ({ workshopTypeId, date }) => {
  const formData = new URLSearchParams();
  formData.append('workshop_type', workshopTypeId);
  formData.append('date', date);
  return api.post('/workshop/propose/', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};
