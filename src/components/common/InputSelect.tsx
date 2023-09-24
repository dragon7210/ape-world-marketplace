/** @format */
import Select from "react-select";

const InputSelect = ({
  label,
  onChange,
  options,
}: {
  label: string;
  onChange: (value: any) => void;
  options: any;
}) => {
  return (
    <div className='flex items-center justify-between md:py-4 py-1 md:text-xl text-sm'>
      <div className='flex justify-center md:w-[140px] w-[90px]'>
        <p>{label}</p>
      </div>
      <div className='md:w-[calc(100%_-_140px)] w-[calc(100%_-_90px)]'>
        <Select
          onChange={onChange}
          options={options}
          isClearable={true}
          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              background: "transparent",
              border: "solid 2px #BEBEBE",
              borderRadius: "8px",
              padding: "4px",
              outline: "none",
              "@media(min-width: 768px)": {
                padding: "10px 20px",
              },
            }),
            option: (provided, state) => ({
              ...provided,
              background: state.isSelected ? "#4D4D4D" : "#373953",
              ":hover": {
                background: "#4D4D4D",
                cursor: "pointer",
              },
            }),
          }}
          components={{
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
          }}
        />
      </div>
    </div>
  );
};

export default InputSelect;
