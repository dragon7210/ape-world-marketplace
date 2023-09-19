/** @format */

const Pagination = ({
  data,
  selPage,
  setSelPage,
}: {
  data: any;
  selPage: number;
  setSelPage: any;
}) => {
  const array = [-1, 0, 1];
  return (
    <div className='flex items-center justify-between  border-gray-200 bg-transparent px-4 py-3 sm:px-6'>
      <div className='w-full flex md:justify-between justify-center'>
        <div className='hidden md:flex items-center'>
          <p className='text-sm text-gray-200'>
            Showing&nbsp;
            <span className='font-medium'>{1 + 10 * (selPage - 1)}</span>
            &nbsp;to&nbsp;
            <span className='font-medium'>
              {data.length > 10 * selPage ? 10 * selPage : data.length}
            </span>
            &nbsp;of&nbsp;
            <span className='font-medium'>{data.length}</span>
            &nbsp;results
          </p>
        </div>
        <div className='flex items-center justify-between w-[240px]'>
          <span
            className='rounded-[99px] border-gray-100 p-2 border-2 items-center cursor-pointer hover:bg-[#FF4200]'
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
          {array.map((item: number, index: number) => {
            return (
              selPage + item > -1 && (
                <span
                  key={index}
                  className={`rounded-[99px] border-gray-100 px-2 pt-[6px] border-2 w-[39px] h-[39px] text-center cursor-pointer hover:bg-[#FF4200] ${
                    item === 0 && "bg-[#FF4200]"
                  }`}
                  onClick={() => {
                    if (
                      selPage + item !== 0 &&
                      selPage + item <= data.length / 10
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
            className='rounded-[99px] border-gray-100 p-2 border-2 items-center cursor-pointer hover:bg-[#FF4200]'
            onClick={() => {
              if (selPage < data.length / 10) {
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
