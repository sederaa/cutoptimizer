import { CutModel } from "main/models/CutModel";
import * as yup from "yup";
import { nameofFactory } from "common/utilities/nameofFactory";

export interface StockModel {
    id: number;
    instanceId: number;
    length: number;
    quantity: number;
    price?: number;
    name: string;
    _cuts?: CutModel[]; // used at the end to group all cuts into the stock they come from
}

export const nameofStockModel = nameofFactory<StockModel>();

export const StockModelValidationSchema: yup.SchemaOf<StockModel> = yup.object().shape({
    id: yup.number().typeError("must be number").required("is required"),
    instanceId: yup.number().typeError("must be number").required("is required"),
    length: yup.number().typeError("must be number").required("is required"),
    quantity: yup.number().typeError("must be number").required("is required"),
    price: yup.number().typeError("must be number").optional(),
    name: yup.string().typeError("must be string").required("is required"),
    _cuts: yup.array().optional(),
});
