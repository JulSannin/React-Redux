import classNames from 'classnames';
import DeleteIcon from '@/shared/assets/icons/delete.svg?react';
import EditIcon from '@/shared/assets/icons/edit.svg?react';
import { CircularProgressBar } from '@/shared/ui';
import type { Task } from '../../model/types';
import { STATUS_LABELS, PRIORITY_LABELS } from '../../model/labels';
import './style.scss';

type TaskCardProps = {
	task: Task;
	onEdit: () => void;
	onDelete: () => void;
};

export const TaskCard = ({
	task: { title, priority, status, progress },
	onEdit,
	onDelete,
}: TaskCardProps) => {
	return (
		<div className="task-card">
			<div className="flex w-100">
				<span className="task-title">Задача</span>
				<span className="task">{title}</span>
			</div>
			<div className="flex">
				<span className="priority-title">Приоритет</span>
				<span className={classNames(`priority--${priority}`, 'priority')}>
					{PRIORITY_LABELS[priority]}
				</span>
			</div>
			<div className="task-status-wrapper">
				<button className={classNames(`status--${status}`, 'status')}>
					{STATUS_LABELS[status]}
				</button>
			</div>
			<div className="progress">
				<CircularProgressBar strokeWidth={2} sqSize={24} percentage={progress} />
			</div>
			<div className="actions">
				<EditIcon className="mr-20 cp" onClick={onEdit} />
				<DeleteIcon className="cp" onClick={onDelete} />
			</div>
		</div>
	);
};
