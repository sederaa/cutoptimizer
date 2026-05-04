import React, { ReactNode } from "react";
import styled from "styled-components";

interface FieldProps {
    id: string;
    label?: string;
    children: ReactNode;
}

export const Field = ({ id, label, children }: FieldProps) => {
    return (
        <StyledField>
            {children}
            <label htmlFor={id}>{label}</label>
        </StyledField>
    );
};

const StyledField = styled.div`
    position: relative;
    display: inline;
`;
