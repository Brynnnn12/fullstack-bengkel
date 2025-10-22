import { Router } from 'express';
import {
  getAllInventoryItems,
  getInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getLowStockItems,
  getOutOfStockItems,

} from '../app/controllers/inventoryItem.controller';
import { authenticateToken } from '../app/middlewares/auth/auth.middleware';
import { checkRole } from '../app/middlewares/auth/checkRole';

const router = Router();

// All inventory routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /inventory:
 *   get:
 *     summary: Get all inventory items with filters
 *     tags: [Inventory]
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or SKU
 *       - in: query
 *         name: stockFilter
 *         schema:
 *           type: string
 *           enum: [low, out, available]
 *         description: Filter by stock status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, sku, stock, sellingPrice]
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of inventory items retrieved successfully
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
 *                     $ref: '#/components/schemas/InventoryItem'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/', checkRole(['Manager', 'Kasir']), getAllInventoryItems);

/**
 * @swagger
 * /inventory/{id}:
 *   get:
 *     summary: Get inventory item by ID
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Inventory item ID
 *     responses:
 *       200:
 *         description: Inventory item retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Inventory item not found
 */
router.get('/:id', checkRole(['Manager', 'Kasir']), getInventoryItemById);

/**
 * @swagger
 * /inventory/alerts/low-stock:
 *   get:
 *     summary: Get low stock items
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of low stock items
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/alerts/low-stock', checkRole(['Manager', 'Kasir']), getLowStockItems);

/**
 * @swagger
 * /inventory/alerts/out-of-stock:
 *   get:
 *     summary: Get out of stock items
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of out of stock items
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/alerts/out-of-stock', checkRole(['Manager', 'Kasir']), getOutOfStockItems);

/**
 * @swagger
 * /inventory:
 *   post:
 *     summary: Create a new inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - sku
 *               - stock
 *               - sellingPrice
 *             properties:
 *               name:
 *                 type: string
 *                 example: Spark Plug Set
 *               sku:
 *                 type: string
 *                 example: SP-SET-4
 *               stock:
 *                 type: integer
 *                 example: 25
 *               sellingPrice:
 *                 type: number
 *                 example: 120000
 *     responses:
 *       201:
 *         description: Inventory item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Bad request
 */
router.post('/', checkRole(['Manager']), createInventoryItem);

/**
 * @swagger
 * /inventory/{id}:
 *   put:
 *     summary: Update inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Inventory item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Spark Plug Set Premium
 *               sku:
 *                 type: string
 *                 example: SP-SET-4
 *               stock:
 *                 type: integer
 *                 example: 30
 *               sellingPrice:
 *                 type: number
 *                 example: 150000
 *     responses:
 *       200:
 *         description: Inventory item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Inventory item not found
 */
router.put('/:id', checkRole(['Manager']), updateInventoryItem);

/**
 * @swagger
 * /inventory/{id}:
 *   delete:
 *     summary: Delete inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Inventory item ID
 *     responses:
 *       200:
 *         description: Inventory item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Inventory item not found
 */
router.delete('/:id', checkRole(['Manager']), deleteInventoryItem);

export default router;