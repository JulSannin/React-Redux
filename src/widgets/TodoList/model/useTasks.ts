import { useState, useEffect } from 'react';
import {
	Status,
	getTasks,
	createTask,
	updateTask,
	deleteTask,
	STATUS_PROGRESS,
	type Task,
} from '@/entities/task';

// Вся работа с данными: загрузка и три операции. Компоненту остаётся разметка.
export function useTasks() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	// error — список не загрузился, показывать нечего.
	// actionError — список цел, не удалось одно действие. Смешивать нельзя:
	// иначе неудачное сохранение стёрло бы с экрана весь список.
	const [error, setError] = useState<string | null>(null);
	const [actionError, setActionError] = useState<string | null>(null);

	// Блокирует кнопки на время запроса, чтобы двойной клик не создал две задачи.
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const clearActionError = () => setActionError(null);

	// [] — выполнить один раз после первого рендера.
	useEffect(() => {
		getTasks()
			.then(setTasks)
			.catch(err => setError(err.message))
			.finally(() => setIsLoading(false));
	}, []);

	// У новой задачи статус и прогресс всегда начальные, поэтому проставляем их
	// здесь — то, что прислала форма, перекрывается.
	// Возвращает true/false: ошибку ловим здесь, а компоненту нужно знать исход,
	// чтобы решить, закрывать ли окно.
	const addTask = async (task: Pick<Task, 'title' | 'priority'>): Promise<boolean> => {
		const newTask = {
			...task,
			status: Status.TODO,
			progress: 0,
		};
		setActionError(null);
		setIsSaving(true);
		try {
			// Сначала сервер, потом экран — иначе при ошибке экран соврёт.
			const createdTask = await createTask(newTask);
			// Кладём ответ сервера: только в нём есть настоящий id.
			setTasks(prevTasks => [createdTask, ...(prevTasks ?? [])]);
			setError(null);
			return true;
		} catch (err) {
			// В catch тип unknown — бросить можно что угодно, не только Error.
			setActionError(err instanceof Error ? err.message : 'Не удалось сохранить');
			return false;
		} finally {
			// finally, а не конец try: иначе при ошибке кнопка залипнет навсегда.
			setIsSaving(false);
		}
	};

	// task — что правим, changed — что ввели в форме.
	const editTask = async (
		task: Pick<Task, 'title' | 'priority' | 'id' | 'status'>,
		changed: Pick<Task, 'title' | 'priority' | 'status'>,
	): Promise<boolean> => {
		// Отправляем объект целиком: от частичного сервер может затереть
		// незаполненные поля.
		const updatedTask = {
			...task,
			...changed,
			// Вычисляется по статусу, поэтому стоит последним — перекрывает старое.
			progress: STATUS_PROGRESS[changed.status],
		};

		setActionError(null);
		setIsSaving(true);
		try {
			const editingTask = await updateTask(task.id, updatedTask);
			// map подменяет только совпавшую задачу, поэтому она остаётся на своём
			// месте. «Удалить + добавить» отправило бы её наверх списка.
			setTasks(prevTasks =>
				(prevTasks ?? []).map(item =>
					item.id === task.id ? { ...item, ...editingTask } : item,
				),
			);
			setError(null);
			return true;
		} catch (err) {
			setActionError(err instanceof Error ? err.message : 'Не удалось сохранить');
			return false;
		} finally {
			setIsSaving(false);
		}
	};

	const removeTask = async (id: string): Promise<boolean> => {
		setActionError(null);
		setIsSaving(true);
		try {
			await deleteTask(id);
			// filter возвращает новый массив: React сравнивает по ссылке и правку
			// «на месте» не заметил бы.
			setTasks(prevTasks => (prevTasks ?? []).filter(task => task.id !== id));
			setError(null);
			return true;
		} catch (err) {
			setActionError(err instanceof Error ? err.message : 'Не удалось удалить');
			return false;
		} finally {
			setIsSaving(false);
		}
	};

	return {
		tasks,
		isLoading,
		error,
		actionError,
		isSaving,
		clearActionError,
		addTask,
		editTask,
		removeTask,
	};
}
