import React from 'react';

export default function Header({
                                   name,
                                   onNameChange,
                                   onExport,
                                   onImportClick,
                                   fileInputRef,
                                   onFileChange
                               }) {
    return (
        <header className="Header">
            <input
                className="DrawingName"
                value={name}
                onChange={e => onNameChange(e.target.value)}
            />
            <div className="HeaderButtons">
                <button onClick={onExport}>Export</button>
                <button onClick={onImportClick}>Import</button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={onFileChange}
                />
            </div>
        </header>
    );
}
