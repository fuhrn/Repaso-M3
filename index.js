'use strict';

var express = require('express');
const res = require('express/lib/response');
const { post } = require('./app');
var router = express.Router();

router.use(express.json());

var tareas = [] 
router.get('/users', (req, res) => {
    res
        
        .json(tareas)
});

router.post('/users', (req, res) => {
    var person

    if (req.body.person && typeof req.body.person !== "string") return  res.sendStatus(401) 
    
        req.body.person ? person = req.body.person : person = req.query.person
        tareas.push(person)
        res.status(201)
            .json({ encargado: person })
    
    // if (req.query.person ) {
    //     tareas.push(req.query.person)
    //     res
    //         .status(201)
    //         .json({ encargado: req.query.person })        
    // }
    // if (req.body.person) {
    //     if(typeof req.body.person  === 'string'){
    //     tareas.push(req.body.person)
    //     res
    //         .status(201)
    //         .json({ encargado: req.body.person })
    //     } else {
    //         res
    //             .status(401)
    //             .send('puto el que lee')            
    //     }
    // }
});

router.put('/users', (req, res) => {
    
    const index = tareas.findIndex(persona => req.body.person === persona)
    var lastName
    req.body.lastName ? lastName = req.body.lastName :  lastName = req.query.lastName
    let fullName = `${req.body.person} ${lastName}`
        
    let mostWanted = tareas.find( persona => req.body.person === persona )
    if (!mostWanted) return  res.sendStatus(404) 
    
    tareas.splice(index, 1, fullName)
    
    res
        .status(201)
        .json({ fullName })
    
})

router.delete('/users', (req, res) => {

    let person 
    req.body.person? person = req.body.person :  person = req.query.person
    let ricardo = tareas.findIndex(e => e.includes(person))    
    if (ricardo > -1) {
        tareas.splice(ricardo, 1)
        res.sendStatus(200)
    } else {
        res.sendStatus(404)
    }           
})
// router.delete('/users', (req, res) => {
//     tareas = tareas.filter(e => !e.includes(req.body.person))
//                 res
//                 .status(200)
//                 .json({tareas})   

router.post('/users/task', (req, res) => {
    // tareas = tareas.map(function (e) {
    //     var obj = {
    //         completada: false,
    //         encargado: e,
    //         tarea: ""
    //     }        
    //     return obj
    // })
    tareas.forEach(function (e) {
        var obj = {
            completada: false,
            encargado: e,
            tarea: ""
        }        
        tareas.push(obj)
    })
    tareas.forEach(function (e) {
        if(typeof e ==='string'){tareas.splice(0,4)} //recontra hardcodeado man
    } )  
    res.status(200)
        .json( tareas )
})

router.get('/users/task', (req, res) => {
    res
        .json(tareas)

})

router.get('/users/:person/task', (req, res) => {
    const { person } = req.params;
    const atareado = tareas.filter(tarea => tarea.encargado === person)
    let task = [];
    atareado.forEach(function (e) {
        task.push(e.tarea)
    })
    res.json(task)
})



router.post('/users/:person/task', (req, res) => {
    const { person } = req.params 
    const { task } = req.body
    var existe = tareas.findIndex(persona => persona.encargado === person)
    if (existe>-1) {
        console.log(existe)
        var obj = {
            encargado: person,
            completada: false,
            tarea: task
        }
        tareas.push(obj)
        return res
            .status(201)
            .json(tareas)
    } else if (existe === -1) {
        return res
            .status(404)
            .send('toni y la concha del que hizo los tests')
    }
})

router.put("/users/:person/task", (req, res) => {    
    const {person} = req.params
    const { index } = req.query
    const { task } = req.body
    const filtrado = tareas.filter(persona => person === persona.encargado)

    if (filtrado.length>0) {
        tareas[index].tarea = task        
        res
            .sendStatus(200)
    }
    else
    {
        return res.sendStatus(401)
    }
})

router.get('/complete/tasks', ( req, res ) => {
    const tareasTrue = tareas.filter(tarea => tarea.completada == true)
    if (tareasTrue.length > 0) {
        res.status(200)
            .send(tareasTrue)
    } else {
        res.status(404)
            .json('ninguna tarea completada')
    }
})

router.post('/complete/tasks', (req, res) => {
    const { id } = req.body
    !tareas[id]? res.sendStatus(404) : tareas[id].completada = true 
    // if (!tareas[id]) return res.sendStatus(404)
    // if (tareas[id].completada == false) { tareas[id].completada = true }
    
    res.sendStatus(200)
})

router.delete('/delete/tasks', (req, res) => {
    let id
    req.body.id ? id = req.body.id : id = req.query.id
    
    if (!tareas[id]) { return res.sendStatus(404) }
    
    tareas.splice(id, 1)
    res.sendStatus(200)

})





module.exports = {
    router, 
    tareas
};