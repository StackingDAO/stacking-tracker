"use client";

import { Tooltip } from "react-tooltip";
import InfoIcon from "./InfoIcon";

type ColumnHeaders = {
  title: string;
  info?: string;
};

type Props = {
  columnHeaders: ColumnHeaders[];
  rows: React.ReactNode[][];
};

export function Table({ columnHeaders, rows }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg bg-white border border-gray-200">
      {columnHeaders.map((header: any) => (
        <>
          {header.info && (
            <Tooltip
              anchorSelect={`#${header.title}`}
              place="top"
              className="max-w-xs"
            >
              {header.info}
            </Tooltip>
          )}
        </>
      ))}

      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              {columnHeaders.map((header: any) => (
                <th
                  key={header.title}
                  scope="col"
                  className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  <div className="flex">
                    {header.title}
                    {header.info && (
                      <InfoIcon
                        className="text-black ml-1 mt-0.5"
                        id={`${header.title}`}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row, index) => (
              <tr key={index}>
                {row.map((rowItem, index) => (
                  <td
                    key={index}
                    className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0"
                  >
                    {rowItem}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
