
function Steps() {}
// hidden property
Steps.prototype.STATES = {BLANK:0, LOADING:1, ERROR:2, LOADED:3}


export function createSteps (stepsObj) {
  // regular object with hidden STATES property
  let steps = new Steps()

  Object.entries(stepsObj).forEach( (kv, index)=>{
    steps[kv[0]] = { 
      load: createLoad(steps, index, kv[1]),
      name: kv[0]
    }; 
  });

  Object.values(steps).forEach(step=>resetStep(step));

  return steps;
}


function resetStep(step, state=0) {
  step.state = state;
  step.error = undefined;
  step.data = [];
  step.selected = undefined;
}

function createLoad(steps, stepIndex, stepFetch) {
  
  async function loadStep(prevStepSelected) {
    let stepsKeys = Object.keys(steps);

    let stepName = stepsKeys[stepIndex];
    let step = steps[stepName];
    let prevStepName = stepIndex > 0 ? stepsKeys[stepIndex-1] : undefined;

    // -- check 'selected' of previous step if no step 0, set it if passed, get it if not passed
    if (stepIndex>0) {
      if (!prevStepSelected) { prevStepSelected = steps[prevStepName].selected; }
      else { steps[prevStepName].selected = prevStepSelected }
    }
    
    let ret = {error: ''};

    // -- missin prevStepSelected
    if (stepIndex > 0 && !prevStepSelected) {
      ret ={error: `Error loading "${stepName}", previous step "${prevStepName}" has nothing selected`}
      // console.log(ret);

      step.error = ret.error;
      step.state = steps.STATES.ERROR;
      if (steps.forceUpdate) { steps.forceUpdate() }
      return ret;
    }

    // console.log('get', stepIndex);
    // console.log(this.steps[stepIndex-1])

    // -- reset all steps bellow this one, set this one 'loading'
    for (let s=stepIndex; s < stepsKeys.length; s++) {
      let sName = stepsKeys[s];
      resetStep(steps[sName], s === stepIndex ? 1 : 0);
    }

    // -- forceUpdate loading and await fetch
    if (steps.forceUpdate) { steps.forceUpdate() }
    
    let fetchResults = await stepFetch(prevStepSelected);
    
    if (!fetchResults.hasOwnProperty('data') && !fetchResults.hasOwnProperty('error')) {
      // -- malformed fetch response
      step.error = `Specified fetch function of step "${stepName}" must return {error, data} object`;
      step.state = steps.STATES.ERROR;
      // return {error: `Get function of step "${this.steps[stepIndex-1].name}" must return {error, data} object`}
      // ret = {error: `Get function of step "${this.steps[stepIndex].name}" must return {error, data} object`};
      // console.log(ret);
      // return ret;
    } else if (fetchResults.error) {
      // -- wellformed response, but error happened
      step.error = fetchResults.error;
      step.state = steps.STATES.ERROR;
    } else {
      // -- ok response
      step.data = fetchResults.data;
      step.state = steps.STATES.LOADED;
    }

    // -- after fetch forceUpdate
    if (steps.forceUpdate) { steps.forceUpdate() }

    return {error: ''}
  }

  return loadStep;

}

