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
		for (const listenerFn of this.listeners) {
			listenerFn([...this.projects]);
		}
	}

	addListener(listenerFn: Listener) {
		this.listeners.push(listenerFn);
	}
}

const projectState = ProjectState.getInstance();

export { projectState };
