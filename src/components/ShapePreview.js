import React from 'react';

export default function ShapePreview({ type, size }) {
    const common = {
        width: size,
        height: size,
        display: 'inline-block'
    };
    if (type === 'circle') {
        return <div style={{
            ...common,
            borderRadius: '50%',
            background: '#555'
        }}/>
    }
    if (type === 'square') {
        return <div style={{
            ...common,
            background: '#333'
        }}/>
    }
    if (type === 'triangle') {
        return <div style={{
            width: 0,
            height: 0,
            borderLeft: `${size/2}px solid transparent`,
            borderRight: `${size/2}px solid transparent`,
            borderBottom: `${size}px solid #111`
        }}/>
    }
    return null;
}
