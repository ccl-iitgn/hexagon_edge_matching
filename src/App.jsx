import { Fragment, useEffect, useState } from "react"
import { GenSolution } from "./Generate"
import Hexagon from "./Hexagon"
import "./App.css"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
export default function App() {
  const [dataList, setDataList] = useState()
  const [loading, setLoading] = useState(false)

  const DownloadHandler = async () => {
    if (loading || !dataList) return
    setLoading(true)

    const pdf = new jsPDF("p", "mm", "a4")
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    for (let i = 0; i < dataList.length; i++) {
      const [hexComponent, title] = dataList[i]
      const wrapper = document.createElement("div")
      wrapper.style.width = "1200px"
      wrapper.style.padding = "20px"
      wrapper.style.background = "white"

      const heading = document.createElement("h2")
      heading.innerText = `${i + 1}. ${title}`
      wrapper.appendChild(heading)

      const container = document.createElement("div")
      wrapper.appendChild(container)
      document.body.appendChild(wrapper)
      const { createRoot } = await import("react-dom/client")
      const root = createRoot(container)
      root.render(hexComponent)

      await new Promise(resolve => setTimeout(resolve, 500)) 

      const canvas = await html2canvas(wrapper, {
        scale: 1.2,
        useCORS: true,
      })
      const imgData = canvas.toDataURL("image/jpeg", 0.6) 

      const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height)
      const imgWidth = canvas.width * ratio
      const imgHeight = canvas.height * ratio

      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight)

      if (i !== dataList.length - 1) pdf.addPage()

      document.body.removeChild(wrapper)
    }

    pdf.save("Hexagon_Puzzles_Optimized.pdf")
    setLoading(false)
  }
  useEffect(() => {
    setLoading(true)
    const tempData = GenSolution()
    setDataList([
      [<Hexagon data={tempData["normal"]} />, "General Puzzle"],
      [<Hexagon data={tempData["same"]} />, "Same Boundary Puzzle"],
      [<Hexagon data={tempData["0,0"]} />, "Puzzle Without I"],
      [<Hexagon data={tempData["1,1"]} />, "Puzzle Without II"],
      [<Hexagon data={tempData["2,2"]} />, "Puzzle Without X"],
      [<Hexagon data={tempData["3,3"]} />, "Puzzle Without O"],
      [<Hexagon data={tempData["0,2"]} />, "Puzzle Without Y"],
      [<Hexagon data={tempData["1,3"]} />, "Puzzle Without U"],
      [<Hexagon data={tempData["you"]} />, "Puzzle using symbols: YOU"]
    ])
    setLoading(false)
  }, [])
  return (
    <Fragment>
      <h1>Hexagon Edge Matching Puzzle</h1>
      <button onClick={DownloadHandler}>Download</button>
      {(loading || !dataList) ? <div>loading...</div> :
        <main className="hexagon-main">
          {dataList.map((item, inx) => {
            return (
              <section key={inx}>
                <h2>{inx + 1}. {item[1]}</h2>
                {item[0]}
              </section>
            )
          })}
        </main>}
    </Fragment>
  )
}