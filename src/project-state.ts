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

export { projectState };
