import React from "react";
import styled from "styled-components";

const StyledFooter = styled.footer`
    color: white;
    background-color: ${(props) => props.theme.colors.dark};
    font-size: small;
    text-align: center;
    padding: 1em;
`;

export const Footer = () => {
    return <StyledFooter>&copy; 2021 Seb de Raadt</StyledFooter>;
};
