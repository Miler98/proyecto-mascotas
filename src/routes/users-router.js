import express from 'express'
import * as controller from '../controllers/users-controller.js'

const router = express.Router()

router.get('/', controller.readUsuario)
router.get('/:id', controller.readUsuario)
router.post('/crear', controller.crearUsuario)
router.post('/login', controller.loginUsuario)
router.post('/salir', controller.salirUsuario)
router.put('/actualizar/:id', controller.actualizarusuario)
router.delete('/eliminar/:id', controller.eliminarUsuario)

export { router as usersRouter }