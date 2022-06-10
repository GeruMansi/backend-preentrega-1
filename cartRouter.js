const { Router } = require('express')
const fs = require('fs')

const cartRouter = Router()

//=== Crear un nuevo carrito
cartRouter.post('/', (req, res) => {
    let dataCarts
    try {
        dataCarts = fs.readFileSync('./carts.json', 'utf-8')
        dataCarts = JSON.parse(dataCarts)
    } catch (error) {
        console.log(`Error al leer el archivo (${error})`)
        dataCarts = []
    }
    const id = dataCarts.length + 1
    const newCart = {
        id: id,
        timestamp: Date.now(),
        productos: []
    }
    console.log(newCart)
    dataCarts.push(newCart)
    fs.writeFileSync('./carts.json', JSON.stringify(dataCarts, null, 2))
    return res.status(201).json(newCart.id)
})

//=== Eliminar un carrito
cartRouter.delete('/:id', (req, res) => {
    const id = Number(req.params.id)
    let dataCarts
    try {
        dataCarts = fs.readFileSync('./carts.json', 'utf-8')
        dataCarts = JSON.parse(dataCarts)
    } catch (error) {
        console.log(`Error al leer el archivo (${error})`)
        dataCarts = []
    }
    dataCarts = dataCarts.filter(item => item.id !== id)
    fs.writeFileSync('./carts.json', JSON.stringify(dataCarts, null, 2))
    return res.status(204).json({})
})


//=== Listar productos de un carrito con id.
cartRouter.get('/:id/productos', (req, res) => {
    console.log(req.url)
    const id = Number(req.params.id)
    let dataCarts
    try {
        dataCarts = fs.readFileSync('./carts.json', 'utf-8')
        dataCarts = JSON.parse(dataCarts)
    } catch (error) {
        console.log(`Error al leer el archivo (${error})`)
        dataCarts = []
    }
    const cart = dataCarts.find(item => item.id === id)
    if (!cart) {
        return res.status(404).json({
            error: 'No se encontró el carrito'
        })
    }
    return res.json(cart.productos)
})

//=== Agregar productos a un carrito
cartRouter.post('/:id/productos', (req, res) => {
    const id = Number(req.params.id)
    const productId = Number(req.body.id)
    let dataCarts
    try {
        dataCarts = fs.readFileSync('./carts.json', 'utf-8')
        dataCarts = JSON.parse(dataCarts)
    } catch (error) {
        console.log(`Error al leer el archivo (${error})`)
        dataCarts = []
    }
    const cartIndex = dataCarts.findIndex(item => item.id === id)

    let dataProducts
    try {
        dataProducts = fs.readFileSync('./products.json', 'utf-8')
        dataProducts = JSON.parse(dataProducts)
    } catch (error) {
        console.log(`Error al leer el archivo (${error})`)
        dataProducts = []
    }
    const productIndex = dataProducts.findIndex(item => item.id === productId)

    dataCarts[cartIndex].productos.push(dataProducts[productIndex])
    fs.writeFileSync('./carts.json', JSON.stringify(dataCarts, null, 2))
    
    return res.status(201).json(dataCarts[cartIndex])
})


module.exports = cartRouter