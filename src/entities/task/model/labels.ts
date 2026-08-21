import { Priority, Status } from './types';

export const PRIORITY_LABELS: Record<Priority, string> = {
	[Priority.LOW]: 'Низкий',
	[Priority.MEDIUM]: 'Средний',
	[Priority.HIGH]: 'Высокий',
};

export const STATUS_LABELS: Record<Status, string> = {
	[Status.TODO]: 'Сделать',
	[Status.PROGRESS]: 'В прогрессе',
	[Status.DONE]: 'Сделано',
};
