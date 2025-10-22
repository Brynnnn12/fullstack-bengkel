import express from 'express';
import asyncHandler from 'express-async-handler';
import {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from '../app/controllers/vehicle.controller';
import { authenticateToken } from '../app/middlewares/auth/auth.middleware';
import { checkRole } from '../app/middlewares/auth/checkRole';

const router = express.Router();

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Get all vehicles
 *     tags: [Vehicles]
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
 *         description: List of vehicles retrieved successfully
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
 *                     $ref: '#/components/schemas/Vehicle'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/', asyncHandler(getAllVehicles));

/**
 * @swagger
 * /vehicles/{id}:
 *   get:
 *     summary: Get vehicle by ID
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Vehicle not found
 */
router.get('/:id', asyncHandler(getVehicleById));

/**
 * @swagger
 * /vehicles:
 *   post:
 *     summary: Create a new vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - registrationPlate
 *               - make
 *               - model
 *               - customerId
 *             properties:
 *               registrationPlate:
 *                 type: string
 *                 example: B 4321 XYZ
 *               make:
 *                 type: string
 *                 example: Honda
 *               model:
 *                 type: string
 *                 example: Civic
 *               customerId:
 *                 type: string
 *                 example: clh1x8z9w0000abcdefghijk
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Bad request
 */
router.post('/', authenticateToken, checkRole(['Manager', 'Kasir']), asyncHandler(createVehicle));

/**
 * @swagger
 * /vehicles/{id}:
 *   put:
 *     summary: Update vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               registrationPlate:
 *                 type: string
 *                 example: B 4321 XYZ
 *               make:
 *                 type: string
 *                 example: Honda
 *               model:
 *                 type: string
 *                 example: Civic Type R
 *               customerId:
 *                 type: string
 *                 example: clh1x8z9w0000abcdefghijk
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Vehicle not found
 */
router.put('/:id', authenticateToken, checkRole(['Manager', 'Kasir']), asyncHandler(updateVehicle));

/**
 * @swagger
 * /vehicles/{id}:
 *   delete:
 *     summary: Delete vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Vehicle not found
 */
router.delete('/:id', authenticateToken, checkRole(['Manager']), asyncHandler(deleteVehicle));

export default router;