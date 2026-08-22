import classnames from 'classnames';
import { MouseEventHandler, ReactNode } from 'react';
import './style.scss';

type ButtonProps = {
	title: string;
	icon?: ReactNode;
	outline?: boolean;
	disabled?: boolean;
	// Объединение вместо string, чтобы опечатка не прошла проверку типов.
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
	// disabled — атрибутом, а не классом: по нему браузер сам блокирует клики
	// и применяет стиль .button:disabled.
	// Дефолт type='button': иначе кнопка внутри формы молча отправляла бы её.
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
