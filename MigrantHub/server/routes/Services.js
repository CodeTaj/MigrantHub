const express = require('express');

const router = express.Router();
const ServiceController = require('../controllers/ServiceController');
const { ensureIsOwner } = require('../middleware/AuthMiddleware');
const Service = require('../models/Service');

router.use('/:id/reviews', require('./Reviews'));

router.get('/', ServiceController.viewServices);
router.get('/:id', ServiceController.getServiceData);
router.post('/', ServiceController.upload.single('serviceImage'), ServiceController.createService);
router.put('/:id', ensureIsOwner(Service, true, true, true), ServiceController.upload.single('serviceImage'), ServiceController.updateService);
router.delete('/:id', ensureIsOwner(Service, true, true, true), ServiceController.deleteService);

module.exports = router;
