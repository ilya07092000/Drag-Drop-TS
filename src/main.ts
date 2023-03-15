class ProjectState {
	private listeners: any[] = [];
	private projects: any[] = [];
	private static instance: ProjectState;

	private constructor() {}

	static getInstance() {
		if (this.instance) {
			return this.instance;
		}

		this.instance = new ProjectState();
		return this.instance;
	}

	addProject(title: string, description: string, numOfPeople: number) {
		const newProject = {
			id: Date.now(),
			title,
			description,
			people: numOfPeople,
		};
		this.projects.push(newProject);
		for (const listenerFn of this.listeners) {
			listenerFn([...this.projects]);
		}
	}

	addListener(listenerFn: Function) {
		this.listeners.push(listenerFn);
	}
}

const projectState = ProjectState.getInstance();

// validation
interface Validatable {
	value: string | number;
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
}

function validate(input: Validatable) {
	let isValid = true;
	if (input.required) {
		isValid = isValid && input.value.toString().trim().length !== 0;
	}

	if (input.minLength && typeof input.value === 'string') {
		isValid = isValid && input.value.trim().length >= input.minLength;
	}

	if (input.maxLength && typeof input.value === 'string') {
		isValid = isValid && input.value.trim().length < input.maxLength;
	}

	if (input.min && typeof input.value === 'number') {
		isValid = isValid && input.value >= input.min;
	}

	if (input.max && typeof input.value === 'number') {
		isValid = isValid && input.value < input.max;
	}

	return isValid;
}

// autobind decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
	const originalMethod = descriptor.value;
	const adjDesriptor: PropertyDescriptor = {
		configurable: true,
		get() {
			const boundFn = originalMethod.bind(this);
			return boundFn;
		},
	};

	return adjDesriptor;
}

class ProjectInput {
	templateElement: HTMLTemplateElement;
	hostElement: HTMLDivElement;
	element: HTMLFormElement;
	titleInputElement: HTMLInputElement;
	descriptionInputElement: HTMLInputElement;
	peopleInputElement: HTMLInputElement;

	constructor() {
		this.templateElement = document.querySelector('#project-input')!;
		this.hostElement = document.querySelector('#app')!;

		const importedNode = document.importNode(
			this.templateElement.content,
			true
		);
		this.element = importedNode.firstElementChild as HTMLFormElement;
		this.element.id = 'user-input';

		this.titleInputElement = this.element.querySelector('#title')!;
		this.descriptionInputElement = this.element.querySelector('#description')!;
		this.peopleInputElement = this.element.querySelector('#people')!;

		this.configure();
		this.attach();
	}

	private gatherUserInput(): [string, string, number] | void {
		const title = this.titleInputElement.value;
		const description = this.descriptionInputElement.value;
		const people = this.peopleInputElement.value;

		const titleValidation: Validatable = {
			value: title,
			required: true,
		};

		const descriptionValidation: Validatable = {
			value: description,
			required: true,
			minLength: 5,
		};

		const peopleValidation: Validatable = {
			value: +people,
			required: true,
			min: 1,
			max: 10,
		};

		if (
			!validate(titleValidation) ||
			!validate(descriptionValidation) ||
			!validate(peopleValidation)
		) {
			alert('Invalid Input');
			return;
		}

		return [title, description, +people];
	}

	private clearInputs() {
		this.titleInputElement.value = '';
		this.descriptionInputElement.value = '';
		this.peopleInputElement.value = '';
	}

	@autobind
	private submitHandler(e: SubmitEvent) {
		e.preventDefault();

		const userInput = this.gatherUserInput();
		if (Array.isArray(userInput)) {
			const [title, description, people] = userInput;
			projectState.addProject(title, description, people);
			this.clearInputs();
		}
	}

	private configure() {
		this.element.addEventListener('submit', this.submitHandler);
	}

	private attach() {
		this.hostElement.insertAdjacentElement('afterbegin', this.element);
	}
}

const projectInput = new ProjectInput();

class ProjectList {
	templateElement: HTMLTemplateElement;
	hostElement: HTMLDivElement;
	element: HTMLElement;
	assignedProjects: any[] = [];

	constructor(private type: 'active' | 'finished' = 'active') {
		this.templateElement = document.querySelector('#project-list')!;
		this.hostElement = document.querySelector('#app')!;

		const importedNode = document.importNode(
			this.templateElement.content,
			true
		);
		this.element = importedNode.firstElementChild as HTMLElement;
		this.element.id = `${type}-projects`;

		projectState.addListener((projects: any[]) => {
			this.assignedProjects = projects;
			this.renderProjects();
		});
		this.attach();
		this.renderContent();
	}

	private renderProjects() {
		const listEl = document.getElementById(`${this.type}-projects-list`)!;
		for (const projectItem of this.assignedProjects) {
			const listItem = document.createElement('li');
			listItem.textContent = projectItem.title;

			listEl.appendChild(listItem);
		}
	}

	private renderContent() {
		const listId = `${this.type}-projects-list`;
		this.element.querySelector('ul')!.id = listId;
		this.element.querySelector(
			'h2'
		)!.textContent = `${this.type.toUpperCase()} PROJECTS`;
	}

	private attach() {
		this.hostElement.insertAdjacentElement('beforeend', this.element);
	}
}

new ProjectList('active');
new ProjectList('finished');

export {};
