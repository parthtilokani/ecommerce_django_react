export const systemDynamicFields = [
  {
    id: "1",
    name: "Text",
    element: () => (
      <input
        type='text'
        placeholder='Text'
        className='form-control'
        name='text'
      />
    ),
  },
  {
    id: "2",
    name: "Number",
    element: () => (
      <input
        type='number'
        placeholder='Number'
        className='form-control'
        name='number'
      />
    ),
  },
  {
    id: "5",
    name: "PhoneNumber",
    element: () => (
      <input
        type='tel'
        placeholder='Phone Number'
        className='form-control'
        name='phonenumber'
      />
    ),
  },
  {
    id: "8",
    name: "Price",
    element: () => (
      <input
        type='number'
        placeholder='Price'
        className='form-control'
        name='price'
      />
    ),
  },
  {
    id: "6",
    name: "Date",
    element: () => <input type='date' className='form-control' name='date' />,
  },
  {
    id: "7",
    name: "Time",
    element: () => <input type='time' className='form-control' name='time' />,
  },
  {
    id: "3",
    name: "Select",
    element: () => (
      <select className='form-control' name='select'>
        <option>--click--</option>
        <option>one</option>
        <option>two</option>
        <option>three</option>
      </select>
    ),
  },
  {
    id: "4",
    name: "TextArea",
    element: () => <textarea className='form-control' name='textarea' />,
  },
];

export const getSystemDynamicField = ({
  onChange,
  options,
  field_type,
  field_name,
  value,
  idx,
  className,
}) => {
  switch (field_type) {
    case "Text":
      return (
        <input
          type='text'
          className={className || "form-control"}
          id={field_name}
          value={value}
          onChange={(e) => onChange(e, idx)}
        />
      );
    case "Number":
      return (
        <input
          type='number'
          className={className || "form-control"}
          id={field_name}
          value={value}
          onChange={(e) => onChange(e, idx)}
        />
      );
    case "PhoneNumber":
      return (
        <input
          type='tel'
          className={className || "form-control"}
          id={field_name}
          value={value}
          onChange={(e) => onChange(e, idx)}
        />
      );
    case "Price":
      return (
        <input
          type='number'
          className={className || "form-control"}
          id={field_name}
          value={value}
          onChange={(e) => onChange(e, idx)}
        />
      );
    case "Date":
      return (
        <input
          type='date'
          className={className || "form-control"}
          id={field_name}
          value={value}
          onChange={(e) => onChange(e, idx)}
        />
      );
    case "Time":
      return (
        <input
          type='time'
          className={className || "form-control"}
          id={field_name}
          value={value}
          onChange={(e) => onChange(e, idx)}
        />
      );
    case "Select":
      return (
        <select
          className={className || "form-control"}
          id={field_name}
          value={value}
          onChange={(e) => onChange(e, idx)}>
          <option value=''>--select--</option>
          {options?.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    case "TextArea":
      return (
        <textarea
          className={className || "form-control"}
          id={field_name}
          value={value}
          onChange={(e) => onChange(e, idx)}
        />
      );
    default:
      break;
  }
};
