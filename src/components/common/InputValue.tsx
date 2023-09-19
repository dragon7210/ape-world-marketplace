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
    <div className='flex items-center justify-between md:py-4 py-1 relative'>
      <div className='flex justify-center w-[100px]'>
        <p className='text-[18px]'>{label}</p>
      </div>
      <input
        className='border-[#BEBEBE] border-2 md:px-[33px] md:py-4 py-2 px-3 rounded-[12px] bg-[transparent] outline-0 w-[calc(100%_-_100px)] '
        onChange={onChange}
        name={name}
        value={value}
        autoComplete='off'
      />
      <p className='absolute md:right-[33px] right-4'>{placeholder}</p>
    </div>
  );
};

export default InputValue;
