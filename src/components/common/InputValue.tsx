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
    <div className='flex items-center justify-between md:py-4 py-1 relative md:text-xl text-sm'>
      <div className='flex justify-center md:w-[140px] w-[90px]'>
        <p>{label}</p>
      </div>
      <input
        className='border-[#BEBEBE] border-2 md:px-[33px] md:py-4 py-2 px-3 rounded-lg bg-[transparent] outline-0 md:w-[calc(100%_-_140px)] w-[calc(100%_-_90px)]'
        onChange={onChange}
        name={name}
        value={value}
        autoComplete='off'
      />
      <p className='absolute md:right-[33px] right-4 font-[100] md:text-lg text-sm'>
        {placeholder}
      </p>
    </div>
  );
};

export default InputValue;
