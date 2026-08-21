import { Priority, Status, Task } from '../model/types';

export const taskList: Array<Task> = [
	{
		id: '01',
		title: 'Выучить React state',
		priority: Priority.HIGH,
		status: Status.TODO,
		progress: 0,
	},
	{
		id: '02',
		title: 'Читать книгу',
		priority: Priority.LOW,
		status: Status.DONE,
		progress: 100,
	},
	{
		id: '03',
		title: 'Сходить в магазин',
		priority: Priority.MEDIUM,
		status: Status.PROGRESS,
		progress: 50,
	},
	{
		id: '04',
		title: 'Заплатить за квартиру',
		priority: Priority.HIGH,
		status: Status.DONE,
		progress: 100,
	},
	{
		id: '05',
		title: 'Написать статью',
		priority: Priority.MEDIUM,
		status: Status.PROGRESS,
		progress: 50,
	},
];
