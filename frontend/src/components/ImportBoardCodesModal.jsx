import React, { useState } from 'react';
import { BatchCreateBoardCodes } from '../../wailsjs/go/main/App';

function ImportBoardCodesModal({ onClose, onImportSuccess }) {
  const [brand, setBrand] = useState('');
  const [remark, setRemark] = useState('');
  const [codes, setCodes] = useState('');

  const handleImport = async () => {
    if (!brand || !codes) {
      alert('Please fill in the brand and codes fields');
      return;
    }

    const batchCreateBoardCode = {
      brand: brand,
      remark: remark,
      codes: codes.split('\n').filter(code => code.trim() !== '')
    };

    try {
      await BatchCreateBoardCodes(batchCreateBoardCode);
      onImportSuccess();
    } catch (error) {
      console.error('Error importing board codes:', error);
      alert('An error occurred while importing');
    }
  };

  return (
    <div className="import-modal">
      <h2>Import Board Codes</h2>
      <div className="form-group">
        <label htmlFor="import-brand">Brand:</label>
        <input
          id="import-brand"
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Enter brand name"
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

export default ImportBoardCodesModal;
