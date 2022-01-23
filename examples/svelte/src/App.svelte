<script>

	import {createSteps} from '../../../steps.js';
	import StepWithStates from './StepWithStates.svelte';

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

	let steps = createSteps({
		anos: async ()=>({data: await asyncDb('anos') }),
		cursos: async ano=>({data: (await asyncDb('cursos')).filter(e=>e.ano === ano) }) ,
		alumnos: async curso=>({data: (await asyncDb('alumnos')).filter(e=>e.curso === curso) }) 
	});

	steps.__proto__.forceUpdate = ()=>steps = steps;
	steps.anos.load();
		
</script>

<h1>Stepper example</h1>

<StepWithStates steps={steps} stepName="anos">
	<div>
		anos
		<select value={steps.anos.selected} 
			on:change={e => steps.cursos.load(e.target.value)}
		>
			{#each steps.anos.data as anoObj}
				<option value={anoObj.ano}>
					{anoObj.ano}
				</option>
			{/each}
		</select>
		{steps.anos.selected}
	</div>
</StepWithStates>


<StepWithStates steps={steps} stepName="cursos">
	<div>
		cursos
		<select value={steps.cursos.selected} 
			on:change={e => steps.alumnos.load(e.target.value)}
		>
			{#each steps.cursos.data as cursoObj}
				<option value={cursoObj.curso}>
					{cursoObj.curso}
				</option>
			{/each}
		</select>
		{steps.cursos.selected}
	</div>
</StepWithStates>









