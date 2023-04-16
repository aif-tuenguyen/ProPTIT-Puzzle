import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import React from 'react';
import { ColumnMyTable } from './type';

interface IMyTableProps {
  selectedAllData?: any;
  selectedSomeData?: any;
  selectedItems?: any[];
  handleSelectAllData?: any;
  handleSelectOneData?: any;
  columns: ColumnMyTable[];
  data: any[];
  total?: number;
  limit?: number;
  page?: number;
  handlePageChange?: any;
  handleLimitChange?: any;
  disabled?: boolean;
}

const MyTable: React.FC<IMyTableProps> = ({
  selectedAllData,
  selectedSomeData,
  handleSelectAllData,
  handleSelectOneData,
  columns,
  data,
  selectedItems,
  total,
  limit,
  page,
  handleLimitChange,
  handlePageChange,
  disabled
}) => {
  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {selectedItems && (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAllData}
                    indeterminate={selectedSomeData}
                    onChange={handleSelectAllData}
                    disabled={disabled}
                  />
                </TableCell>
              )}

              {columns.map((column, index) => (
                <TableCell key={index} align={column.align}>
                  {column.Header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => {
              const isSelected =
                selectedItems && selectedItems.includes(row.id);
              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  {selectedItems && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => handleSelectOneData(event, row.id)}
                        value={isSelected}
                        disabled={disabled}
                      />
                    </TableCell>
                  )}

                  {columns.map((column, index) => {
                    return (
                      <TableCell key={index} align={column.align}>
                        {column.Cell ? (
                          column.Cell(row)
                        ) : (
                          <Typography noWrap>{row[column.accessor]}</Typography>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {page >= 0 && (
        <Box p={2}>
          <TablePagination
            component="div"
            count={total}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[10, 20, 30, 40, 50]}
          />
        </Box>
      )}
    </>
  );
};

export default MyTable;
