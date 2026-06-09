import { Router } from 'express';
import multer from 'multer';
import { attachmentController } from '../controllers/attachment.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

const storage = multer.memoryStorage();

// Set the maximum file size to 10MB (for videos/docs/excel)
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Accept images, videos, pdfs, docs, and excel files
    const allowedMimeTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/quicktime',
      'application/pdf',
      'application/msword', // doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
      'application/vnd.ms-excel', // xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed types: images, videos, pdfs, word, and excel files.'));
    }
  },
});

// Custom middleware to enforce specific size limits per type
const validateFileSize = (req: any, res: any, next: any) => {
  if (!req.file) {
    return next();
  }

  const { mimetype, size } = req.file;

  // 5MB limit for images
  if (mimetype.startsWith('image/')) {
    if (size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image size must not exceed 5MB.' });
    }
  }

  next();
};

router.use(requireAuth);

router.post(
  '/upload',
  (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  validateFileSize,
  attachmentController.upload
);

router.get('/project/:projectId', attachmentController.getByProject);
router.get('/task/:taskId', attachmentController.getByTask);
router.get('/team/:teamId', attachmentController.getByTeam);
router.delete('/:id', attachmentController.delete);

export default router;
