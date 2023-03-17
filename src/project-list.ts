import ProjectStatus from './enums/project-status';
import Project from './project';
import { projectState } from './project-state';
import ComponentBase from './component-base';
import ProjectItem from './project-item';
import { DragTarget } from './types/drag-drop';
import autobind from './decorators/autobind';

class ProjectList
	extends ComponentBase<HTMLDivElement, HTMLElement>
	implements DragTarget
{
	assignedProjects: Project[];

	constructor(private type: 'active' | 'finished' = 'active') {
		super('project-list', 'app', false, `${type}-projects`);
		this.assignedProjects = [];

		this.configure();
		this.renderContent();
	}

	@autobind
	dragOverHandler(event: DragEvent): void {
		if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
			event.preventDefault();
			const listEl = this.element.querySelector('ul')!;
			listEl.classList.add('droppable');
		}
	}

	@autobind
	dropHandler(this: HTMLElement, event: DragEvent): void {
		const projectId = +event.dataTransfer!.getData('text/plain');
		projectState.switchProjectStatus(
			projectId,
			(this as unknown as ProjectList).type === 'active'
				? ProjectStatus.Active
				: ProjectStatus.Finished
		);
	}

	@autobind
	dragLeaveHandler(_: DragEvent): void {
		const listEl = this.element.querySelector('ul')!;
		listEl.classList.remove('droppable');
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
		this.element.addEventListener('dragover', this.dragOverHandler);
		this.element.addEventListener('dragleave', this.dragLeaveHandler);
		this.element.addEventListener('drop', this.dropHandler);

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
