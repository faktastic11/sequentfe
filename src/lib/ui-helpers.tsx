import Highlighter from "react-highlight-words";
import { DataTableRowT } from "./types";

export const TableSkeleton = ({ rows = 6, columns = 7 }) => {
  return (
    <div className="animate-pulse border rounded-md">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <th key={colIndex} className="px-6 py-3">
                <div className="h-4 bg-gray-300 rounded-lg"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={columns} className="py-2"></td>
          </tr>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="odd:bg-gray-100">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <div className="h-4 bg-gray-300 rounded-lg"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


const MAX_HEIGHT_TEMPLATES = 200;
export const sourceParagraphTemplate = (rowData: DataTableRowT) => {
  return (
    <div style={{ overflow: 'auto', maxHeight: MAX_HEIGHT_TEMPLATES, fontSize: '0.7rem' }}>
      <Highlighter
        highlightClassName="highlighted-source-paragraph"
        searchWords={[rowData.source]}
        autoEscape={true}
        textToHighlight={rowData.excerpt as string}
      />
    </div>
  );
};
export const sourceSentenceTemplate = (rowData: DataTableRowT) => {
  return <div style={{ overflow: 'auto', minWidth: '200px', maxHeight: MAX_HEIGHT_TEMPLATES, fontSize: '0.8rem' }}>{rowData.source}</div>;
};