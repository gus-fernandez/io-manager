// @/Pages/Presets.jsx
import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import DeviceLayout from '@/Layouts/DeviceLayout';

export default function Presets() {
    return (
        <h1>IO Presets</h1>
    );
}

Presets.layout = [AppLayout, DeviceLayout];