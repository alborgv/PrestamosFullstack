import { useContext, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import RegisterForm from "../utils/forms/RegisterForm"

function RegisterPage() {

    const { registerUser } = useContext(AuthContext)
    const navigate = useNavigate()

    const [form, setForm] = useState({
        nit: '',
        name: '',
        lastname: '',
        password: '',
        password2: ''
    })

    // const [nit, setNit] = useState('');
    // const [name, setName] = useState('');
    // const [lastname, setLastname] = useState('');
    // const [password, setPassword] = useState('');
    // const [password2, setPassword2] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();



        const newErrors = {};

        const reqErrorMessage = "Rellena los datos requeridos"

        if (!form.nit) newErrors.nit = reqErrorMessage;
        if (!form.name) newErrors.name = reqErrorMessage;
        if (!form.lastname) newErrors.lastname = reqErrorMessage;
        if (!form.password) newErrors.password = reqErrorMessage;
        if (!form.password2) newErrors.password2 = reqErrorMessage;
        if (form.password !== form.password2) newErrors.passwords = 'Las contraseñas no coinciden.';
        if (form.password.length < 8) newErrors.length = 'La contraseña debe tener 8 carácteres.'

        setErrors(newErrors);


        if (Object.keys(newErrors).length === 0) {
            // console.log(form.nit, form.name, form.lastname, form.password, form.password2)
            registerUser(form.nit, form.name, form.lastname, form.password, form.password2);
        }
    };

    const handleInputChange = (event) => {
        console.log(event.target.id, event.target.value.trim())
        setForm({
            ...form,
            [event.target.id]: event.target.value.trim(),
        });
    };


    return (
        <div>



            <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm w-full mx-auto mt-8 ">
                <h2 className="text-2xl font-medium text-center">Registro</h2>

                {errors && <p className="block text-red-500 text-sm p-2 mb-4 rounded-lg">{Object.values(errors)[0]}</p>}

                <form onChange={handleInputChange} onSubmit={handleSubmit}>
                    <RegisterForm errors={errors}/>
                    
                    <div className="flex items-center justify-between">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                            Registrarse
                        </button>                    
                        <Link className="inline-block align-baseline font-medium text-sm text-blue-500 hover:text-blue-800" to="/login">¿Ya tienes cuenta? Ingresa</Link>
                    </div>
                </form>
            </div>


        </div>

    )

}



export default RegisterPage;