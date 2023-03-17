interface Draggable {
	dragStartHandler(event: DragEvent): void;
	dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
	dragOverHandler(event: DragEvent): void;
	dropHandler(this: HTMLElement, event: DragEvent): void;
	dragLeaveHandler(event: DragEvent): void;
}

export type { Draggable, DragTarget };
