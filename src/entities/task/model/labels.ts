import { Priority, Status } from './types';

// Подписи для экрана держим отдельно от значений enum: значения ('high', 'todo')
// зашиты в имена CSS-классов и уходят на сервер, менять их нельзя.
// Record заставит дописать подпись, если в enum добавится новый вариант.
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

// При редактировании прогресс пересчитывается по статусу — иначе получилась бы
// задача со статусом «Сделать» и прогрессом 100%.
export const STATUS_PROGRESS: Record<Status, number> = {
	[Status.TODO]: 0,
	[Status.PROGRESS]: 50,
	[Status.DONE]: 100,
};
