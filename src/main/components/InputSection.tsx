import React from "react";
import { InputModelValidationErrors } from "main/models/InputModel";
import { Cuts } from "main/components/Cuts";
import { Stock } from "main/components/Stock";
import { Settings } from "main/components/Settings";
import { CutModel } from "main/models/CutModel";
import { StockModel } from "main/models/StockModel";

interface InputSectionProps {
    cuts: CutModel[];
    stock: StockModel[];
    kerf: number;
    onKerfChanged: (kerf: number) => void;
    onCutsChanged: (cuts: CutModel[]) => void;
    onStockChanged: (stock: StockModel[]) => void;
    errors?: InputModelValidationErrors;
}

export const InputSection = ({
    kerf,
    cuts,
    stock,
    onKerfChanged,
    onCutsChanged,
    onStockChanged,
    errors,
}: InputSectionProps) => {
    return (
        <>
            <Cuts cuts={cuts} onCutsChanged={onCutsChanged} errors={errors?.cuts} />
            <Stock stock={stock} onStockChanged={onStockChanged} errors={errors?.stocks} />
            <Settings kerf={kerf} onKerfChanged={onKerfChanged} kerfError={errors?.kerf} />
        </>
    );
};
