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
			console.log(title, description, people);
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

	constructor(private type: 'active' | 'finished' = 'active') {
		this.templateElement = document.querySelector('#project-list')!;
		this.hostElement = document.querySelector('#app')!;

		const importedNode = document.importNode(
			this.templateElement.content,
			true
		);
		this.element = importedNode.firstElementChild as HTMLElement;
		this.element.id = `${type}-projects`;

		this.attach();
		this.renderContent();
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
