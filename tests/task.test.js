const request = require('supertest')
const app = require('../src/app')
const { userOneId, userOne, setUpDataBase } = require('./fixtures/db')



beforeEach(setUpDataBase)



test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}` )
        .send({
            task: 'From my test',
            completed: false
        })
        .expect(201)
}) 