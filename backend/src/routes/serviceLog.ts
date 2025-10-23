import express from 'express';
import asyncHandler from 'express-async-handler';
import {
  getAllServiceLogs,
  getServiceLogById,
  createServiceLog,
  updateServiceLog,
  deleteServiceLog,
} from '../app/controllers/serviceLog.controller';
import { authenticateToken } from '../app/middlewares/auth/auth.middleware';
import { checkRole } from '../app/middlewares/auth/checkRole';

const router = express.Router();

/**
 * @swagger
 * /service-logs:
 *   get:
 *     summary: Get all service logs
 *     tags: [Service Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of service logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ServiceLog'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/', authenticateToken, asyncHandler(getAllServiceLogs));

/**
 * @swagger
 * /service-logs/{id}:
 *   get:
 *     summary: Get service log by ID
 *     tags: [Service Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service log ID
 *     responses:
 *       200:
 *         description: Service log retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Service log not found
 */
router.get('/:id', authenticateToken, asyncHandler(getServiceLogById));

/**
 * @swagger
 * /service-logs:
 *   post:
 *     summary: Create a new service log
 *     tags: [Service Logs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - totalCost
 *               - vehicleId
 *               - serviceItems
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-10-22T10:00:00Z
 *               totalCost:
 *                 type: number
 *                 example: 250000
 *               notes:
 *                 type: string
 *                 example: Full service maintenance
 *               vehicleId:
 *                 type: string
 *                 example: clh1x8z9w0000abcdefghijk
 *               serviceItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - description
 *                     - quantity
 *                     - price
 *                     - inventoryItemId
 *                   properties:
 *                     description:
 *                       type: string
 *                       example: Engine Oil Change
 *                     quantity:
 *                       type: integer
 *                       example: 1
 *                     price:
 *                       type: number
 *                       example: 150000
 *                     inventoryItemId:
 *                       type: string
 *                       example: clh1x8z9w0000abcdefghijk
 *     responses:
 *       201:
 *         description: Service log created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Bad request
 */
router.post('/', authenticateToken, checkRole(['Manager', 'Kasir']), asyncHandler(createServiceLog));

/**
 * @swagger
 * /service-logs/{id}:
 *   put:
 *     summary: Update service log
 *     tags: [Service Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service log ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-10-22T10:00:00Z
 *               totalCost:
 *                 type: number
 *                 example: 300000
 *               notes:
 *                 type: string
 *                 example: Updated service with additional work
 *               vehicleId:
 *                 type: string
 *                 example: clh1x8z9w0000abcdefghijk
 *               serviceItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     description:
 *                       type: string
 *                       example: Engine Oil Change Premium
 *                     quantity:
 *                       type: integer
 *                       example: 1
 *                     price:
 *                       type: number
 *                       example: 200000
 *                     inventoryItemId:
 *                       type: string
 *                       example: clh1x8z9w0000abcdefghijk
 *     responses:
 *       200:
 *         description: Service log updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Service log not found
 */
router.put('/:id', authenticateToken, checkRole(['Manager', 'Kasir']), asyncHandler(updateServiceLog));

/**
 * @swagger
 * /service-logs/{id}:
 *   delete:
 *     summary: Delete service log
 *     tags: [Service Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service log ID
 *     responses:
 *       200:
 *         description: Service log deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Service log not found
 */
router.delete('/:id', authenticateToken, checkRole(['Manager']), asyncHandler(deleteServiceLog));

export default router;