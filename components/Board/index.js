import { useEffect, useLayoutEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

import { useRouter } from "next/navigation";

import { COLORS, MENU_ITEMS } from "@/constants";
import { actionItemClick } from '@/slice/menuSlice'

import { socket } from "@/socket";

import { toast } from "react-toastify";

const Board = ({ id, canvasFile }) => {
    const dispatch = useDispatch()
    const canvasRef = useRef(null)
    const router = useRouter();
    const drawHistory = useRef([])
    const drawPoints = useRef([])
    const historyPointer = useRef(0)
    const shouldDraw = useRef(false)
    const { activeMenuItem, actionMenuItem } = useSelector((state) => state.menu)
    const { color, size } = useSelector((state) => state.toolbox[activeMenuItem])

    const handleSubmit = async (newCanvasFile) => {
        try {
            const res = await fetch(`https://draw-io-eight.vercel.app/api/topics/${id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ newCanvasFile }),
            });

            if (!res.ok) {
                toast.error("Couldn't save image.")
            }
            else {
                toast.success('Saved successfully.')
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (!canvasRef.current) return
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d')
        if (actionMenuItem === MENU_ITEMS.PENCIL) {
            context.globalCompositeOperation = 'source-over';
            console.log('over')
        }
        else if (actionMenuItem === MENU_ITEMS.ERASER) {
            context.globalCompositeOperation = 'destination-out';
            console.log('out')
        }
        else if (actionMenuItem === MENU_ITEMS.DOWNLOAD) {
            const URL = canvas.toDataURL()
            const anchor = document.createElement('a')
            anchor.href = URL
            anchor.download = 'sample.jpg'
            anchor.click()
        } else if (actionMenuItem === MENU_ITEMS.UNDO || actionMenuItem === MENU_ITEMS.REDO) {
            if (historyPointer.current > 0 && actionMenuItem === MENU_ITEMS.UNDO) historyPointer.current -= 1
            if (historyPointer.current < drawHistory.current.length - 1 && actionMenuItem === MENU_ITEMS.REDO) historyPointer.current += 1
            const imageData = drawHistory.current[historyPointer.current]
            context.putImageData(imageData, 0, 0)
        } else if (actionMenuItem == MENU_ITEMS.SAVE) {
            const newCanvasFile = canvas.toDataURL();
            handleSubmit(newCanvasFile);
        }
        else if (actionMenuItem == MENU_ITEMS.HOME) {
            const newCanvasFile = canvas.toDataURL();
            handleSubmit(newCanvasFile);
            router.push('/');
        }
        dispatch(actionItemClick(null))
    }, [id, router, color, size, actionMenuItem, dispatch])

    useEffect(() => {
        if (!canvasRef.current) return
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d')

        const changeConfig = (color, size) => {
            context.strokeStyle = color ? color : COLORS.BLACK
            context.lineWidth = size ? size : 3
        }

        const handleChangeConfig = (config) => {
            console.log("config", config)
            changeConfig(config.color, config.size)
        }
        changeConfig(color, size)
    }, [id, color, size])

    useEffect(() => {
        if (!canvasRef.current) return
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d')

        canvas.width = 1900
        canvas.height = 1000
        var image = new Image();
        image.onload = function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0);
        }
        image.src = canvasFile;
    }, [canvasFile])

    // before browser pain
    useLayoutEffect(() => {
        if (!canvasRef.current) return
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d')

        const beginPath = (x, y) => {
            context.beginPath()
            context.moveTo(x, y)
            drawPoints.current.push({ x, y });
        }

        const closePath = (x, y) => {
            context.closePath()
            drawPoints.current = [];
        }

        const drawLine = (x, y, withColor = null, withSize = null) => {
            context.lineTo(x, y)
            drawPoints.current.push({ x, y });
            if (withColor != null) {
                context.strokeStyle = withColor
            }

            if (withSize != null) {
                context.lineWidth = withSize;
            }

            context.stroke()
            context.strokeStyle = color
            context.strokeStyle = size
            
        }
        const handleMouseDown = (e) => {
            drawPoints.current = [];
            shouldDraw.current = true
            beginPath(e.pageX || e.touches[0].clientX, e.pageY || e.touches[0].clientY)
            // socket.emit('beginPath', { x: e.pageX || e.touches[0].clientX, y: e.pageY || e.touches[0].clientY, id: id })
        }

        const handleMouseMove = (e) => {
            if (!shouldDraw.current) return
            drawLine(e.pageX || e.touches[0].clientX, e.pageY || e.touches[0].clientY)
            // socket.emit('drawLine', { x: e.pageX || e.touches[0].clientX, y: e.pageY || e.touches[0].clientY, id: id, color: color, size: size })
        }

        const handleMouseUp = (e) => {
            shouldDraw.current = false
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
            drawHistory.current.push(imageData)
            historyPointer.current = drawHistory.current.length - 1
            socket.emit('drawPolling', { points: drawPoints.current, id: id, color: color, size: size })
        }

        const handleBeginPath = (path) => {
            beginPath(path.x, path.y)
        }

        const handleDrawLine = (path) => {
            drawLine(path.x, path.y, path.color, path.size)
        }

        const handleDrawPolling = (path) => {
            console.log(path);
            drawPolling(path.points, path.color, path.size)
        }

        const drawPolling = (points, withColor = null, withSize = null) => {
            if (withColor != null) {
                console.log(withColor);
                context.strokeStyle = withColor
                console.log(context.stroke);
                console.log(context.strokeStyle);
            }

            if (withSize != null) {
                console.log(withSize);
                context.lineWidth = withSize;
            }

            if (!points || points.length < 1) return;
            beginPath(points[0].x, points[0].y);
            for (const point of points) {
                drawLine(point.x, point.y);
            }
            closePath();
            context.strokeStyle = color
            context.strokeStyle = size
        }

        canvas.addEventListener('mousedown', handleMouseDown)
        canvas.addEventListener('mousemove', handleMouseMove)
        canvas.addEventListener('mouseup', handleMouseUp)

        canvas.addEventListener('touchstart', handleMouseDown)
        canvas.addEventListener('touchmove', handleMouseMove)
        canvas.addEventListener('touchend', handleMouseUp)


        // socket.on('beginPath' + id, handleBeginPath)
        // socket.on('drawLine' + id, handleDrawLine)
        socket.on('drawPolling' + id, handleDrawPolling)

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown)
            canvas.removeEventListener('mousemove', handleMouseMove)
            canvas.removeEventListener('mouseup', handleMouseUp)

            canvas.removeEventListener('touchstart', handleMouseDown)
            canvas.removeEventListener('touchmove', handleMouseMove)
            canvas.removeEventListener('touchend', handleMouseUp)

            // socket.off('beginPath' + id, handleBeginPath)
            // socket.off('drawLine' + id, handleDrawLine)
        }
    }, [color, size, id])

    return (<canvas ref={canvasRef}></canvas>)
}

export default Board;
