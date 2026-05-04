import React from "react";
import { StyledInput } from "common/components/StyledInput";

interface IntegerInputProps {
    id: string;
    name: string;
    value: string | number;
    placeholder?: string;
    min?: number;
    max?: number;
    hasError: boolean;
    onChange: (value: number | null) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export const IntegerInput = ({
    id,
    name,
    value,
    placeholder,
    min,
    max,
    hasError,
    onChange,
    onBlur,
}: IntegerInputProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numericValue = parseInt(e.target.value);
        if (Number.isNaN(numericValue)) {
            onChange(null);
            return;
        }
        //console.debug(`handleNumericFieldChange: e.target.value = ${e.target.value}, numericValue = ${numericValue}, isNumber = ${isNumber}.`);
        if (min !== undefined && numericValue < min) return;
        if (max !== undefined && numericValue > max) return;
        onChange(numericValue);
    };
    return (
        <StyledInput
            id={id}
            type="text"
            name={name}
            value={value}
            className={hasError ? "error" : undefined}
            onChange={handleChange}
            onBlur={onBlur}
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>
                ![
                    "0",
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                    "End",
                    "Home",
                    "Tab",
                ].includes(event.key) && event.preventDefault()
            }
            placeholder={placeholder}
        />
    );
};
