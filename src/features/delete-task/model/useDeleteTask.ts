import { useState } from 'react';
import { deleteTask } from '@/entities/task';

// Запрос на удаление и его isSaving/ошибка. Какую задачу убрать из
// локального списка — решает вызывающий код, хук лишь сообщает об успехе.
export function useDeleteTask() {
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [actionError, setActionError] = useState<string | null>(null);

	const clearActionError = () => setActionError(null);

	const removeTask = async (id: string): Promise<boolean> => {
		setActionError(null);
		setIsSaving(true);
		try {
			await deleteTask(id);
			return true;
		} catch (err) {
			setActionError(err instanceof Error ? err.message : 'Не удалось удалить');
			return false;
		} finally {
			setIsSaving(false);
		}
	};

	return { removeTask, isSaving, actionError, clearActionError };
}
