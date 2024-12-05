interface InputProps {
    label?: string;
    name?: string;
    placeholder?: string;
    type?: string;
    className?: string;
    required?: boolean;
    value?: string;
    onChange?: any
    onBlur?: any
    error?: string
}
function Input(props: InputProps = {
    label: "Label",
    name: "name",
    placeholder: "Placeholder",
    type: "text",
    className: "",
    required: false,
    value: "",
    error: "",
    onChange: () => { },
    onBlur: () => { }
}) {
    return (
        <div className="w-full my-2">
            <label htmlFor={props.name} className="text-gray-600">{props.label}</label>
            <div className="relative">
                <input 
                    type={props.type} 
                    className={`block border-2 outline-none ${props.error ? 'border-red-300 focus-visible:border-red-500' : 'border-gray-300 focus-visible:border-blue-500'} p-2 w-full transition-all duration-200 ease-in-out ${props.className}`}
                    placeholder={props.placeholder} 
                    id={props.name} 
                    required={props.required} 
                    value={props.value}
                    onChange={props.onChange} 
                    onBlur={props.onBlur} 
                />
                {props.error && (
                    <div className="absolute -bottom-5 left-0 text-red-500 text-xs mt-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {props.error}
                    </div>
                )}
            </div>
        </div>
    )
}
export default Input;
