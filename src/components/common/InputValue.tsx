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
    <div className='flex items-center justify-between md:py-3 py-1 relative md:text-lg text-sm'>
      <div className='flex justify-center md:w-20 w-16'>
        <p>{label}</p>
      </div>
      <input
        className='border-[#BEBEBE] border-2 md:px-[33px] px-3 py-2 md:py-3 rounded-lg bg-[transparent] outline-0 md:w-[calc(100%_-_80px)] w-[calc(100%_-_64px)]'
        onChange={onChange}
        name={name}
        value={value}
        autoComplete='off'
      />
      <p className='absolute md:right-[33px] right-4 font-[100] md:text-base text-sm text-gray-400'>
        {placeholder}
      </p>
    </div>
  );
};

export default InputValue;
