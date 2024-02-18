"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from './index.module.css'
import { toast } from "react-toastify";

export default function AddBoard() {
    const [name, setName] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(name);
        if (!name) {
            toast.info("Name is required.");
            return;
        }
        var canvasFile = "";

        try {
            const res = await fetch("http://localhost:3000/api/topics", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ name, canvasFile }),
            });
            if (res.ok) {
                var data = await res.json();
                toast.success("Board is created.");
                router.push('/editTopic/' + data.id);
            } else {
                throw new Error("Failed to create a topic");
            }
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="d-flex position-sticky bottom-10 d-flex justify-content-center align-items-center gap-2">
            <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border border-slate-500 px-8 py-2"
                type="text"
                placeholder="Board name"
            />
            <button className={styles.button} href={"/addTopic"}>
                <FontAwesomeIcon icon={faPlusCircle} className={styles.wrapper}></FontAwesomeIcon>
            </button>
        </form>
    );
}
