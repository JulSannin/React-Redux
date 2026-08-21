import { ReactNode } from 'react';
import './style.scss';

type ModalProps = {
	children: ReactNode;
};

export const Modal = ({ children }: ModalProps) => {
	return (
		<div className="modal">
			<div className="modal-content">{children}</div>
		</div>
	);
};
