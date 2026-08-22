import classNames from 'classnames';
import Close from '@/shared/assets/icons/close.svg?react';
import { Button, Input, Modal } from '@/shared/ui';
import { Priority, PRIORITY_LABELS, Status, STATUS_LABELS, Task } from '@/entities/task';
import './style.scss';
import { FormEvent, useState } from 'react';

// массивы значений enum, при добавлении нового приоритета или статуса в enum, массив значений тоже нужно дополнять
const PRIORITY_ORDER: Priority[] = [Priority.HIGH, Priority.MEDIUM, Priority.LOW];
const STATUS_ORDER: Status[] = [Status.DONE, Status.PROGRESS, Status.TODO];

type AddEditProps = {
	onClose: () => void;
	// Пришла задача — редактируем, не пришла — создаём. Весь режим определяется этим.
	task?: Pick<Task, 'title' | 'priority' | 'status'>;
	// Форма не сохраняет сама, а отдаёт данные наверх.
	onSave: (data: Pick<Task, 'title' | 'priority' | 'status'>) => void;
	messageError: string | null;
	isSaving: boolean;
};

export const AddEditTaskModal = ({
	onClose,
	task,
	onSave,
	messageError,
	isSaving,
}: AddEditProps) => {
	// Начальные значения работают только при первом рендере — этого достаточно,
	// потому что при закрытии окно убирается из разметки и создаётся заново.
	const [title, setTitle] = useState(task?.title ?? '');
	const [priority, setPriority] = useState(task?.priority ? task.priority : Priority.LOW);
	const [status, setStatus] = useState(task?.status ? task.status : Status.TODO);

	// trim, чтобы строка из одних пробелов тоже считалась пустой.
	const isEmpty = title.trim() === '';
	const submitTitle = task ? 'Редактировать' : 'Добавить';

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		// Иначе браузер отправит форму сам и перезагрузит страницу.
		event.preventDefault();
		// Дублирует проверку кнопки: заблокированная кнопка не мешает нажать Enter.
		if (isEmpty || isSaving) return;
		onSave({ title, priority, status });
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
					{/* Управляемое поле: без onChange текст перестанет печататься. */}
					<Input
						label="Задача"
						placeholder="Введите текст..."
						onChange={event => setTitle(event.target.value)}
						name="title"
						value={title}
					/>
					<div className="modal-priority">
						<span>Приоритет</span>
						{/* priority — что выбрано, selectedPriority — что рисуем сейчас.
							Имена обязаны отличаться, иначе сравнивать будет нечего. */}
						<ul className="priority-buttons">
							{PRIORITY_ORDER.map(selectedPriority => (
								<li
									key={selectedPriority}
									onClick={() => setPriority(selectedPriority)}
									// Класс "-selected" только у совпавшего, иначе
									// подсветятся все три.
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
					{/* Только при редактировании: новая задача всегда «Сделать». */}
					{task && (
						<div className="modal-status">
							<span>Статус</span>
							<ul className="status-buttons">
								{STATUS_ORDER.map(selectedStatus => (
									<li
										key={selectedStatus}
										onClick={() => setStatus(selectedStatus)}
										className={classNames(selectedStatus, {
											[`${selectedStatus}-selected`]:
												status === selectedStatus,
										})}
									>
										{STATUS_LABELS[selectedStatus]}
									</li>
								))}
							</ul>
						</div>
					)}
					{messageError && <span className="message-error">{messageError}</span>}
					<div className="flx-right mt-50">
						{/* Блокировка на время запроса — от двойного клика. */}
						<Button
							title={isSaving ? 'Сохранение...' : submitTitle}
							type="submit"
							disabled={isEmpty || isSaving}
						/>
					</div>
				</div>
			</form>
		</Modal>
	);
};
