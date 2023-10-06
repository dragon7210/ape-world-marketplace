/** @format */

import { useEffect, useState } from "react";
import Select from "react-select";
const Pagination = ({
  data,
  color,
  setPageData,
}: {
  data: any;
  color: string;
  setPageData: any;
}) => {
  const array = [-1, 0, 1];
  const [perPage, setPerPage] = useState<number>(10);
  const [selPage, setSelPage] = useState<number>(1);

  const options = [
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 15, label: "15" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
  ];

  useEffect(() => {
    setPageData(data.slice((selPage - 1) * perPage, selPage * perPage));
  }, [selPage, data, perPage, setPageData]);

  return (
    <div className='flex items-center justify-between md:text-lg text-base border-gray-200 bg-transparent px-4 py-3 sm:px-6'>
      <div className='w-full flex md:justify-between justify-center'>
        <div className='hidden md:flex items-center'>
          <p className='text-gray-200'>
            Showing&nbsp;
            <span className='font-medium'>
              {data.length === 0 ? 0 : 1 + perPage * (selPage - 1)}
            </span>
            &nbsp;to&nbsp;
            <span className='font-medium'>
              {data.length > perPage * selPage
                ? perPage * selPage
                : data.length}
            </span>
            &nbsp;of&nbsp;
            <span className='font-medium'>{data.length}</span>
            &nbsp;results
          </p>
        </div>
        <div className='flex items-center justify-between md:w-[300px] w-[250px]'>
          <Select
            onChange={(e: any) => setPerPage(e.value)}
            menuPlacement='top'
            options={options}
            isClearable={false}
            defaultValue={options[1]}
            styles={{
              singleValue: (provided) => ({
                ...provided,
                color: "white",
                padding: "0px",
              }),
              menu: (baseStyles) => ({
                ...baseStyles,
                width: "40px",
                color: "white",
              }),
              control: (baseStyles) => ({
                ...baseStyles,
                background: "transparent",
                border: "solid 1px white",
                borderRadius: "4px",
                padding: "0px",
                outline: "none",
                width: "65px",
              }),
              option: (baseStyles, state) => ({
                ...baseStyles,
                color: "black",
                background: state.isSelected ? color : "white",
                padding: "2px 10px",
                ":hover": {
                  background: color,
                  cursor: "pointer",
                },
              }),
              indicatorsContainer: (state) => ({
                ...state,
                width: "30px",
              }),
              valueContainer: (state) => ({
                ...state,
                padding: "0px 0px 0px 10px",
                margin: "0px",
              }),
            }}
            components={{
              IndicatorSeparator: () => null,
            }}
          />
          <span
            className={`rounded-[99px] border-gray-100 md:p-2 p-1 border-2 items-center cursor-pointer`}
            onClick={() => {
              if (selPage > 1) {
                setSelPage(selPage - 1);
              }
            }}>
            <svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z'
                clipRule='evenodd'
              />
            </svg>
          </span>
          {((data.length % perPage === 0 &&
            data.length / perPage === selPage) ||
            (data.length % perPage !== 0 &&
              Math.floor(data.length / perPage) + 1 === selPage)) &&
            selPage > 2 && (
              <span
                className={`rounded-[99px] border-gray-100 p-1 w-8 h-8 md:w-[38px] md:h-[38px] pt-[3px] md:pt-[4px] border-2 text-center cursor-pointer`}
                onClick={() => {
                  if (selPage > 2) {
                    setSelPage(selPage - 2);
                  }
                }}>
                {selPage - 2}
              </span>
            )}
          {array.map((item: number, index: number) => {
            return (
              selPage + item <=
                (data.length % perPage === 0
                  ? data.length / perPage
                  : data.length / perPage + 1) && (
                <span
                  key={index}
                  className={`rounded-[99px] border-gray-100 p-1 w-8 h-8 md:w-[38px] md:h-[38px] pt-[3px] md:pt-[4px] border-2 text-center cursor-pointer ${
                    selPage + item === 0 && "hidden"
                  } ${item === 0 && `bg-[${color}]`}`}
                  onClick={() => {
                    if (
                      selPage + item <=
                      (data.length % perPage === 0
                        ? data.length / perPage
                        : data.length / perPage + 1)
                    ) {
                      setSelPage(selPage + item);
                    }
                  }}>
                  {selPage + item}
                </span>
              )
            );
          })}
          <span
            className={`rounded-[99px] border-gray-100 p-1 w-8 h-8 md:w-[38px] md:h-[38px] pt-[3px] md:pt-[4px] border-2 text-center cursor-pointer ${
              data.length === 0 ? "inline" : "hidden"
            }`}>
            {1}
          </span>
          <span
            className={`rounded-[99px] border-gray-100 p-1 w-8 h-8 md:w-[38px] md:h-[38px] pt-[3px] md:pt-[4px] border-2 text-center cursor-pointer ${
              data.length / perPage <= 1 ? "inline" : "hidden"
            }`}>
            {2}
          </span>
          <span
            className={`rounded-[99px] border-gray-100 p-1 w-8 h-8 md:w-[38px] md:h-[38px] pt-[3px] md:pt-[4px] border-2 text-center cursor-pointer ${
              selPage === 1 || data.length / perPage < 3 ? "inline" : "hidden"
            }`}>
            {3}
          </span>
          <span
            className={`rounded-[99px] border-gray-100 md:p-2 p-1 border-2 cursor-pointer`}
            onClick={() => {
              if (selPage < data.length / perPage) {
                setSelPage(selPage + 1);
              }
            }}>
            <svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z'
                clipRule='evenodd'
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
