import React from "react";
import { IntegerInput } from "common/components/IntegerInput";
import { Field } from "common/components/Field";

interface IntegerFieldProps {
    id: string;
    name: string;
    value: string | number;
    min?: number;
    max?: number;
    label?: string;
    error?: string;
    onChange: (value: number | null) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export const IntegerField = ({ id, name, value, min, max, label, error, onChange, onBlur }: IntegerFieldProps) => {
    return (
        <Field id={id} label={label}>
            <IntegerInput
                id={id}
                name={name}
                value={value}
                hasError={error !== undefined}
                onChange={onChange}
                onBlur={onBlur}
                placeholder=" "
            />
        </Field>
    );
};
