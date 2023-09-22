const express = require('express')
const app = express()
const port =3001
app.get('/', (req,res) => {
    res.send('Welcome to my Express.js server!')

})

app.listen(port, () => console.log('server running on http://localhost:${port}'))