const express = require('express');
const viewsController = require('../controller/viewsController')

const routes = express.Router();

routes.get('/',viewsController.getOverview )
routes.get('/tour/:slug', viewsController.getTour)

module.exports = routes