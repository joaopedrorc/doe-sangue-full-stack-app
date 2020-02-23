// Configurando o servidor 
const express = require('express')
const server = express()

// Configurar o servidor para apresentar aquivos staticos
server.use(express.static('public'))

// habilitar o body do formulario
server.use(express.urlencoded({ extended: true }))


// Configurar a conexão com o banco de dados 
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: 5432,
    database: 'doeblood'
})

// Configurando a Template Engine
const nunjucks = require('nunjucks')
nunjucks.configure('./', {
    express: server,
    noCache: true
}) 


// Configurando a apresentação da página
server.get('/', function(req, res) {

    db.query('SELECT name, email, blood FROM donors ', function(err, result){
        if (err) res.send('Erro de banco de dados.')

        const donors = result.rows
        return res.render('index.html', { donors})
    })

})

server.post('/', function(req, res) {
    // pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == '' || email == '' || blood == '') {
        return res.send('Todos os campos são obrigatórios.')
    }

    // coloco valores dentro do banco de dados 
    const query = `
        INSERT INTO donors ("name", "email", "blood")
        VALUES ($1, $2, $3);
        `
    const values = [name, email, blood]    

    db.query(query, values, function(err) {
        // fluxo de erro.
        if (err) return res.send('erro no banco de dados.')

        // fluxo ideal.
        return res.redirect('/')
    })

})

// Ligar o servidor e permitir aceso a porta 3000 
server.listen(3000, function() {
    console.log('Iniciei o servidor')
})

