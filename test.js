/* eslint-disable no-unused-expressions */
'use strict';

var supertest = require('supertest-as-promised')(require('./app'));
var expect = require('chai').expect; //assertion library
var { tareas } = require('./routes/index.js')

describe('Testing Repaso M3', function() {

  describe('`/users`', function() {

    describe('GET `/users`', function(){
      it('GET responde con un array vacío de entrada', function() {
        return supertest 
          .get('/users') 
          .expect(200) 
          .expect('Content-Type', /json/)
          .expect(function(res) {
            expect(res.body).to.eql([]); 
          });
        });
    })  
    
    describe('POST `/users`', function(){

      it('POST agrega una nueva persona al arreglo de tareas y responde con un objeto con la propiedad (encargado) y valor (nombre de la persona)', function(){
        return supertest
          .post('/users')
            .send({person: 'toni'})
            .expect(201)
            .expect(function(res){
                expect(tareas).to.have.length(1)
                expect(tareas[0]).to.equal('toni')
                expect(res.body).to.have.property('encargado')
                expect(res.body.encargado).to.equal('toni')
              })
              
      })
  
      it('POST agrega una nueva persona sin modificar la anterior', function(){
        return supertest
          .post('/users')
            .send({person: 'alejandro'})
            .expect(201)
            .expect(function(res){
                expect(tareas).to.have.length(2)
                expect(tareas[0]).to.equal('toni')
                expect(tareas[1]).to.equal('alejandro')
                expect(res.body).to.have.property('encargado')
                expect(res.body.encargado).to.equal('alejandro')
            })
      })

      it('POST puede recibir nombre de la persona por Query String', function(){
        return supertest
          .post('/users?person=franco')
            .expect(201)
            .expect(function(res){
                expect(tareas).to.have.length(3)
                expect(tareas[0]).to.equal('toni')
                expect(tareas[1]).to.equal('alejandro')
                expect(tareas[2]).to.equal('franco')
                expect(res.body).to.have.property('encargado')
                expect(res.body.encargado).to.equal('franco')
            })
      })

      it('POST verifica que el body enviado sea de tipo "String" de lo contrario responde 401', function(){
        return supertest
          .post('/users')
            .send({person: 3})
            .expect(401)
            .expect(function(res){
                expect(tareas).to.have.length(3)
                expect(tareas[0]).to.equal('toni')
                expect(tareas[1]).to.equal('alejandro')
                expect(tareas[2]).to.equal('franco')
            })
      })
          
      it('GET debe responder con la lista de personas agregadas', function(){
        return supertest
            .get('/users')
            .expect(200)
            .expect(function(res){
                expect(res.body).to.have.length(3)
                expect(res.body[0]).to.equal('toni')
                expect(res.body[1]).to.equal('alejandro')
                expect(res.body[2]).to.equal('franco')
            })
      })

    })

    describe('PUT `/users`', function(){
      it('PUT modifica el nombre de un usuario; recibe el apellido del encargado por body, lo agrega al nombre, y retorna el nombre y apellido completo (fullName)', function(){
          return supertest
              .put('/users')
              .send({person: 'toni', lastName: 'tralice'})
              .expect(201)
              .expect(function(res){
                  expect(tareas).to.have.length(3)
                  expect(tareas[0]).to.equal('toni tralice')
                  expect(tareas[1]).to.equal('alejandro')
                  expect(tareas[2]).to.equal('franco')
                  expect(res.body).has.a.property('fullName')
                  expect(res.body.fullName).to.equal('toni tralice')
              })
      })
      it('PUT responde correctamente con el fullName de un encargado diferente', function(){
        return supertest
            .put('/users')
            .send({person: 'alejandro', lastName: 'magno'})
            .expect(201)
            .expect(function(res){
                expect(tareas).to.have.length(3)
                expect(tareas[0]).to.equal('toni tralice')
                expect(tareas[1]).to.equal('alejandro magno')
                expect(tareas[2]).to.equal('franco')
                expect(res.body).has.a.property('fullName')
                expect(res.body.fullName).to.equal('alejandro magno')
            })
        })
      it('PUT puede recibir el nombre del encargado por body y el lastName por Query String', function(){
          return supertest
              .put('/users?lastName=etcheverri')
              .send({person: 'franco'})
              .expect(201)
              .expect(function(res){
                  expect(tareas).to.have.length(3)
                  expect(tareas[0]).to.equal('toni tralice')
                  expect(tareas[1]).to.equal('alejandro magno')
                  expect(tareas[2]).to.equal('franco etcheverri')
                  expect(res.body).has.a.property('fullName')
                  expect(res.body.fullName).to.equal('franco etcheverri')
              })
          })
      it('PUT responde 404 si no se encuentra el nombre del encargado en la lista', function(){
          return supertest
              .put('/users')
              .expect(404)
              .expect(function(res){
                  expect(tareas).to.have.length(3)
                  expect(tareas[0]).to.equal('toni tralice')
                  expect(tareas[1]).to.equal('alejandro magno')
                  expect(tareas[2]).to.equal('franco etcheverri')
              })
          })
      it('GET debe responder con la lista de personas agregadas', function(){
            return supertest
                .get('/users')
                .expect(200)
                .expect(function(res){
                    expect(res.body).to.have.length(3)
                    expect(res.body[0]).to.equal('toni tralice')
                    expect(res.body[1]).to.equal('alejandro magno')
                    expect(res.body[2]).to.equal('franco etcheverri')
                })
          })
    })

    describe('DELETE `/users`', function(){

      before(function(){
        return supertest.post('/users').send({person: 'camilo pineda'})
      })
      before(function(){
        return supertest.post('/users').send({person: 'diego rodriguez'})
      })
      before(function(){
        return supertest.post('/users').send({person: 'wanda cirone'})
      })

      it('DELETE elimina un usuario de la lista, puede recibir el nombre, el apellido, o el fullName. Responde con un 200 si la eliminacion fue exitosa', function(){
          return supertest
              .delete('/users')
              .send({person: 'camilo pineda'})
              .expect(200)
              .expect(function(res){
                expect(tareas).to.have.length(5)
                expect(tareas[0]).to.equal('toni tralice')
                expect(tareas[1]).to.equal('alejandro magno')
                expect(tareas[2]).to.equal('franco etcheverri')
                expect(tareas[3]).to.equal('diego rodriguez')
                expect(tareas[4]).to.equal('wanda cirone')
              })
      })

      it('DELETE elimina un usuario diferente sin afectar los demas de la lista, puede recibir el nombre, el apellido, o el fullName. Responde con un 200 si la eliminacion fue eitosa', function(){
        return supertest
            .delete('/users')
            .send({person: 'rodriguez'})
            .expect(200)
            .expect(function(res){
              expect(tareas).to.have.length(4)
              expect(tareas[0]).to.equal('toni tralice')
              expect(tareas[1]).to.equal('alejandro magno')
              expect(tareas[2]).to.equal('franco etcheverri')
              expect(tareas[3]).to.equal('wanda cirone')
            })
      })

      it('DELETE elimina un usuario de la lista, puede recibir el nombre, el apellido, o el fullName por query String. Responde con un 200 si la eliminacion fue eitosa', function(){
        return supertest
            .delete('/users?person=wanda')
            .expect(200)
            .expect(function(res){
              expect(tareas).to.have.length(3)
              expect(tareas[0]).to.equal('toni tralice')
              expect(tareas[1]).to.equal('alejandro magno')
              expect(tareas[2]).to.equal('franco etcheverri')
            })
      })

      it('DELETE responde con un 404 si no encuentra el nombre del encargado en la lista', function(){
        return supertest
            .delete('/users?person=antonio')
            .expect(404)
            .expect(function(res){
              expect(tareas).to.have.length(3)
              expect(tareas[0]).to.equal('toni tralice')
              expect(tareas[1]).to.equal('alejandro magno')
              expect(tareas[2]).to.equal('franco etcheverri')
            })
      })

    })
    
  });

  describe('`/users/task`', function(){

      describe('POST `/users/task`', function(){
          
          before(function(){
            return supertest.post('/users').send({person: 'camilo pineda'})
          })

          it('POST debe responder con un arreglo de objetos que contiene en cada posicion { encargado: "nombre del encargado", completada: false, tarea: `` }, como valores por defecto. El arreglo respuesta debe ser el arreglo existente "tareas" ',function(){
              return supertest
                .post('/users/task')
                .expect(200)
                .expect(function(res){
                    expect(tareas).to.deep.equal([
                      {encargado: 'toni tralice', completada: false, tarea: ''},
                      {encargado: 'alejandro magno', completada: false, tarea: ''},
                      {encargado: 'franco etcheverri', completada: false, tarea: ''},
                      {encargado: 'camilo pineda', completada: false, tarea: ''},
                    ])
                    expect(res.body).to.deep.equal([
                      {encargado: 'toni tralice', completada: false, tarea: ''},
                      {encargado: 'alejandro magno', completada: false, tarea: ''},
                      {encargado: 'franco etcheverri', completada: false, tarea: ''},
                      {encargado: 'camilo pineda', completada: false, tarea: ''},
                    ])
                })
            })
      })

      describe('GET `users/task`', function(){
        it('GET debe responder con un arreglo de objetos que contiene en cada posicion { encargado: "nombre del encargado", completada: true or false, tarea: `texto de la tarea` }. El arreglo respuesta debe ser el arreglo existente "tareas" ',function(){
          return supertest
            .get('/users/task')
            .expect(200)
            .expect(function(res){
                expect(tareas).to.deep.equal([
                  {encargado: 'toni tralice', completada: false, tarea: ''},
                  {encargado: 'alejandro magno', completada: false, tarea: ''},
                  {encargado: 'franco etcheverri', completada: false, tarea: ''},
                  {encargado: 'camilo pineda', completada: false, tarea: ''},
                ])
                expect(res.body).to.deep.equal([
                  {encargado: 'toni tralice', completada: false, tarea: ''},
                  {encargado: 'alejandro magno', completada: false, tarea: ''},
                  {encargado: 'franco etcheverri', completada: false, tarea: ''},
                  {encargado: 'camilo pineda', completada: false, tarea: ''},
                ])
            })
        })
    })
  })

  describe('`/users/:person/task`', function(){

      describe('GET `/users/:person/task`', function(){

        before(function(){
            tareas[0] = { encargado: 'toni tralice', completada: false, tarea: 'tarea de toni 1' }
            tareas.push({ encargado: 'toni tralice', completada: false, tarea: 'tarea de toni 2' }, )
            tareas.push({ encargado: 'camilo pineda', completada: false, tarea: 'tarea de camilo 1' }, )
            tareas.push({ encargado: 'camilo pineda', completada: false, tarea: 'tarea de camilo 2' }, )
        })

          it('GET debe responder con un arreglo de todas las tareas de la persona recibida como parametro', function(){
              return supertest
                    .get(`/users/toni tralice/task`)
                    .expect(200)
                    .expect(function(res){
                        expect(res.body).to.deep.equal(["tarea de toni 1","tarea de toni 2"])
                    })
          })

          it('GET debe responder correctamente si se envia una persona diferente', function(){
            return supertest
                  .get(`/users/camilo pineda/task`)
                  .expect(200)
                  .expect(function(res){
                      expect(res.body).to.deep.equal(["", "tarea de camilo 1", "tarea de camilo 2"])
                  })
          })
      })

      describe('POST `/users/:person/task`', function(){

        before(function(){tareas.shift(), tareas.shift(), tareas.shift(), tareas.shift() })

        it('POST agrega una nueva tarea sin completar(enviada por body) a la persona indicada por parametro, responde con un 201 si la tarea fue agregada con eito', function(){
              return supertest
                    .post(`/users/toni tralice/task`)
                    .send({task: "nueva tarea para toni"})
                    .expect(201)
                    .expect(function(res){
                        expect(tareas).to.have.length(4)
                        expect(tareas[3]).to.deep.equal({
                          encargado: 'toni tralice',
                          completada: false,
                          tarea: 'nueva tarea para toni'
                        })
                    })
          })

        it('POST verifica que el nombre de la persona se encuentren dentro del arreglo de tareas, si no se encuentra responde con un 404', function(){
          return supertest
                .post(`/users/antonio/task`)
                .expect(404)
                .expect(function(res){
                    expect(tareas).to.have.length(4)
                    expect(tareas[3]).to.deep.equal({
                      encargado: 'toni tralice',
                      completada: false,
                      tarea: 'nueva tarea para toni'
                    })
                })
        })
      })

      describe('PUT `/users/:person/task`', function(){

        it('PUT verifica que el nombre de la persona se encuentren dentro del arreglo de tareas, si no se encuentra responde con un 401', function(){
          return supertest
                .put('/users/antonio/task')
                .expect(401)
                .expect(function(res){
                    expect(tareas).to.have.length(4)
                    expect(tareas[3]).to.deep.equal({
                      encargado: 'toni tralice',
                      completada: false,
                      tarea: 'nueva tarea para toni'
                    })
                })
        })

        it('PUT recibe el nombre de la persona como parametro, un indice como Query String y una tarea por body. Modifica la tarea que se encuentra en el indice recibido y responde con un 200 si la modificacion fue eitosa', function(){
            return supertest
              .put('/users/camilo pineda/task?index=1')
              .send({task: "nueva tarea para camilo"})
              .expect(200)
              .expect(function(){
                  expect(tareas).to.deep.equal(
                    [
                      {
                        encargado: 'toni tralice',
                        completada: false,
                        tarea: 'tarea de toni 2'
                      },
                      {
                        encargado: 'camilo pineda',
                        completada: false,
                        tarea: 'nueva tarea para camilo'
                      },
                      {
                        encargado: 'camilo pineda',
                        completada: false,
                        tarea: 'tarea de camilo 2'
                      },
                      {
                        encargado: 'toni tralice',
                        completada: false,
                        tarea: 'nueva tarea para toni'
                      }
                    ]
                  )
              })
        })

        
      })
  })

  describe('`/complete/tasks`', function(){
      
      describe("GET `/complete/tasks`", function(){
          before(function(){
              if(tareas[0]){
              tareas[0].completada = true
              tareas[2].completada = true
              tareas[3].completada = true
            }
          })
          afterEach(function(){
              tareas[0].completada = false
              tareas[2].completada = false
              tareas[3].completada = false
          })
          it('GET debe responder con un arreglo de todas las tareas de la lista donde complete sea "true"', function(){
                return supertest    
                      .get('/complete/tasks')
                      .expect(200)
                      .expect(function(res){
                          expect(res.body).to.have.length(3)
                          expect(res.body[0].completada).to.eq(true)
                          expect(res.body[1].completada).to.eq(true)
                          expect(res.body[2].completada).to.eq(true)
                      })
            })

          it('GET si no existe al menos 1 tarea completada, debe responder con 404 y un Json con el mensaje "ninguna tarea completa"', function(){
            return supertest
                .get('/complete/tasks')
                .expect(404)
                .expect(function(res){
                    expect(res.body).to.equal('ninguna tarea completada')
                  })
          })
          
          
          
      })

      describe("POST `/complete/tasks`", function(){
        
        it('POST verifica que el indice de la tarea recibida exista, si no existe responde con un 404', function(){
            return supertest
              .post('/complete/tasks')
              .send({id: 50})
              .expect(404)
        })
        it('POST recibe el indice de una tarea y si esta se encuentra sin completar (false), la pasa a completada (true), responde con un 200 si el cambio fue eitoso', function(){
            return supertest
              .post('/complete/tasks')
              .send({id: 1})
              .expect(function(){
                  expect(tareas[1].completada).to.equal(true)
              })
        })
    })
  })

  describe('`/delete/tasks`', function(){

    describe("DELETE `/delete/tasks`", function(){
        it('DELETE verifica que el indice de la tarea recibida exista, si no existe, debe responder con 404', function(){
          return supertest
            .delete('/delete/tasks')
            .send({id: 50})
            .expect(404)
      })
        it('DELETE recibe el indice de una tarea y elimina el registro completo de esa tarea y a quien pertenece, responde con 200 la eliminacion fue eitosa', function(){
            return supertest
              .delete('/delete/tasks?id=2')
              .expect(200)
              .expect(function(){
                  expect(tareas).to.have.length(3)
              })
        })
    })

})

});
