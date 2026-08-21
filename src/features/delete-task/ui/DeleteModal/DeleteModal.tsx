import { Button, Modal } from '@/shared/ui';
import './style.scss';

type DeleteProps = {
	onClose: () => void;
	onConfirm: () => void;
};

export const DeleteModal = ({ onClose, onConfirm }: DeleteProps) => {
	return (
		<Modal>
			<div className="delete-modal">
				<p>Точно удалить задачу?</p>
				<div className="delete-modal__actions">
					<Button title="Удалить" onClick={onConfirm} />
					<Button title="Выйти" outline onClick={onClose} />
				</div>
			</div>
		</Modal>
	);
};
