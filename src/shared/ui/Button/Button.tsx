import classnames from 'classnames';
import { MouseEventHandler, ReactNode } from 'react';
import './style.scss';

type ButtonProps = {
	title: string;
	icon?: ReactNode;
	outline?: boolean;
	disabled?: boolean;
	type?: 'button' | 'submit';
	onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const Button = ({
	title,
	icon,
	outline,
	disabled,
	type = 'button',
	onClick,
}: ButtonProps) => {
	return (
		<button
			type={type}
			className={classnames('button', outline && 'outline')}
			onClick={onClick}
			disabled={disabled}
		>
			{icon && <span className="icon">{icon}</span>}
			{title}
		</button>
	);
};
