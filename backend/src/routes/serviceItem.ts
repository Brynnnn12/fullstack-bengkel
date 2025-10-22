import { Router } from 'express';
import {
  getServiceItemsByServiceLogId,
  getServiceItemById,
  createServiceItem,
  updateServiceItem,
  deleteServiceItem,
} from '../app/controllers/serviceItem.controller';
import { authenticateToken } from '../app/middlewares/auth/auth.middleware';
import { checkRole } from '../app/middlewares/auth/checkRole';

const router = Router();

// All service item routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /service-items/service-logs/{serviceLogId}/items:
 *   get:
 *     summary: Get service items by service log ID
 *     tags: [Service Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceLogId
 *         required: true
 *         schema:
 *           type: string
 *         description: Service log ID
 *     responses:
 *       200:
 *         description: List of service items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/service-logs/:serviceLogId/items', checkRole(['Manager', 'Kasir']), getServiceItemsByServiceLogId);

/**
 * @swagger
 * /service-items/{id}:
 *   get:
 *     summary: Get service item by ID
 *     tags: [Service Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service item ID
 *     responses:
 *       200:
 *         description: Service item retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Service item not found
 */
router.get('/:id', checkRole(['Manager', 'Kasir']), getServiceItemById);

/**
 * @swagger
 * /service-items/service-logs/{serviceLogId}/items:
 *   post:
 *     summary: Create a new service item
 *     tags: [Service Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceLogId
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
 *             required:
 *               - description
 *               - quantity
 *               - price
 *               - inventoryItemId
 *             properties:
 *               description:
 *                 type: string
 *                 example: Air Filter
 *               quantity:
 *                 type: integer
 *                 example: 1
 *               price:
 *                 type: number
 *                 example: 75000
 *               inventoryItemId:
 *                 type: string
 *                 example: clh1x8z9w0000abcdefghijk
 *     responses:
 *       201:
 *         description: Service item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Bad request
 */
router.post('/service-logs/:serviceLogId/items', checkRole(['Manager', 'Kasir']), createServiceItem);

/**
 * @swagger
 * /service-items/{id}:
 *   put:
 *     summary: Update service item
 *     tags: [Service Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: Air Filter Premium
 *               quantity:
 *                 type: integer
 *                 example: 1
 *               price:
 *                 type: number
 *                 example: 85000
 *               inventoryItemId:
 *                 type: string
 *                 example: clh1x8z9w0000abcdefghijk
 *     responses:
 *       200:
 *         description: Service item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Service item not found
 */
router.put('/:id', checkRole(['Manager', 'Kasir']), updateServiceItem);

/**
 * @swagger
 * /service-items/{id}:
 *   delete:
 *     summary: Delete service item
 *     tags: [Service Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service item ID
 *     responses:
 *       200:
 *         description: Service item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Service item not found
 */
router.delete('/:id', checkRole(['Manager', 'Kasir']), deleteServiceItem);

export default router;