

const inputs = [
    {
        id: 'nit',
        label: 'NIT',
        type: 'text',
        require: true
    },
    {
        id: 'name',
        label: 'Nombres',
        type: 'text',
        require: true
    },
    {
        id: 'last_name',
        label: 'Apellidos',
        type: 'text',
        require: true
    },
    {
        id: 'phone',
        label: 'Celular',
        type: 'number',
        require: false
    },
    {
        id: 'email',
        label: 'Email',
        type: 'email',
        require: false
    }
];


const CreateCustomerForm = (errors) => {

    return (
        <div>
            {inputs.map((input) => (
                <div className="mb-5" key={input.id}>
                    <label htmlFor={input.id} className="block text-gray-700 font-medium text-xs mb-2 ml-2 text-left">
                        {input.require ? <span className="text-red-500">* </span> : ''} {input.label}: 
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


export default CreateCustomerForm;