interface ButtonProps {
    label: string;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    className?: string;
}

function Button(props: ButtonProps = {
    label: "Button",
    type: "button",
    className: "",
    onClick: () => { }
}) {
    return (
        <button
            type={props.type}
            className={`bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 
            transition-all my-2 ${props.className}`}
            onClick={props.onClick}
        >
            {props.label}
        </button>
    )
}

export default Button
