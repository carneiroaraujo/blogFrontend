import { useState } from "react"
function Toggable({children, buttonLabel}) {
    const [visible, setVisible] = useState(false)
    const hideWhenVisible = {display:visible?"none":""}
    const showWhenVisible = {display:visible?"":"none"}
    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={() => setVisible(true)}>{buttonLabel}</button>
            </div>
            <div style={showWhenVisible}>
                {children}
                <button onClick={() => setVisible(false)}>cancel</button>
            </div>
        </div>    
    )
}

export default Toggable