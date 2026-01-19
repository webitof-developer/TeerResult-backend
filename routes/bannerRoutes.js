import express from 'express';
import {
  createBanner,
  getBanners,
  getActiveBanners,
  getBanner,
  updateBanner,
  toggleBannerActive,
  deleteBanner,
} from '../controller/bannerController.js';

import upload  from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/active', getActiveBanners);



router.post('/', upload.single('image'), createBanner);
router.get('/', getBanners);
router.get('/:id', getBanner);
router.put('/:id', upload.single('image'), updateBanner);
router.patch('/:id/toggle', toggleBannerActive);
router.delete('/:id', deleteBanner);

export default router;
