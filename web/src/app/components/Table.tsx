type Props = {
  columnTitles: string[];
  rows: React.ReactNode[][];
};

export function Table({ columnTitles, rows }: Props) {
  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              {columnTitles.map((title: string) => (
                <th
                  key={title}
                  scope="col"
                  className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  {title}
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
