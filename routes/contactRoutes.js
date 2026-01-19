import express from 'express';
import {
  createContact,
  getContacts,
  getContact,
  markAsRead,
  deleteContact,
  getContactsCount,
} from '../controller/contactController.js';


const router = express.Router();

// Public route
router.post('/', createContact);

router.get('/', getContacts);
router.get('/count', getContactsCount);
router.get('/:id', getContact);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteContact);



export default router;
