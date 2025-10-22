import express from 'express';
import authRoutes from './auth';
import customerRoutes from './customer';
import vehicleRoutes from './vehicle';
import serviceLogRoutes from './serviceLog';
import serviceItemRoutes from './serviceItem';
import inventoryRoutes from './inventory';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/service-logs', serviceLogRoutes);
router.use('/service-items', serviceItemRoutes);
router.use('/inventory', inventoryRoutes);

export default router;