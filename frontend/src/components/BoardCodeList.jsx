import React, { useState, useEffect } from 'react';
import { ListBoardCodes } from '../../wailsjs/go/main/App';
import ImportBoardCodesModal from './ImportBoardCodesModal';
import '../styles/BoardCodeList.css';

function BoardCodeList() {
  const [boardCodes, setBoardCodes] = useState([]);
  const [filter, setFilter] = useState({
    code: '',
    brand: '',
    status: '',
    remark: '',
    created_at_from: '',
    created_at_to: '',
    updated_at_from: '',
    updated_at_to: '',
  });
  const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0 });
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  useEffect(() => {
    fetchBoardCodes();
  }, [filter, pagination.page, pagination.size]);

  const fetchBoardCodes = async () => {
    try {
      const copiedFilter = {
        code: filter['code'],
        brand: filter['brand'],
        status: filter['status'],
        remark: filter['remark'],
    }
    // Exclude the last four items if they are empty strings
    const keysToCheck = ['created_at_from', 'created_at_to', 'updated_at_from', 'updated_at_to'];
    keysToCheck.forEach(key => {
      if (filter[key] !== '') {
        copiedFilter[key] = filter[key];
      }
    });
      const response = await ListBoardCodes(pagination.page, pagination.size, copiedFilter);
      setBoardCodes(response.data);
      setPagination(prev => ({ ...prev, total: response.pagination.total }));
    } catch (error) {
      console.error('Error fetching board codes:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleImportSuccess = () => {
    fetchBoardCodes();
    setIsImportModalOpen(false);
  };

  return (
    <div className="board-code-list">
      <h1 className="page-title">Board Code Management</h1>
      
      <div className="center-align">
        <button onClick={() => setIsImportModalOpen(true)}>Import Board Codes</button>
      </div>

      <h2>Filter Board Codes</h2>
      <div className="filter-container">
        <div className="filter-row">
          <div className="filter-item">
            <label htmlFor="code">Code:</label>
            <input id="code" name="code" value={filter.code} onChange={handleFilterChange} placeholder="Enter code" />
          </div>
          <div className="filter-item">
            <label htmlFor="brand">Brand:</label>
            <input id="brand" name="brand" value={filter.brand} onChange={handleFilterChange} placeholder="Enter brand" />
          </div>
        </div>
        <div className="filter-row">
          <div className="filter-item">
            <label htmlFor="status">Status:</label>
            <input id="status" name="status" value={filter.status} onChange={handleFilterChange} placeholder="Enter status" />
          </div>
          <div className="filter-item">
            <label htmlFor="remark">Remark:</label>
            <input id="remark" name="remark" value={filter.remark} onChange={handleFilterChange} placeholder="Enter remark" />
          </div>
        </div>
        <div className="filter-row">
          <div className="filter-item">
            <label htmlFor="created_at_from">Created From:</label>
            <input id="created_at_from" name="created_at_from" type="datetime-local" value={filter.created_at_from} onChange={handleFilterChange} />
          </div>
          <div className="filter-item">
            <label htmlFor="created_at_to">Created To:</label>
            <input id="created_at_to" name="created_at_to" type="datetime-local" value={filter.created_at_to} onChange={handleFilterChange} />
          </div>
        </div>
        <div className="filter-row">
          <div className="filter-item">
            <label htmlFor="updated_at_from">Updated From:</label>
            <input id="updated_at_from" name="updated_at_from" type="datetime-local" value={filter.updated_at_from} onChange={handleFilterChange} />
          </div>
          <div className="filter-item">
            <label htmlFor="updated_at_to">Updated To:</label>
            <input id="updated_at_to" name="updated_at_to" type="datetime-local" value={filter.updated_at_to} onChange={handleFilterChange} />
          </div>
        </div>
      </div>
      
      <h2>Board Codes List</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {/*<th>ID</th>*/}
              <th>Code</th>
              <th>Brand</th>
              <th>Status</th>
              <th>Remark</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {boardCodes.map(boardCode => (
              <tr key={boardCode.ID}>
                {/*<td>{boardCode.ID}</td> */}
                <td>{boardCode.Code}</td>
                <td>{boardCode.Brand}</td>
                <td>{boardCode.Status}</td>
                <td>{boardCode.Remark}</td>
                <td>{new Date(boardCode.CreatedAt).toLocaleDateString()}</td>
                <td>{new Date(boardCode.UpdatedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-controls">
        <button onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))} disabled={pagination.page === 1}>
          Previous
        </button>
        <span>Page {pagination.page} of {Math.ceil(pagination.total / pagination.size)}</span>
        <button onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))} disabled={pagination.page * pagination.size >= pagination.total}>
          Next
        </button>
      </div>

      {isImportModalOpen && (
        <ImportBoardCodesModal
          onClose={() => setIsImportModalOpen(false)}
          onImportSuccess={handleImportSuccess}
        />
      )}
    </div>
  );
}

export default BoardCodeList;
