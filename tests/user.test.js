const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const Task = require('../src/models/task')

const { userOneId, userOne, setUpDataBase } = require('./fixtures/db')

beforeEach(setUpDataBase)


test('Should sign up a new user', async () => {
    const response =  await request(app).post('/users').send({
        name: 'Alex', 
        age: 41,
        email: "alex1110@alexswiec.com", 
        password: 'myPass999123124!'
    }).expect(201) 

      // Assert that the data base was changed correctly 
     const user = await User.findById(response.body.user._id)
     expect(user).not.toBeNull()

     // Assertions about the body 
  //   expect(response.body.user.name).toBe('Alex')
     expect(response.body).toMatchObject({
         user: {
             name: 'Alex', 
             email: "alex1110@alexswiec.com"
         }, 
         token: user.tokens[0].token
     })
     expect(user.password).not.toBe('777Password')
})  

  

test('Should login existing user', async () => {

    const response =    await request(app).post('/users/login').send({
        email: userOne.email, 
        password: userOne.password
    }).expect(200)

       // Assert that the user is in the data base 
       const user = await User.findById(userOneId)
       expect(response.body.token).toBe(user.tokens[1].token)


    // Assert that the there is a second token and that the token is correct
    
         expect(response.body).toMatchObject({
             user: {
                 name: 'Mike', 
                 email: "mike@mike.com"
             }, 
             token: user.tokens[1].token
         })

})

test('Should not login existing user', async () => {
    console.log(userOne.name +' '+ userOne.password)
    await request(app).post('/users/login').send({
        email: 'bademail@email.com', 
        password: userOne.password
    }).expect(400)
})

test('Should get profile of the user', async ()=> {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}` )
        .send()
        .expect(200)
})

test('Should not get profile of the user', async ()=> {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})


test('Should not delete the user´s account', async() => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should delete the user´s account', async() => {
        await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}` )
        .send()
        .expect(200)

    const user = await User.findById(userOne._id)
    expect(user).toBeNull() 

})

test('Should upload avatar image', async () => {
    await request(app) 
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}` )
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('should update valid user fields', async () => {
     await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}` )
        .send({
            name: 'Alex Kaufmann'
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toBe('Alex Kaufmann')
})


test('should not update invalid user fields', async () => {
    await request(app)
       .patch('/users/me')
       .set('Authorization', `Bearer ${userOne.tokens[0].token}` )
       .send({
           location: 'Oklahoma'
       })
       .expect(400)
})

