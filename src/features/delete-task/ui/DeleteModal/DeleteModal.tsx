import { Button, Modal } from '@/shared/ui';
import './style.scss';

// Окно ничего не знает про задачи — только сообщает «подтвердил» и «закрыл».
type DeleteProps = {
	onClose: () => void;
	onConfirm: () => void;
	messageError: string | null;
	isSaving: boolean;
};

export const DeleteModal = ({ onClose, onConfirm, messageError, isSaving }: DeleteProps) => {
	return (
		<Modal>
			<div className="delete-modal">
				<p>Точно удалить задачу?</p>
				<div className="delete-modal__actions">
					<Button
						title={isSaving ? 'Удаление...' : 'Удалить'}
						onClick={onConfirm}
						disabled={isSaving}
					/>
					{/* «Выйти» не блокируем: закрыть окно можно всегда. */}
					<Button title="Выйти" outline onClick={onClose} />
				</div>
				{messageError && <span className="message-error">{messageError}</span>}
			</div>
		</Modal>
	);
};
