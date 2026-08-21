import './style.scss';
import Add from '@/shared/assets/icons/add.svg?react';
import { AddEditTaskModal } from '@/features/task-form';
import { Button } from '@/shared/ui';
import { DeleteModal } from '@/features/delete-task';
import { Status, TaskCard, taskList } from '@/entities/task';
import type { Task } from '@/entities/task';
import { useState } from 'react';

export const TodoList = () => {
	const [tasks, setTasks] = useState(taskList);
	const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
	const [addEditTask, setAddEditTask] = useState<'newTask' | Task | null>(null);

	const addTask = (task: Pick<Task, 'title' | 'priority'>) => {
		const newTask: Task = {
			...task,
			id: crypto.randomUUID(),
			status: Status.TODO,
			progress: 0,
		};

		setTasks(prevTasks => [newTask, ...prevTasks]);
	};

	const updateTask = (id: string, changes: Pick<Task, 'title' | 'priority'>) => {
		setTasks(prevTasks =>
			prevTasks.map(task => (task.id === id ? { ...task, ...changes } : task)),
		);
	};

	const deleteTask = (id: string) => {
		setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
	};

	const handleTaskModal = (data: Pick<Task, 'title' | 'priority'>) => {
		if (addEditTask === 'newTask') {
			addTask(data);
		} else if (addEditTask) {
			updateTask(addEditTask.id, data);
		}
		setAddEditTask(null);
	};

	return (
		<>
			<div className="page-wrapper">
				<div className="top-title">
					<h2>Список задач</h2>
					<Button
						title="Добавить задачу"
						icon={<Add />}
						onClick={() => {
							setAddEditTask('newTask');
						}}
					/>
				</div>
				<div className="task-container">
					{tasks.map(task => (
						<TaskCard
							key={task.id}
							task={task}
							onEdit={() => setAddEditTask(task)}
							onDelete={() => {
								setTaskToDelete(task);
							}}
						/>
					))}
				</div>
			</div>
			{addEditTask !== null && (
				<AddEditTaskModal
					onClose={() => setAddEditTask(null)}
					onSave={handleTaskModal}
					task={addEditTask === 'newTask' ? undefined : addEditTask}
				/>
			)}
			{taskToDelete && (
				<DeleteModal
					onClose={() => {
						setTaskToDelete(null);
					}}
					onConfirm={() => {
						deleteTask(taskToDelete.id);
						setTaskToDelete(null);
					}}
				/>
			)}
		</>
	);
};
