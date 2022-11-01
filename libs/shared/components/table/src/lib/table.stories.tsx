import React, { useMemo } from 'react';
import { Table } from './table';

export default {
  component: Table,
  title: 'Table',
  argTypes: {
    onPaginationDataChange: { action: 'onPaginationDataChange' },
    onSearchInputChange: { action: 'onSearchInputChange' },
  },
};

export const Basic = () => {
  const data = [
    {
      name: 'Foo',
      address: '34t983y4t3948ty3948ty349t8uy938y4t',
      owners: ['595959593-43-043-04'],
    },
  ];

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ row }: any) => {
          const { name, address } = row.values;
          return (
            <div className="flex items-center">
              <span className="">{address}</span>
              <span className="pl-2">{name}</span>
            </div>
          );
        },
      },
      {
        Header: 'Address',
        accessor: 'address',
        Cell: ({ value }: any) => value,
      },
      {
        Header: 'Owners',
        accessor: 'owners',
        Cell: ({ value }) => (
          <div className="flex items-center space-x-2">
            <div className="flex flex-shrink-0 -space-x-1 text-gray-500">
              {value.map((owner: any, i: number) => {
                return <span key={i}>{owner}</span>;
              })}
            </div>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="w-96 m-auto mt-24">
      <Table
        columns={columns}
        data={data}
        totalAvailableRows={1}
        isLoading={false}
        pageCount={1}
        searchPlaceholder="Search Organizations..."
        onPaginationDataChange={(val) =>
          console.log('onSearchInputChange', val)
        }
        onSearchInputChange={(val) => console.log('onSearchInputChange', val)}
        fragmentIfNoData={
          <>
            <svg
              className="h-20 w-20 text-gray-200"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>

            <p className="mt-4 text-gray-300">No data</p>
          </>
        }
      />
    </div>
  );
};
