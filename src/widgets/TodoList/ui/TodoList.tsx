import './style.scss';
import Add from '@/shared/assets/icons/add.svg?react';
import { AddEditTaskModal } from '@/features/task-form';
import { Button } from '@/shared/ui';
import { DeleteModal } from '@/features/delete-task';
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
	const {
		tasks,
		isLoading,
		error,
		actionError,
		isSaving,
		clearActionError,
		addTask,
		editTask,
		removeTask,
	} = useTasks();

	// Открытие окна всегда стирает ошибку от прошлого действия — иначе в свежем
	// окне добавления висело бы сообщение от неудачного удаления.
	const openCreate = () => {
		clearActionError();
		setAddEditTask('newTask');
	};

	const openEdit = (task: Task) => {
		clearActionError();
		setAddEditTask(task);
	};

	const openDelete = (task: Task) => {
		clearActionError();
		setTaskToDelete(task);
	};

	// Форма одна на два режима и про них не знает: какую операцию звать —
	// решаем здесь, по состоянию окна.
	const handleTaskModal = async (data: Pick<Task, 'title' | 'priority' | 'status'>) => {
		if (addEditTask === 'newTask') {
			// Закрываем только при успехе: иначе окно остаётся вместе с введённым
			// текстом, и попытку можно повторить.
			const ok = await addTask(data);
			if (ok) setAddEditTask(null);
			return;
		} else if (addEditTask) {
			const ok = await editTask(addEditTask, data);
			if (ok) setAddEditTask(null);
		}
	};

	// Меняется только область списка, поэтому шапка и модалки ниже написаны один раз.
	const renderContent = () => {
		if (isLoading) return <span>Загрузка...</span>;
		if (error) return <span>{error}</span>;
		if (tasks.length === 0)
			return (
				<>
					<span>Нет задач</span>
				</>
			);
		return (
			<>
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
			</>
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
					messageError={actionError}
					isSaving={isSaving}
				/>
			)}
			{taskToDelete && (
				<DeleteModal
					onClose={() => {
						setTaskToDelete(null);
					}}
					onConfirm={async () => {
						const ok = await removeTask(taskToDelete.id);
						if (ok) return setTaskToDelete(null);
					}}
					messageError={actionError}
					isSaving={isSaving}
				/>
			)}
		</>
	);
};
