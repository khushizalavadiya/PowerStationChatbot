import { useState } from 'react';
import axios from 'axios';
// import io from 'socket.io-client';

const TestGen = ({user})=>{
    

    const createTest = () => {
        const testData = {
            
            "questions": [
              {
                "id": 1,
                "text": "What is the capital of France?",
                "optionA": "Paris",
                "optionB": "Berlin"
              },
              {
                "id": 2,
                "text": "Which programming language is known for its use in web development?",
                "optionA": "Java",
                "optionB": "JavaScript"
              },
              {
                "id": 3,
                "text": "What is the largest planet in our solar system?",
                "optionA": "Earth",
                "optionB": "Jupiter"
              }
            ],
            "answers" : [
                {
                    "id":1,
                    "ans":'A'
                },
                {
                    "id":2,
                    "ans":'B'
                },
                {
                    "id":3,
                    "ans":'B'
                }
            ]
          };

          const testString = JSON.stringify(testData)
        // Emit the 'createTest' event to the server
        axios.post('http://localhost:3001/testgen',{
            adminid: user,
            test: testString
        })
    };

    return(
        
        <div id="main-box">
            <button onClick={createTest} style={{ marginBottom: '10px' }}>
                create test
            </button>
            <button style={{ marginBottom: '10px' }}>
                close test
            </button>
        </div>
    );
}
export default TestGen;