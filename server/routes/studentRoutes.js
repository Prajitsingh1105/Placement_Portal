import express from 'express';
import { getProfile, submitDoubt, getMyDoubts, applyForJob, getMyApplications } from '../controllers/studentController.js';
import { requireStudentAuth } from '../middlewares/clerkAuth.js';

const router = express.Router();

router.use(requireStudentAuth);

router.get('/profile', getProfile);
router.post('/doubts', submitDoubt);
router.get('/doubts', getMyDoubts);
router.post('/apply', applyForJob);
router.get('/applications', getMyApplications);

export default router;
