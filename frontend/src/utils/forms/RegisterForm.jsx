

const inputs = [
    {
        id: 'nit',
        label: 'NIT',
        type: 'text',
        placeholder: 'Ingrese su NIT'
    },
    {
        id: 'name',
        label: 'Nombre',
        type: 'text',
        placeholder: 'Ingrese su nombre'
    },
    {
        id: 'lastname',
        label: 'Apellido',
        type: 'text',
        placeholder: 'Ingrese su apellido'
    },
    {
        id: 'password',
        label: 'Contraseña',
        type: 'password',
        placeholder: '********'
    },
    {
        id: 'password2',
        label: 'Confirmar contraseña',
        type: 'password',
        placeholder: '********'
    },
];


const RegisterForm = (errors) => {
    
    return (
        <div>
            {inputs.map((input) => (
                <div className="mb-5" key={input.id}>
                    <label htmlFor={input.id} className="block text-gray-700 font-medium text-xs mb-2 ml-2 text-left">
                        <span className="text-red-500">* </span>{input.label}: 
                    </label>
                    <input 
                        type={input.type}
                        id={input.id}
                        className={`${errors.errors[input.id] ? 'border-red-500' : ''} appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                        placeholder={input.placeholder}
                        >
                    </input>
                </div>
            ))}
        </div>
    );

};


export default RegisterForm;