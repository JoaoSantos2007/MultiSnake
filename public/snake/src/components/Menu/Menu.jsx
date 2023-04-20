import React from "react"
import "./Menu.css"
import { Link } from "react-router-dom"

export const Menu = (props) => {
    const options = props.subdivisions

    return(
        <div className="menu">
            {options.map((option) => {
                return(
                    <Link to={`/lobby?page=${option}`} className="menu_options">
                        <p> {option.charAt(0).toUpperCase() + option.slice(1).toLowerCase()} </p>
                    </Link>
                )
            })}
        </div>
    )
}