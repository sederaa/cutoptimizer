import React from "react";
import styled from "styled-components";
import { Heading } from "common/components/Heading";

const Masthead = styled(Heading)`
    font-size: 3em;
    margin: 0 auto;
    color: white;
    text-align: center;
`;

const StyledHeader = styled.header`
    padding: 1.5rem;
    background-color: ${(props) => props.theme.colors.dark};

    p {
        color: white;
        text-align: center;
        margin: 0;
        font-size: small;
    }
`;

export const Header = () => {
    return (
        <StyledHeader>
            <Masthead>
                CUT <img src="logo.svg" alt="logo" /> OPTIMIZER
            </Masthead>
            <p>Optimize your linear material cuts to reduce waste and save money</p>
        </StyledHeader>
    );
};
