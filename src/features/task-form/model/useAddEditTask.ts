import { useState } from 'react';
import { createTask, updateTask, Status, STATUS_PROGRESS, type Task } from '@/entities/task';

// Запрос на создание/правку задачи и его isSaving/ошибка. Про список виджета
// хук не знает — отдаёт наверх задачу с сервера (в ней настоящий id),
// а куда её положить, решает вызывающий код.
export function useAddEditTask() {
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [actionError, setActionError] = useState<string | null>(null);

	const clearActionError = () => setActionError(null);

	// Возвращает Task при успехе и null при ошибке: компоненту нужно знать
	// исход, чтобы решить, закрывать ли окно и куда деть задачу.
	const addTask = async (task: Pick<Task, 'title' | 'priority'>): Promise<Task | null> => {
		setActionError(null);
		setIsSaving(true);
		try {
			// У новой задачи статус и прогресс всегда начальные, поэтому
			// проставляем их здесь — то, что прислала форма, перекрывается.
			return await createTask({ ...task, status: Status.TODO, progress: 0 });
		} catch (err) {
			// В catch тип unknown — бросить можно что угодно, не только Error.
			setActionError(err instanceof Error ? err.message : 'Не удалось сохранить');
			return null;
		} finally {
			// finally, а не конец try: иначе при ошибке кнопка залипнет навсегда.
			setIsSaving(false);
		}
	};

	// task — что правим, changed — что ввели в форме.
	const editTask = async (
		task: Pick<Task, 'id' | 'title' | 'priority' | 'status'>,
		changed: Pick<Task, 'title' | 'priority' | 'status'>,
	): Promise<Task | null> => {
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
			return await updateTask(task.id, updatedTask);
		} catch (err) {
			setActionError(err instanceof Error ? err.message : 'Не удалось сохранить');
			return null;
		} finally {
			setIsSaving(false);
		}
	};

	return { addTask, editTask, isSaving, actionError, clearActionError };
}
