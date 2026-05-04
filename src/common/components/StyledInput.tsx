import styled from "styled-components";

export const StyledInput = styled.input`
    margin-right: 0.7em;
    border-radius: 3px;
    border: solid 1px ${(props) => props.theme.colors.border};
    background-color: white;
    width: 100%;
    min-width: 6em;

    &:first-child {
        margin-left: 0;
    }

    &:focus {
        border-color: ${(props) => props.theme.colors.dark};
        outline: solid 1px ${(props) => props.theme.colors.dark};
    }

    // label in placeholder position
    & ~ label {
        position: absolute;
        transform-origin: 0 50%;
        transition: transform 200ms, color 200ms;
        left: 8px;
        top: 4px;
        pointer-events: none;
    }

    // label in above-input position
    &:focus ~ label,
    &:not(:placeholder-shown) ~ label {
        background-color: ${(props) => props.theme.colors.dark};
        border-radius: 3px;
        padding: 0.1em 1em;
        color: white;
        font-size: small;
        transform: translateY(-14px) translateX(10px) scale(0.75);
    }

    &:not(:placeholder-shown) ~ label {
        background-color: ${(props) => props.theme.colors.border};
    }

    &:focus ~ label {
        background-color: ${(props) => props.theme.colors.dark};
    }

    &.error {
        border-color: ${(props) => props.theme.colors.error};
        outline: solid 1px ${(props) => props.theme.colors.error};
    }

    &.error:placeholder-shown ~ label {
        color: ${(props) => props.theme.colors.error};
    }

    &.error:not(:placeholder-shown) ~ label,
    &.error:focus ~ label {
        background-color: ${(props) => props.theme.colors.error};
        color: white;
    }
`;
