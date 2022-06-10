const { Router } = require('express')
const fs = require('fs')

const isAdmin = false
const adminCheck = (req, res, next) => {
    if (isAdmin) {
        next()
    }
    return res.json({
        error: -1,
        descripcion: `ruta ${req.method}/api/productos no autorizada`
    })
}
const productsRouter = Router()

productsRouter.get('/', (req, res) => {
    console.log(req.url)
    let dataProducts
    try {
        dataProducts = fs.readFileSync('./products.json', 'utf-8')
        dataProducts = JSON.parse(dataProducts)
    } catch (error) {
        console.log(`Error al leer el archivo (${error})`)
        dataProducts = []
    }
    return res.json(dataProducts)
})

productsRouter.get('/:id', (req, res) => {
    const id = Number(req.params.id)
    let dataProducts
    try {
        dataProducts = fs.readFileSync('./products.json', 'utf-8')
        dataProducts = JSON.parse(dataProducts)
    } catch (error) {
        console.log(`Error al leer el archivo (${error})`)
        dataProducts = []
    }
    const product = dataProducts.find(item => item.id === id)
    if (!product) {
        return res.status(404).json({
            error: 'Producto no encontrado'
        })
    }
    return res.json(product)
})

productsRouter.post('/', adminCheck, (req, res) => {
    const newProduct = req.body
    let dataProducts
    try {
        dataProducts = fs.readFileSync('./products.json', 'utf-8')
        dataProducts = JSON.parse(dataProducts)
    } catch (error) {
        console.log(`Error al leer el archivo (${error})`)
        dataProducts = []
    }
    newProduct.id = dataProducts.length + 1
    newProduct.timeStamp = Date.now()
    newProduct.codigo = `${newProduct.nombre}${newProduct.id}`
    dataProducts.push(newProduct)
    fs.writeFileSync('./products.json', JSON.stringify(dataProducts, null, 2))
    return res.status(201).json(newProduct)
})

productsRouter.put('/:id', adminCheck, (req, res) => {
    const id = Number(req.params.id)
    let dataProducts
    try {
        dataProducts = fs.readFileSync('./products.json', 'utf-8')
        dataProducts = JSON.parse(dataProducts)
    } catch (error) {
        console.log(`Error al leer el archivo (${error})`)
        dataProducts = []
    }
    const productIndex = dataProducts.findIndex(item => item.id === id)
    if (productIndex === -1) {
        return res.status(404).json({
            error: 'Producto no encontrado'
        })
    }
    dataProducts[productIndex].nombre = req.body.nombre
    dataProducts[productIndex].descripcion = req.body.descripcion
    dataProducts[productIndex].precio = req.body.precio
    dataProducts[productIndex].foto = req.body.foto
    dataProducts[productIndex].stock = req.body.stock
    fs.writeFileSync('./products.json', JSON.stringify(dataProducts, null, 2))
    return res.json(dataProducts[productIndex])
})

productsRouter.delete('/:id', adminCheck, (req, res) => {
    const id = Number(req.params.id)
    let dataProducts
    try {
        dataProducts = fs.readFileSync('./products.json', 'utf-8')
        dataProducts = JSON.parse(dataProducts)
    } catch (error) {
        console.log(`Error al leer el archivo (${error})`)
        dataProducts = []
    }
    dataProducts = dataProducts.filter(item => item.id !== id)
    fs.writeFileSync('./products.json', JSON.stringify(dataProducts, null, 2))
    return res.status(204).json({})
})

module.exports = productsRouter