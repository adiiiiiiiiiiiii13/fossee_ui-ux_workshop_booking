import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';

export default function FormField({ type = 'input', children, ...props }) {
  if (type === 'select') {
    return <Select {...props}>{children}</Select>;
  }
  
  if (type === 'textarea') {
    return <Textarea {...props} />;
  }
  
  return <Input {...props} />;
}