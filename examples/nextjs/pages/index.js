import React from 'react';
import {createSteps} from '../../../steps.js';

let db = {
  anos : [{ ano: '2020'}, { ano: '2021'}	],
  cursos : [
    { ano: '2020', curso: 'c20a'},
    { ano: '2020', curso: 'c20b'},
    { ano: '2021', curso: 'c21a'},
  ],
  alumnos : [
    { curso: 'c20a', alumno: 'a1' },
    { curso: 'c20b', alumno: 'a1' },
    { curso: 'c20b', alumno: 'a2' },
    { curso: 'c21a', alumno: 'a2' },
  ]
}

// fake fetch
function asyncDb(table) {
  return new Promise(resolve=>{
    setTimeout(()=>resolve(db[table]),1000);
  });
}

// -- sync
// let steps = createSteps({
//   anos: ()=>({data: db.anos}),
//   cursos: ano=>({data: db.cursos.filter(e=>e.ano === ano) }) ,
//   alumnos: curso=>({data: db.alumnos.filter(e=>e.curso === curso) }) 
// });


// -- async
let steps = createSteps({
  anos: async ()=>({data: await asyncDb('anos') }),
  cursos: async ano=>({data: (await asyncDb('cursos')).filter(e=>e.ano === ano) }) ,
  alumnos: async curso=>({data: (await asyncDb('alumnos')).filter(e=>e.curso === curso) }) 
});


export default class Page extends React.Component {
  constructor() {
    super();
    steps.__proto__.forceUpdate = this.forceUpdate.bind(this);
    setTimeout(()=>steps.anos.load(),10);
  }

  render() {
    return (
      <div>
        <h1>Steps example</h1>

        <StepWithStates stepName="anos">
          <div>
            anos
            <select value={steps.anos.selected} 
              onChange={e => steps.cursos.load(e.target.value)}
            >
              {steps.anos.data.map( (anoObj,key)=>(
                <option key={key} value={anoObj.ano}>
                  {anoObj.ano}
                </option>
              ))}
            </select>
            {steps.anos.selected}
          </div>
        </StepWithStates>

        <StepWithStates stepName="cursos">
          <div>
            cursos
            <select value={steps.cursos.selected} 
              onChange={(e) => {steps.cursos.selected = e.target.value; steps.alumnos.load(); }}
            >
              {steps.cursos.data.map( (cursoObj,key)=>(
                <option key={key} value={cursoObj.curso}>
                  {cursoObj.curso}
                </option>
              ))}
            </select>
            {steps.cursos.selected}
          </div>
        </StepWithStates>

      </div>
    )
  }
  
}


function StepWithStates({stepName, children}) {
  return (
    <div>
      {steps[stepName].state === steps.STATES.BLANK &&
        <div>
          <p>blank {stepName}</p>
        </div>
      }
      {steps[stepName].state === steps.STATES.LOADING &&
        <div>
          <p>loading {stepName}</p>
        </div>
      }
      {steps[stepName].state === steps.STATES.ERROR &&
        <div>
          <p>error {stepName}: {steps[stepName].error}</p>
        </div>
      }
      {steps[stepName].state === steps.STATES.LOADED &&
        /* loaded state markup*/
         children
      }
    </div>
  )
}  

