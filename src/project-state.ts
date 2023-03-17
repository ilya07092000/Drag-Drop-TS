import ProjectStatus from './enums/project-status';
import Project from './project';
import { Listener } from './types/listener';

class ProjectState {
	private listeners: Listener[] = [];
	private projects: Project[] = [];
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
		const newProject = new Project(
			Date.now(),
			title,
			description,
			numOfPeople,
			ProjectStatus.Active
		);
		this.projects.push(newProject);
		this.updateListeners();
	}

	addListener(listenerFn: Listener) {
		this.listeners.push(listenerFn);
	}

	switchProjectStatus(projectId: number, newStatus: ProjectStatus) {
		const currProject = this.projects.find((pr) => pr.id === projectId);

		if (currProject) {
			currProject.status = newStatus;
			this.updateListeners();
		}
	}

	private updateListeners() {
		for (const listenerFn of this.listeners) {
			listenerFn([...this.projects]);
		}
	}
}

const projectState = ProjectState.getInstance();

export { projectState };
