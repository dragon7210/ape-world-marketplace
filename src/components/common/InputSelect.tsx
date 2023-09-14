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
  let newOptions: any[] = [];
  options?.collections?.map((item: any) =>
    newOptions.push({
      value: item.collectionId,
      label: (
        <div className='flex item-center'>
          <img
            src={item.thumbnailImageUrl}
            alt={item.name}
            className='rounded-[99px] mr-5 w-[28px] h-[28px]'
          />
          <p className='m-0 text-white'>{item.name}</p>
        </div>
      ),
    })
  );
  return (
    <div className='flex items-center justify-between py-4'>
      <div className='flex justify-center w-[100px]'>
        <p className='text-[18px]'>{label}</p>
      </div>
      <div className='w-[calc(100%_-_100px)]'>
        <Select
          onChange={onChange}
          options={newOptions}
          isClearable={true}
          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              borderColor: "#4D4D4D",
              padding: "13px 20px",
              background: "transparent",
              borderRadius: "12px",
              outline: "none",
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
