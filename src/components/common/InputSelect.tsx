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
    <div className='flex items-center justify-between md:py-4 py-1'>
      <div className='flex justify-center w-[100px]'>
        <p className='text-xl'>{label}</p>
      </div>
      <div className='w-[calc(100%_-_100px)]'>
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
              "@media(min-width: 1200px)": {
                width: "282px",
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
