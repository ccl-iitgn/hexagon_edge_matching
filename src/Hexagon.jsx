import Triangle from "./Triangle"
import "./Hexagon.css"
import { useEffect, useState } from "react"
export default function Hexagon({ data }) {
    const [linedata, setLineData] = useState(['0,1', '2,3', '4,5', '6,7'])
    return (
        <div className="hexagon-main-container">
            {data.map((row, inx) => {
                let rowINX = linedata.indexOf(`${[inx, inx + 1]}`)
                let prevInx = linedata.indexOf(`${[inx - 1, inx]}`)
                return (
                    <div key={inx} className="hexagon-row-container" style={{ transform: rowINX == -1 ? `translateY(${-prevInx * 330 - 150}px)` : `translateY(${-rowINX * 330 + 150}px)` }}>
                        {row.map((item, ind) => {
                            return (
                                <div key={ind} style={{ transform: inx % 2 == 0 ? "rotate(180deg)" : "" }}><Triangle imageSources={item} /></div>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}