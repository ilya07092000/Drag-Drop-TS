import ProjectStatus from './enums/project-status';

class Project {
	public id: number;
	public title: string;
	public description: string;
	public people: number;
	public status: ProjectStatus;

	constructor(
		id: number,
		title: string,
		description: string,
		people: number,
		status: ProjectStatus
	) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.people = people;
		this.status = status;
	}
}

export default Project;
