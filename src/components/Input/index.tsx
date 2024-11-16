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
}
function Input(props: InputProps = {
    label: "Label",
    name: "name",
    placeholder: "Placeholder",
    type: "text",
    className: "",
    required: false,
    value: "",
    onChange: () => { },
    onBlur: () => { }
}) {
    return (
        <div className="w-full my-2 gap-1">
            <label htmlFor={props.name} className="text-gray-600">{props.label}</label>
            <input type={props.type} className={`block border-2 border-gray-300 p-2 w-full ${props.className}`}
                placeholder={props.placeholder} id={props.name} required={props.required} value={props.value}
                onChange={props.onChange} onBlur={props.onBlur} />
        </div>
    )
}
export default Input;
