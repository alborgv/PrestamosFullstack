import { FaRegCopyright } from 'react-icons/fa';

export default function Footer() {
    return (
        <div className="bg-gray-800 p-2 text-white text-center flex justify-center items-center">
            <FaRegCopyright className="mr-2" />
            <span>Todos los derechos reservados</span>
        </div>
    );
}
