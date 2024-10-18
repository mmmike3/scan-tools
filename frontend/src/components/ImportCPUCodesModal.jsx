import React, { useState } from 'react';
import { BatchCreateCPUCodes } from '../../wailsjs/go/main/App';

function ImportCPUCodesModal({ onClose, onImportSuccess }) {
  const [store, setStore] = useState('');
  const [remark, setRemark] = useState('');
  const [codes, setCodes] = useState('');

  const handleImport = async () => {
    if (!store || !codes) {
      alert('Please fill in the store and codes fields');
      return;
    }

    const batchCreateCPUCode = {
      store: store,
      remark: remark,
      codes: codes.split('\n').filter(code => code.trim() !== '')
    };

    try {
      await BatchCreateCPUCodes(batchCreateCPUCode);
      onImportSuccess();
    } catch (error) {
      console.error('Error importing CPU codes:', error);
      alert('An error occurred while importing');
    }
  };

  return (
    <div className="import-modal">
      <h2>Import CPU Codes</h2>
      <div className="form-group">
        <label htmlFor="import-store">Store:</label>
        <input
          id="import-store"
          type="text"
          value={store}
          onChange={(e) => setStore(e.target.value)}
          placeholder="Enter store name"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="import-remark">Remark:</label>
        <input
          id="import-remark"
          type="text"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="Enter remark (optional)"
        />
      </div>
      <div className="form-group">
        <label htmlFor="import-codes">Codes (one per line):</label>
        <textarea
          id="import-codes"
          value={codes}
          onChange={(e) => setCodes(e.target.value)}
          rows="10"
          placeholder="Enter codes, one per line"
          required
        />
      </div>
      <div className="button-group">
        <button onClick={handleImport}>Import</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default ImportCPUCodesModal;
