import bcrypt from 'bcrypt'
import { User, getUserById } from '../models/user-model.js'

const hashPassword = async password => {
    const salt = await bcrypt.genSalt()
    return await bcrypt.hash(password, salt)
}

export const crearUsuario = async (req, res) => {
    if (req.body.name === undefined) return res.status(400).jsonPretty({
        type: 'error',
        message: 'campo vacio'
    })
    if (req.body.email === undefined) return res.status(400).jsonPretty({
        type: 'error',
        message: 'campo vacio'
    })
    if (req.body.password === undefined) return res.status(400).jsonPretty({
        type: 'error',
        message: 'campo vacio'
    })

    req.body.password = await hashPassword(req.body.password)
    const user = await User.create(req.body)

    res.status(201).jsonPretty({
        type: 'success',
        message: `User ${user.nombre} (id: ${user.id}) usuario creado correctamente`,
        created: user
    })
}

export const loginUsuario = async (req, res) => {
    if (req.body.email === undefined) return res.status(400).jsonPretty({
        type: 'error',
        message: 'campo vacio'
    })
    if (req.body.password === undefined) return res.status(400).jsonPretty({
        type: 'error',
        message: 'campo vacio'
    })

    const user = await User.findOne({ where: { email: req.body.email } })
    if (user === null) return res.status(404).jsonPretty({
        type: 'error',
        message: `usuario incorrecto`
    })

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password)
    if (!isPasswordValid)
        return res.status(401).jsonPretty({ type: 'error', message: 'contraseña incorrecta' })
    req.session.user = user
    res.status(200).jsonPretty({
        type: 'success',
        message: `login correctamente`,
        user
    })
}

export const salirUsuario = (req, res) => {
    if (req.session.user === undefined) return res.status(401).jsonPretty({
        type: 'error',
        message: 'uduario no resgistrado'
    })

    req.session.destroy()
    res.status(200).jsonPretty({ type: 'success' })
}

export const readUsers = async (req, res) => {
    const users = await User.findAll()
    const length = users.length

    if (length === 0) return res.status(500).jsonPretty({
        type: 'error',
        message: 'There is no users',
        length
    })
    res.status(200).jsonPretty({ collection: users, length })
}

export const readUser = async (req, res) => {
    const id = req.params.id
    const user = await getUserById(id)

    if (user === null) return res.status(404).jsonPretty({
        type: 'error',
        message: `User with id ${id} not found`
    })
    res.status(200).jsonPretty({ object: user })
}

export const actualizarusuario = async (req, res) => {
    const id = req.params.id
    const { nombre, role, email, password, direccion } = req.body

    const user = await getUserById(id)
    if (user === null) return res.status(404).jsonPretty({
        type: 'error',
        message: `usuario no existe`
    })

    const isInvalidData = !nombre && !role && !email && !password && !direccion
    if (isInvalidData) return res.status(400).jsonPretty({
        type: 'error',
        message: 'datos no validos'
    })

    if (password !== undefined)
        req.body.password = await hashPassword(password)
    user.update(req.body)

    res.status(200).jsonPretty({
        type: 'success',
        message: `actualizado correctamente`,
        updated: user
    })
}

export const eliminarUsuario = async (req, res) => {
    const id = req.params.id
    const user = await getUserById(id)

    if (user === null) return res.status(404).jsonPretty({
        type: 'error',
        message: `usuario no existe`
    })

    user.destroy()
    res.status(200).jsonPretty({
        type: 'success',
        message: `eliminado correctamente`,
        deleted: user
    })
}
