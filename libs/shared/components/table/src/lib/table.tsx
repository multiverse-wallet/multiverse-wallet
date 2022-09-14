import { Spinner } from '@multiverse-wallet/shared/components/spinner';
import { TextField } from '@multiverse-wallet/shared/components/text-field';
import debounce from 'lodash/debounce';
import React, { useEffect, useRef, useState } from 'react';
import { Column, usePagination, useTable } from 'react-table';

function returnSmallest(num1: number, num2: number) {
  return num1 < num2 ? num1 : num2;
}

interface TablePaginationProps {
  totalAvailableRows: any;
  itemsPerPage: any;
  numPages: any;
  currPage: any;
  gotoPage: any;
  canPreviousPage: any;
  previousPage: any;
  canNextPage: any;
  nextPage: any;
  isLoading: any;
}

function TablePagination({
  totalAvailableRows,
  itemsPerPage,
  numPages,
  currPage,
  gotoPage,
  canPreviousPage,
  previousPage,
  canNextPage,
  nextPage,
  isLoading,
}: TablePaginationProps) {
  // We can only show the first and last two numbers if the number of pages is greater than 5
  const pageNumbers = Array.from(new Array(numPages))
    .map((_, i) => i + 1)
    .filter((num) => num < 3 || num > numPages - 2);

  const showNumberSeparator = numPages > 5;

  return (
    <div className="w-full px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
        >
          Previous
        </button>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div className="flex flex-row items-center">
          {isLoading ? (
            <p className="text-sm leading-5 text-gray-700 mr-4">Loading...</p>
          ) : (
            <p className="text-sm leading-5 text-gray-700 mr-4">
              Showing
              <span className="font-medium mx-1">
                {itemsPerPage * currPage - itemsPerPage + 1}
              </span>
              to
              <span className="font-medium mx-1">
                {returnSmallest(itemsPerPage * currPage, totalAvailableRows)}
              </span>
              of
              <span className="font-medium mx-1">{totalAvailableRows}</span>
            </p>
          )}
        </div>
        <div>
          <nav className="relative z-0 inline-flex shadow-sm">
            <button
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 border-r-0 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150 ${
                canPreviousPage ? '' : 'cursor-not-allowed opacity-50'
              }`}
              aria-label="First page"
            >
              {/* Heroicon name: chevron-double-left */}
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150 ${
                canPreviousPage ? '' : 'cursor-not-allowed opacity-50'
              }`}
              aria-label="Previous"
            >
              {/* Heroicon name: chevron-left */}
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {pageNumbers
              .filter((num) => num < 3)
              .map((num) => {
                return (
                  <button
                    key={num}
                    onClick={() => gotoPage(num - 1)}
                    className={`-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150 ${
                      currPage === num ? 'bg-teal-50 text-teal-600' : ''
                    }`}
                  >
                    {num}
                  </button>
                );
              })}

            {showNumberSeparator && (
              <span className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700">
                ...
              </span>
            )}

            {pageNumbers
              .filter((num) => num > 2)
              .map((num) => {
                return (
                  <button
                    key={num}
                    onClick={() => gotoPage(num - 1)}
                    className={`-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150 ${
                      currPage === num ? 'bg-teal-50 text-teal-600' : ''
                    }`}
                  >
                    {num}
                  </button>
                );
              })}

            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className={`-ml-px relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150 ${
                canNextPage ? '' : 'cursor-not-allowed opacity-50'
              }`}
              aria-label="Next"
            >
              {/* Heroicon name: chevron-right */}
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => gotoPage(numPages - 1)}
              disabled={!canNextPage}
              className={`-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150 ${
                canNextPage ? '' : 'cursor-not-allowed opacity-50'
              }`}
              aria-label="Final page"
            >
              {/* Heroicon name: chevron-double-right */}
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

interface TableToolbarProps {
  leftActions?: JSX.Element;
  isDisabled: boolean;
  searchPlaceholder: string;
  itemsPerPage: number;
  setPageSize: (pageSize: number) => void;
  onSearchInputChange: (val: string) => void;
}

function TableToolbar({
  leftActions,
  isDisabled,
  searchPlaceholder,
  onSearchInputChange,
  itemsPerPage,
  setPageSize,
}: TableToolbarProps) {
  const inputRef = useRef(null);

  return (
    <div className="flex flex-col md:flex-row md:items-center mb-6">
      <div className="mb-6 md:mb-0 flex-1">
        {leftActions ? leftActions : ''}
      </div>

      <div className="flex justify-between md:items-center">
        <div className="w-1/3 pr-4">
          <select
            id="selectItemsPerPage"
            disabled={isDisabled}
            className={`h-11 block focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md transition duration-150 ease-in-out block w-full pl-3 pr-10 py-2 bg-gray-50 text-base leading-6 border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5 ${
              isDisabled ? 'cursor-not-allowed bg-gray-100 text-gray-500' : ''
            }`}
            defaultValue={itemsPerPage}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>

        <div className="w-2/3 md:w-42 lg:w-80">
          <TextField
            id="tableSearchInput"
            size="small"
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            isDisabled={isDisabled}
            defaultValue=""
            onChange={debounce(onSearchInputChange, 500)}
            inputRef={inputRef}
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
}

interface TableProps<D extends Record<string, unknown>> {
  columns: Array<Column<D>>;
  data?: D[]; // undefined if data is being loaded from the server
  totalAvailableRows: number;
  onPaginationDataChange: ({
    pageSize,
    pageIndex,
  }: {
    pageSize: number;
    pageIndex: number;
  }) => void;
  isLoading: boolean;
  pageCount: number;
  fragmentIfNoData: JSX.Element;
  toolbarLeftActions?: JSX.Element;
  searchPlaceholder: string;
  onSearchInputChange: (val: string) => void;
}

export function Table({
  columns,
  data,
  totalAvailableRows,
  onPaginationDataChange,
  isLoading,
  pageCount: controlledPageCount,
  fragmentIfNoData,
  toolbarLeftActions,
  searchPlaceholder,
  onSearchInputChange,
}: TableProps<any>) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // Get the state from the instance
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: data || [],
      initialState: { pageIndex: 0 }, // Pass our hoisted table state
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      pageCount: controlledPageCount,
    } as any,
    usePagination
  ) as any;
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    onPaginationDataChange({ pageIndex, pageSize });
  }, [onPaginationDataChange, pageIndex, pageSize]);

  function handleSearchInputChange(val: string) {
    setSearchTerm(val);
    onSearchInputChange(val);
  }

  return (
    <>
      <TableToolbar
        // Search input is disabled if the input is empty and there is still no data
        isDisabled={isLoading || (data?.length === 0 && !searchTerm)}
        searchPlaceholder={searchPlaceholder}
        onSearchInputChange={handleSearchInputChange}
        leftActions={toolbarLeftActions}
        itemsPerPage={pageSize}
        setPageSize={setPageSize}
      />

      <div className="flex flex-col">
        <div
          className={`overflow-x-auto relative border-b border-gray-200 rounded min-h-12 shadow ${
            isLoading ? 'h-96' : ''
          }`}
          style={{
            backgroundImage: `linear-gradient(to right, white, white), linear-gradient(to right, white, white), linear-gradient(to right, rgba(0, 0, 20, .20), rgba(255, 255, 255, 0)), linear-gradient(to left, rgba(0, 0, 20, .20), rgba(255, 255, 255, 0))`,
            backgroundPosition: `left center, right center, left center, right center`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: 'white',
            backgroundSize: '20px 100%, 20px 100%, 10px 100%, 10px 100%',
            backgroundAttachment: 'local, local, scroll, scroll',
          }}
        >
          {isLoading && (
            <div className="z-10 absolute flex flex-col justify-center items-center h-full w-full bg-white opacity-75">
              <Spinner size="large" variant="dark" />
            </div>
          )}

          {/* Ensure the container has some height while loading the initial dataset */}
          {isLoading && data === undefined && (
            <div className="h-96 w-full"></div>
          )}

          {/* Data is available (i.e. the server has responded), but empty */}
          {!isLoading && data && !data.length && (
            <div className="bg-white divide-y divide-gray-200 h-96">
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                {fragmentIfNoData}
              </div>
            </div>
          )}

          {data && data.length > 0 && (
            <table
              className="table-auto w-full min-w-full divide-y divide-gray-200"
              {...getTableProps()}
            >
              <thead>
                {headerGroups.map((headerGroup: any) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column: any) => (
                      <th
                        className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                        {...column.getHeaderProps()}
                      >
                        {column.render('Header')}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? ' 🔽'
                              : ' 🔼'
                            : ''}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody
                className="divide-y divide-gray-200"
                {...getTableBodyProps()}
              >
                {page.map((row: any) => {
                  // Prepare the row for display
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell: any) => {
                        return (
                          <td
                            className="px-6 py-4 whitespace-nowrap text-sm leading-5 font-medium truncate"
                            {...cell.getCellProps()}
                          >
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {data && data.length > 0 && (
            <TablePagination
              totalAvailableRows={totalAvailableRows}
              itemsPerPage={pageSize}
              currPage={pageIndex + 1}
              numPages={pageCount}
              gotoPage={gotoPage}
              canPreviousPage={canPreviousPage}
              previousPage={previousPage}
              canNextPage={canNextPage}
              nextPage={nextPage}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </>
  );
}
