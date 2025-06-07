const express = require("express")
const app = express()
const port = 3000

app.get("/", (req, res) => {
    return res.send("Hello word");
})

app.listen(port, () => console.log(`Server start at port ${port}`))