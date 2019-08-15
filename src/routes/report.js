import express from 'express';
import middlewares from '../middlewares';
import reportController from '../controllers/ReportController';

const { createReport, getReports, markAsHandled } = reportController;

const { verifyToken, reportValidator, authorizeUser } = middlewares;
const validate = reportValidator.createReport;
const validateGetReport = reportValidator.getReport;
const validateMarkAsRead = reportValidator.markAsHandled;

const router = express.Router();

const adminRoles = ['admin', 'superadmin'];


router.post('/novels/:slug/report', verifyToken, validate, createReport);
router.get('/report', verifyToken, validateGetReport, authorizeUser(adminRoles), getReports);
router.patch('/report/:id', verifyToken, validateMarkAsRead, authorizeUser(adminRoles), markAsHandled);

export default router;
