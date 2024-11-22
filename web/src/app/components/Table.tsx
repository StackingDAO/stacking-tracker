import { ToolTip } from "./Tooltip";

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
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full py-2 align-middle">
        <table className="w-full table-fixed">
          <thead>
            <tr className="[&>*:first-child]:rounded-l-md [&>*:first-child]:pl-4 [&>*:last-child]:rounded-r-md">
              {columnHeaders.map((header: any) => (
                <th
                  key={header.title}
                  scope="col"
                  className="bg-gray whitespace-nowrap py-2 text-left text-sm font-normal text-white/[0.35]"
                >
                  <div className="flex items-center">
                    {header.title}
                    {header.info && (
                      <ToolTip
                        id={`table_${header.title.replace(" ", "-")}`}
                        text={header.info}
                        className="ml-1"
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="[&>*:first-child]:pl-4">
                {row.map((rowItem, index) => (
                  <td
                    key={index}
                    className="whitespace-nowrap py-3 pl-4 pr-3 text-sm text-gray-500 sm:pl-0"
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
