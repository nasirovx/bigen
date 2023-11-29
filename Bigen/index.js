

// console.log("hello world")
// console.log("hello world")
// const fs = require("fs")

// const textIn=fs.readFileSync("./txt/input.txt", 'utf-8')
// console.log(textIn)
// const textOut=This is what we know about the avacado: ${textIn}\nCreated on ${new Date()}
// fs.writeFileSync("./txt/output.txt", textOut)
// console.log("File Written!") 

// fs.readFile("./txt/start.txt", 'utf-8', (err, data1)=>{
//     if(err) return console.log("Error")
//     fs.readFile(./txt/${data1}.txt, 'utf-8', (err, data2)=>{
//         console.log(data2)
//         fs.readFile('./txt/append.txt', "utf-8", (err, data3)=>{
//             console.log(data3)
//             fs.writeFile('./txt/final.txt', ${data2}\n${data3}, 'utf-8', err=>{
//                 console.log('Your file has been written 😁')
//             })
//         })
//     })
// })
// console.log("Will read file")

const fs = require('fs')
const http = require('http')
const url = require('url')
const slugify = require('slugify')

const replaceTemplate = require('./modules/replaceTemplate')


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
// console.log(tempOverview) 
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
// console.log(templCard)
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')
// console.log(tempProduct)

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
// console.log(data)
const dataObj = JSON.parse(data)
const slugs = dataObj.map((el) => {
    slugify(el.productName, {
        lower: true
    })
    // console.log(el.productName)
})
// console.log(slugify('Fresh Avocados', {lower:true}))

const server = http.createServer((req, res) => {
    // console.log(req)
    const { pathname,query } = url.parse(req.url, true)
    if (pathname === '/' || pathname === "/overview") {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        })
        const cardsHtml=dataObj
        .map((el)=>replaceTemplate(tempCard, el))
        .join('')
        const output=tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml)
        res.end(output)
    } else if (pathname === '/product') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        })
        const product=dataObj[query.id]
        const output=replaceTemplate(tempProduct, product)
        res.end(output)
    } else if (pathname === '/api') {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        })
        res.end(data)
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html',
        })
        res.end('<h1>Page not found!</h1>')
    }
})
const PORT = 8888
server.listen(PORT, '127.0.0.1', () => {
    console.log(`listen to requests on port ${PORT}`)
})

//  http://127.0.0.1:8888