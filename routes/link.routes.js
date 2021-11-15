const { Router } = require('express')
const config = require('config')
const shortid = require('shortid')
const Link = require('../models/Link')
const auth = require('../midleware/auth.middleware')
const router = Router()


router.post('/generate', auth, async (request, response) => {
    try{
        const baseUrl = config.get('baseUrl')
        const {from} = request.body

        const code = shortid.generate()

        const existing = await Link.findOne({ from })

        if(existing){
            return response.json({ link: existing })
        }

        const to = baseUrl + '/t/' + code

        const link = new Link({
            code, to, from, owner: request.user.userId
        })

        await link.save()
        
        response.status(201).json({link})


    }catch(err){
        response.status(500).json({messsage: "Что-то пошло не так, попробуйте снова"})
    }
})  

router.get('/', auth, async (request, response) => {
    try{
        const links = await Link.find({owner: request.user.userId})
        response.json(links)
    }catch(err){
        response.status(500).json({messsage: "Что-то пошло не так, попробуйте снова"})
    }
}) 

router.get('/:id', auth, async (request, response) => {
    try{
        const link = await Link.findById(request.params.id) ///???
        response.json(link)
    }catch(err){
        response.status(500).json({messsage: "Что-то пошло не так, попробуйте снова"})
    }
}) 

module.exports = router