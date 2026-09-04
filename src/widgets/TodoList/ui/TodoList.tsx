import './style.scss';
import Add from '@/shared/assets/icons/add.svg?react';
import { AddEditTaskModal, useAddEditTask } from '@/features/task-form';
import { Button } from '@/shared/ui';
import { DeleteModal, useDeleteTask } from '@/features/delete-task';
import { TaskCard, type Task } from '@/entities/task';
import { useState } from 'react';
import { useTasks } from '../model/useTasks';

export const TodoList = () => {
	// Храним не «открыто ли окно», а «с чем оно работает» — тогда состояние
	// «окно открыто, но задача не выбрана» невыразимо.
	const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

	// null — закрыта, 'newTask' — создаём, объект — редактируем эту задачу.
	// Метка нужна только для создания: задачи ещё не существует.
	const [addEditTask, setAddEditTask] = useState<'newTask' | Task | null>(null);

	const { tasks, isLoading, error, addToList, replaceInList, removeFromList } = useTasks();

	// У каждой фичи свой собственный запрос, поэтому свои isSaving/actionError —
	// при разборе переименовываем, иначе одноимённые поля затёрли бы друг друга.
	const {
		addTask,
		editTask,
		isSaving: isSavingTask,
		actionError: taskError,
		clearActionError: clearTaskError,
	} = useAddEditTask();

	const {
		removeTask,
		isSaving: isDeleting,
		actionError: deleteError,
		clearActionError: clearDeleteError,
	} = useDeleteTask();

	// Открытие окна всегда стирает ошибку от прошлого действия той же фичи —
	// иначе в свежем окне добавления висело бы сообщение от прошлой неудачи.
	const openCreate = () => {
		clearTaskError();
		setAddEditTask('newTask');
	};

	const openEdit = (task: Task) => {
		clearTaskError();
		setAddEditTask(task);
	};

	const openDelete = (task: Task) => {
		clearDeleteError();
		setTaskToDelete(task);
	};

	// Форма одна на два режима и про них не знает: какую операцию звать —
	// решаем здесь, по состоянию окна.
	const handleTaskModal = async (data: Pick<Task, 'title' | 'priority' | 'status'>) => {
		if (addEditTask === 'newTask') {
			const created = await addTask(data);
			// Закрываем и кладём в список только при успехе: иначе окно
			// осталось бы вместе с введённым текстом, и попытку можно повторить.
			if (created) {
				addToList(created);
				setAddEditTask(null);
			}
			return;
		}
		if (addEditTask) {
			const edited = await editTask(addEditTask, data);
			if (edited) {
				replaceInList(edited);
				setAddEditTask(null);
			}
		}
	};

	const handleDelete = async () => {
		if (!taskToDelete) return;
		const ok = await removeTask(taskToDelete.id);
		if (ok) {
			removeFromList(taskToDelete.id);
			setTaskToDelete(null);
		}
	};

	// Меняется только область списка, поэтому шапка и модалки ниже написаны один раз.
	const renderContent = () => {
		if (isLoading) return <span>Загрузка...</span>;
		if (error) return <span>{error}</span>;
		if (tasks.length === 0) return <span>Нет задач</span>;
		return (
			<div className="task-container">
				{/* key по id, а не по индексу: после удаления индексы сместятся. */}
				{tasks.map(task => (
					<TaskCard
						key={task.id}
						task={task}
						// Стрелка замыкает свою задачу, поэтому карточке не нужен аргумент.
						onEdit={() => openEdit(task)}
						onDelete={() => openDelete(task)}
					/>
				))}
			</div>
		);
	};

	return (
		<>
			<div className="page-wrapper">
				<div className="top-title">
					<h2>Список задач</h2>
					<Button title="Добавить задачу" icon={<Add />} onClick={openCreate} />
				</div>
				{renderContent()}
			</div>
			{addEditTask !== null && (
				<AddEditTaskModal
					onClose={() => setAddEditTask(null)}
					onSave={handleTaskModal}
					// Метка 'newTask' — внутренняя кухня виджета, форме её знать незачем.
					task={addEditTask === 'newTask' ? undefined : addEditTask}
					messageError={taskError}
					isSaving={isSavingTask}
				/>
			)}
			{taskToDelete && (
				<DeleteModal
					onClose={() => setTaskToDelete(null)}
					onConfirm={handleDelete}
					messageError={deleteError}
					isSaving={isDeleting}
				/>
			)}
		</>
	);
};
