import React, { useEffect, useRef, useState } from "react";

const TriangleImage = ({ imageSources }) => {
  const canvasRef = useRef(null);
  const [dataUrl, setDataUrl] = useState(null);
  const imagesData = {
    0: "/I.png",
    1: "/I2.png",
    2: "/V.png",
    3: "/U.png"
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const A = { x: width / 2, y: 20 };
    const B = { x: 20, y: height - 20 };
    const C = { x: width - 20, y: height - 20 };

    const edges = [
      { from: A, to: B, angle: 120 },
      { from: B, to: C, angle: 0 },
      { from: C, to: A, angle: 240 },
    ];

    const orderedImageSources = [imageSources[1], imageSources[0], imageSources[2]];

    const loadedImages = new Array(3).fill(null);
    let loadedCount = 0;

    const drawCanvas = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(B.x, B.y);
      ctx.lineTo(C.x, C.y);
      ctx.closePath();
      ctx.clip();
      ctx.fillStyle = "#f0f8ff";
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(B.x, B.y);
      ctx.lineTo(C.x, C.y);
      ctx.closePath();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.stroke();
      edges.forEach(({ from, to, angle }, i) => {
        if (loadedImages[i]) {
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          let dx = to.x - from.x;
          let dy = to.y - from.y;
          let perpX = dy;
          let perpY = -dx;

          const len = Math.sqrt(perpX * perpX + perpY * perpY);
          perpX /= len;
          perpY /= len;

          const offset = 25;
          const adjustedX = midX + perpX * offset;
          const adjustedY = midY + perpY * offset;

          ctx.save();
          ctx.translate(adjustedX, adjustedY);
          ctx.rotate((angle * Math.PI) / 180);
          ctx.drawImage(loadedImages[i], -20, -20, 40, 40);
          ctx.restore();
        }
      });

      const url = canvas.toDataURL("image/png");
      setDataUrl(url);
    };
    orderedImageSources.forEach((src, index) => {
      const img = new Image();
      img.onload = () => {
        loadedImages[index] = img;
        loadedCount++;
        if (loadedCount === orderedImageSources.length) {
          drawCanvas();
        }
      };
      img.src = imagesData[src];
    });
  }, [imageSources]);

  return (
    <>
      <canvas ref={canvasRef} width={300} height={300} style={{ display: "none" }} />
      {dataUrl && <img src={dataUrl} alt="Triangle with 3 images" />}
    </>
  );
};

export default TriangleImage;