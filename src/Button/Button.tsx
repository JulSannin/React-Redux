import classnames from "classnames"
import { MouseEventHandler, ReactNode } from "react"
import "./style.scss"

type ButtonProps = {
  title: string
  icon?: ReactNode
  outline?: boolean
  disabled?: boolean
  onClick: MouseEventHandler<HTMLButtonElement>
}

export const Button = ({ title, icon, outline }: ButtonProps) => {
  return (
    <button className={classnames(outline && "outline", "button")} >
      {icon && <span className="icon">{icon}</span>}
      {title}
    </button>
  )
}
