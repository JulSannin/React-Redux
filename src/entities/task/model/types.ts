// Подписи на русском — в labels.ts, здесь только значения (wire-формат и CSS-классы).
export enum Priority {
	LOW = 'low',
	MEDIUM = 'medium',
	HIGH = 'high',
}

export enum Status {
	TODO = 'todo',
	PROGRESS = 'progress',
	DONE = 'done',
}

export type Task = {
	id: string;
	title: string;
	priority: Priority;
	status: Status;
	progress: number;
};
