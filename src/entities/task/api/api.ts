import { Task } from '../model/types';

const BASE_URL = import.meta.env.VITE_API_URL;

// Задача без id: его присваивает сервер.
type TaskDraft = Omit<Task, 'id'>;

// Общий помощник, чтобы не копировать адрес, заголовки и проверку в каждый запрос.
const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
	const response = await fetch(`${BASE_URL}${path}`, {
		headers: { 'Content-Type': 'application/json' },
		...options,
	});

	// fetch не считает 404 и 500 ошибкой — для него это обычный ответ.
	// Поэтому статус проверяем сами.
	if (!response.ok) {
		throw new Error(`Запрос не удался: ${response.status} ${response.statusText}`);
	}
	return response.json();
};

export const getTasks = () => request<Array<Task>>('/tasks');

// Возвращает созданную задачу — уже с id от сервера.
export const createTask = (task: TaskDraft) =>
	request<Task>('/tasks', { method: 'POST', body: JSON.stringify(task) });

export const updateTask = (id: string, task: TaskDraft) =>
	request<Task>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(task) });

export const deleteTask = (id: string) => request<Task>(`/tasks/${id}`, { method: 'DELETE' });
