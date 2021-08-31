const request = require('supertest')
const app = require('../../app')
const {response} = require("express");

const completeLaunchData= {
    mission: "ZTM155",
    rocket: "ZTM Experimental Is1",
    launchDate:"January 17, 2030",
    target: "Kepler-186 f"
}
const completeLaunchWithoutData= {
    mission: "ZTM155",
    rocket: "ZTM Experimental Is1",
    target: "Kepler-186 f"
}
const LaunchDataWithInvalidDate= {
    mission: "ZTM155",
    rocket: "ZTM Experimental Is1",
    launchDate:"January 17, 203f0",
    target: "Kepler-186 f"
}

describe('Test GET /launches',()=>{
    test('It should be respond with 200 success',async ()=>{
        const response = await request(app)
            .get('/launches')
            .expect('Content-Type',/json/)
            .expect(200)
    })
})

describe('Test POST /launches',()=>{

    test('It should be respond with 201 success',async ()=>{
       const response = await request(app)
           .post('/launches')
           .send(completeLaunchData)
           .expect(201)
        const requestDate = new Date(completeLaunchData.launchDate).valueOf()
        const responseDateDate = new Date(response.body.launchDate).valueOf()
        expect(responseDateDate).toBe(requestDate)
        expect(response.body).toMatchObject(completeLaunchWithoutData)
    })
    test('It should catch missing required properties',async ()=>{
        const response = await request(app)
            .post('/launches')
            .send(completeLaunchData)
            .expect('Content-Type',/json/)
            .expect(400)
    })
    test('It should catch invalid dates',async ()=>{
        const response = await request(app)
            .post('/launches')
            .send(LaunchDataWithInvalidDate)
            .expect('Content-Type',/json/)
            .expect(400)
    })
    expect(response.body).toStrictEqual({
        error: 'Invalid launch date'
    })
})
