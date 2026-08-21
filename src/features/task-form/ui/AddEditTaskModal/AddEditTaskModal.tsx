import classNames from 'classnames';
import Close from '@/shared/assets/icons/close.svg?react';
import { Button, Input, Modal } from '@/shared/ui';
import { Priority, PRIORITY_LABELS, Task } from '@/entities/task';
import './style.scss';
import { FormEvent, useState } from 'react';

// массив значений enum, при добавлении нового приоритета в enum, массив значений тоже нужно дополнять
const PRIORITY_ORDER: Priority[] = [Priority.HIGH, Priority.MEDIUM, Priority.LOW];

type AddEditProps = {
	onClose: () => void;
	task?: Pick<Task, 'title' | 'priority'>;
	onSave: (data: Pick<Task, 'title' | 'priority'>) => void;
};

export const AddEditTaskModal = ({ onClose, task, onSave }: AddEditProps) => {
	const [title, setTitle] = useState(task?.title ?? '');
	const [priority, setPriority] = useState(task?.priority ? task.priority : Priority.LOW);

	const isEmpty = title.trim() === '';

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (isEmpty) return;
		onSave({ title, priority });
	};

	return (
		<Modal>
			<form onSubmit={handleSubmit}>
				<div className="add-edit-modal">
					<div className="flx-between">
						<span className="modal-title">
							{task ? 'Редактировать задачу' : 'Добавить задачу'}
						</span>
						<Close className="cp" onClick={onClose} />
					</div>
					<Input
						label="Задача"
						placeholder="Введите текст..."
						onChange={event => setTitle(event.target.value)}
						name="title"
						value={title}
					/>
					<div className="modal-priority">
						<span>Приоритет</span>
						<ul className="priority-buttons">
							{PRIORITY_ORDER.map(selectedPriority => (
								<li
									key={selectedPriority}
									onClick={() => setPriority(selectedPriority)}
									className={classNames(selectedPriority, {
										[`${selectedPriority}-selected`]:
											priority === selectedPriority,
									})}
								>
									{PRIORITY_LABELS[selectedPriority]}
								</li>
							))}
						</ul>
					</div>
					<div className="flx-right mt-50">
						<Button
							title={task ? 'Редактировать' : 'Добавить'}
							type="submit"
							disabled={isEmpty}
						/>
					</div>
				</div>
			</form>
		</Modal>
	);
};
