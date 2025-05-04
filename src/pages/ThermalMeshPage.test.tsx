import React from 'react';
import { render, screen } from '@testing-library/react';
import ThermalMeshPage from './ThermalMeshPage';
import '@testing-library/jest-dom';

describe('ThermalMeshPage', () => {
    it('renders the main header', () => {
        render(<ThermalMeshPage />);
        const header = screen.getByText(/Gestão Térmica Quântica/i);
        expect(header).toBeInTheDocument();
    });

    it('renders a simulation canvas element', () => {
        render(<ThermalMeshPage />);
        const canvas = document.querySelector('canvas');
        expect(canvas).toBeInTheDocument();
    });
});

// Dummy test for now
test("Parece que você ainda não tem testes configurados neste repositório.", () => {
    console.warn("Parece que você ainda não tem testes configurados neste repositório.");
});