import { MouseEventHandler, useContext, useState } from "react"
// import { DarkModeContext } from "./layout"

export default function Footer() {
    // const { toggleDarkMode } = useContext(DarkModeContext)
    const [mode, setMode] = useState('light')
    function changeMode() {
        if (mode === 'light') {
            setMode('dark')
        } else {
            setMode('light')
        }
        // toggleDarkMode(e)
    }
    return (
        <div className="footer text-4xl text-center">
            <button type="button" onClick={ changeMode }>
                {mode === 'light' ? '🌞' : '🌚'}
            </button>
        </div>
    )
}