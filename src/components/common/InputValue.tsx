/** @format */

const InputValue = ({
  label,
  name,
  onChange,
  placeholder,
  value,
}: {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (value: any) => void;
}) => {
  return (
    <div className='flex items-center justify-between py-4'>
      <div className='flex justify-center w-[100px]'>
        <p className='text-[18px]'>{label}</p>
      </div>
      <input
        className='border-[#4D4D4D] border-2 px-[20px] py-[18px] rounded-[12px] bg-[transparent] outline-0 w-[calc(100%_-_100px)] text-right'
        onChange={onChange}
        name={name}
        value={value}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputValue;
