import React from "react";
import "./Lobby.css"
import Menu from "../../components/Menu";
import LobbyWallpaper from "../../assets/img/lobby_wallpaper.jpg"

export const Lobby = () => {
    const subdivisions = [
        "play",
        "social",
        "locker",
        "shop"
    ]

    return(
        <section className="lobby">
            <img src={LobbyWallpaper} alt="lobby wallpaper" className="lobby_wallpaper"/>
            <div className="lobby_menu">
                <Menu subdivisions = {subdivisions} />
            </div>


        </section>
    )
}