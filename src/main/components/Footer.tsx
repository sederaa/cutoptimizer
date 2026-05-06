import styled from "styled-components";
import { Temporal } from 'temporal-polyfill'

const StyledFooter = styled.footer`
    color: white;
    background-color: ${(props) => props.theme.colors.dark};
    font-size: small;
    text-align: center;
    padding: 1em;
`;

export const Footer = () => {
    return <StyledFooter>&copy; 2021-{Temporal.Now.plainDateISO().year} Seb de Raadt</StyledFooter>;
};
