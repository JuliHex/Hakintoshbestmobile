import { Icon } from '../lib/icons.jsx';

export default function Accordion({ title, children, className = '', ...props }) {
    return (
        <details className={`card accordion ${className}`} {...props}>
            <summary><Icon name="chevron" className="chevron w-4 h-4" />{title}</summary>
            {children}
        </details>
    );
}
