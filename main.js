const express = require('express')
const cartRouter = require('./cartRouter')
const productsRouter = require('./productsRouter')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/productos', productsRouter)
app.use('/api/carrito', cartRouter)

app.get('/', (req, res) => {
    return res.json({ status: 'ok' })
})

const PORT = process.env.PORT || 8080

const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
})
server.on('error', error => console.log(`Error en el servidor: ${error}`))