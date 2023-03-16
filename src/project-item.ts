import ComponentBase from './component-base';
import Project from './project';

class ProjectItem extends ComponentBase<HTMLUListElement, HTMLLIElement> {
	private project: Project;

	constructor(hostId: string, project: Project) {
		super('single-project', hostId, false, project.id.toString());
		this.project = project;

		this.configure();
		this.renderContent();
	}

	configure(): void {}
	renderContent(): void {
		this.element.querySelector('h2')!.textContent = this.project.title;
		this.element.querySelector('h3')!.textContent =
			this.project.people.toString();
		this.element.querySelector('p')!.textContent = this.project.description;
	}
}

export default ProjectItem;
