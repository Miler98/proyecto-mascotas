import express from 'express'
import * as controller from '../controllers/adoption-requests-controller.js'

const router = express.Router()

router.get('/', controller.readRequests)
router.get('/:id', controller.readRequest)
router.post('/crear', controller.crearRequest)
router.put('/actualizar/:id', controller.actualizarRequest)
router.put('/aprobar/:id', controller.aprobarRequest)
router.delete('/eliminar/:id', controller.eliminarRequest)

export { router as requestsRouter }







