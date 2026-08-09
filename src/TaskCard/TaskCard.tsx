import classNames from 'classnames';
import DeleteIcon from '../assets/icons/delete.svg?react';
import EditIcon from '../assets/icons/edit.svg?react';
import { CircularProgressBar } from '../CircularProgressBar/CircularProgressBar';
import './style.scss';

export const TaskCard = ({
  task: { id, title, priority, status, progress },
}) => {
  return (
    <div className="task-card">
      <div className="flex w-100">
        <span className="task-title">Задача</span>
        <span className="task">{title}</span>
      </div>
      <div className="flex">
        <span className="priority-title">Приоритет</span>
        <span className={classNames(`priority--${priority}`, 'priority')}>
          {priority}
        </span>
      </div>
      <div className="task-status-wrapper">
        <button className={classNames(`status--${status}`, 'status')}>
          {status}
        </button>
      </div>
      <div className="progress">
        <CircularProgressBar
          strokeWidth={2}
          sqSize={24}
          percentage={progress}
        />
      </div>
      <div className="actions">
        <EditIcon className="mr-20 cp" onClick={() => {}} />
        <DeleteIcon className="cp" onClick={() => {}} />
      </div>
    </div>
  );
};
