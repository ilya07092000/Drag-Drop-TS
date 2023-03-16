import ComponentBase from './component-base';
import Project from './project';

class ProjectItem extends ComponentBase<HTMLUListElement, HTMLLIElement> {
	private project: Project;

	get persons() {
		if (this.project.people === 1) {
			return '1 person';
		} else {
			return `${this.project.people} persons`;
		}
	}

	constructor(hostId: string, project: Project) {
		super('single-project', hostId, false, project.id.toString());
		this.project = project;

		this.configure();
		this.renderContent();
	}

	configure(): void {}
	renderContent(): void {
		this.element.querySelector('h2')!.textContent = this.project.title;
		this.element.querySelector('h3')!.textContent = `${this.persons} assigned`;
		this.element.querySelector('p')!.textContent = this.project.description;
	}
}

export default ProjectItem;
