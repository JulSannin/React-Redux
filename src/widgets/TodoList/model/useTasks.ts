import { useState, useEffect } from 'react';
import { getTasks, type Task } from '@/entities/task';

// Только получение списка. Создание/правку/удаление на сервере хук не знает —
// см. useAddEditTask (features/task-form) и useDeleteTask (features/delete-task).
export function useTasks() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// [] — выполнить один раз после первого рендера.
	useEffect(() => {
		getTasks()
			.then(setTasks)
			.catch(err => setError(err.message))
			.finally(() => setIsLoading(false));
	}, []);

	// Наружу — не setTasks, а точечные операции: снаружи нельзя случайно
	// положить в список что-то, кроме результата настоящего запроса.
	const addToList = (task: Task) => setTasks(prev => [task, ...prev]);

	// map подменяет только совпавшую задачу, поэтому она остаётся на своём
	// месте. «Удалить + добавить» отправило бы её наверх списка.
	const replaceInList = (task: Task) =>
		setTasks(prev => prev.map(item => (item.id === task.id ? task : item)));

	// filter возвращает новый массив: React сравнивает по ссылке и правку
	// «на месте» не заметил бы.
	const removeFromList = (id: string) => setTasks(prev => prev.filter(task => task.id !== id));

	return { tasks, isLoading, error, addToList, replaceInList, removeFromList };
}
