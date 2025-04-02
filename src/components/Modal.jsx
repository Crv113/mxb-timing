import React, {useEffect, useRef} from "react";
import { IoClose } from "react-icons/io5";

const Modal = ({ isOpen, onClose, title, children }) => {

    const modalRef = useRef(null);

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-fit relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-neutral-950 hover:text-neutral-600"
                >
                    <IoClose className="w-6 h-6" />
                </button>
                {title && <h2 className="text-xl font-bold mb-4 text-neutral-950">{title}</h2>}
                <div>{children}</div>
            </div>
        </div>
    );
};

export default Modal;
