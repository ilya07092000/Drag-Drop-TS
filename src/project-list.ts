import ProjectStatus from './enums/project-status';
import Project from './project';
import { projectState } from './project-state';
import ComponentBase from './component-base';
import ProjectItem from './project-item';

class ProjectList extends ComponentBase<HTMLDivElement, HTMLElement> {
	assignedProjects: Project[];

	constructor(private type: 'active' | 'finished' = 'active') {
		super('project-list', 'app', false, `${type}-projects`);
		this.assignedProjects = [];

		this.configure();
		this.renderContent();
	}

	private renderProjects() {
		const listEl = document.getElementById(`${this.type}-projects-list`)!;
		listEl.innerHTML = '';
		for (const projectItem of this.assignedProjects) {
			new ProjectItem(this.element.querySelector('ul')!.id, projectItem);
		}
	}

	renderContent() {
		const listId = `${this.type}-projects-list`;
		this.element.querySelector('ul')!.id = listId;
		this.element.querySelector(
			'h2'
		)!.textContent = `${this.type.toUpperCase()} PROJECTS`;
	}

	configure(): void {
		projectState.addListener((projects: Project[]) => {
			const relevantProjects = projects.filter((project) => {
				if (this.type === 'active') {
					return project.status === ProjectStatus.Active;
				}

				return project.status === ProjectStatus.Finished;
			});
			this.assignedProjects = relevantProjects;
			this.renderProjects();
		});
	}
}

export default ProjectList;
