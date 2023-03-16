import { Validatable } from './types/validation';
import { validate } from './helpers/validation';
import { projectState } from './project-state';
import autobind from './decorators/autobind';
import ComponentBase from './component-base';

class ProjectInput extends ComponentBase<HTMLDivElement, HTMLFormElement> {
	titleInputElement: HTMLInputElement;
	descriptionInputElement: HTMLInputElement;
	peopleInputElement: HTMLInputElement;

	constructor() {
		super('project-input', 'app', true, 'user-input');

		this.titleInputElement = this.element.querySelector('#title')!;
		this.descriptionInputElement = this.element.querySelector('#description')!;
		this.peopleInputElement = this.element.querySelector('#people')!;

		this.configure();
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

	configure() {
		this.element.addEventListener('submit', this.submitHandler);
	}

	renderContent(): void {}
}

export default ProjectInput;
