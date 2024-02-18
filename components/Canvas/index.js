"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

const Canvas = ({ canvasFile }) => {
    const canvasRef = useRef(null)

    useEffect(() => {
        if (!canvasRef.current) return
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d')
        canvas.width = 414
        canvas.height = 225
        var image = new Image();
        image.src = canvasFile;
        image.onload = function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
    }, [])

    return (<canvas ref={canvasRef}></canvas>)
}

export default Canvas;
